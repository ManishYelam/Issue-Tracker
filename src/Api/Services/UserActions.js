const { Op } = require('sequelize');
const { UserActions, Idea, UserConnection, Comment, Like, Favorite } = require('../Models/Association');
const { updateStats } = require('../Models/Trigger');
const { sequelize } = require('../../Config/Database/db.config');
const { exists } = require('fs-extra');

module.exports = {
    actionOnIdea: async (data, ideaId, action) => {
        const transaction = await sequelize.MAIN_DB_NAME.transaction();
        try {
            // 1. Fetch Idea with Locking
            const idea = await Idea.findByPk(ideaId, {
                transaction,
                lock: true,
                include: [{
                    model: Comment,
                    where: { status: 'active' },
                    required: false
                }]
            });
            if (!idea) throw new Error('Idea not found');

            // 2. Action Handler Map
            const actionHandlers = {
                comment: async () => {
                    try {
                        if (!data.body.commentText?.trim()) {
                            throw new Error('Comment text cannot be empty');
                        }
                        const [comment, created] = await Comment.findOrCreate({
                            where: {
                                id: data.body.commentId,
                                user_id: data.userId,
                                idea_id: ideaId
                            },
                            defaults: {
                                comment_text: data.body.commentText,
                                parent_comment_id: data.body.parentCommentId || null,
                                ip_address: data.ip || '127.0.0.1',
                                device_type: data.deviceType || 'unknown',
                                is_edited: false,
                                edited_at: null,
                            },
                            transaction
                        });
                        if (!created) {
                            comment.comment_text = data.body.commentText;
                            comment.is_edited = true;
                            comment.edited_at = new Date();
                            await comment.save({ transaction });
                        }
                        await updateStats('comments', 'idea', ideaId, 'increment', transaction);
                        return comment;
                    } catch (error) {
                        console.error('Error processing comment:', error.message);
                        throw error;
                    }
                },

                commentLikeDislike: async () => {
                    try {
                        if (!data.body.commentId) {
                            throw new Error('Comment ID is required');
                        }
                        const comment = await Comment.findOne({
                            where: { id: data.body.commentId, status: 'active' },
                            transaction
                        });
                        if (!comment) {
                            throw new Error('Comment not found or inactive');
                        }
                        const field = data.body.likeOrDislike === 'like' ? 'likes_by' : 'dislikes_by';
                        const updatedUsers = new Set(comment[field] || []);

                        updatedUsers.has(data.userId)
                            ? updatedUsers.delete(data.userId)
                            : updatedUsers.add(data.userId);

                        await comment.update({ [field]: Array.from(updatedUsers) }, { transaction });
                        return comment;
                    } catch (error) {
                        console.error(`Error processing comment ${actionType}:`, error.message);
                        throw error;
                    }
                },

                deleteComment: async () => {
                    try {
                        const comment = await Comment.findOne({
                            where: {
                                id: data.body.commentId,
                                idea_id: ideaId,
                                user_id: data.userId
                            },
                            transaction
                        });
                        if (!comment) {
                            throw new Error('Comment not found or unauthorized');
                        }
                        await comment.destroy({ transaction });
                        await updateStats('comments', 'idea', ideaId, 'decrement', transaction);
                        return { success: true, message: 'Comment deleted successfully' };
                    } catch (error) {
                        console.error('Error deleting comment:', error.message);
                        throw error;
                    }
                },

                flag_comment: async () => {
                    try {
                        const comment = await Comment.findOne({
                            where: {
                                id: data.body.commentId,
                                idea_id: ideaId,
                                status: 'active'
                            },
                            transaction
                        });
                        if (!comment) {
                            throw new Error('Comment not found');
                        }
                        const flaggedBy = Array.isArray(comment.flagged_by) ? new Set(comment.flagged_by) : new Set();
                        flaggedBy.add(data.userId);
                        await comment.update({ status: 'flagged', flagged_by: Array.from(flaggedBy) }, { transaction });
                        return { success: true, message: 'Comment flagged successfully' };
                    } catch (error) {
                        console.error('Error flagging comment:', error.message);
                        throw error;
                    }
                },

                like: async () => {
                    const [like, created] = await Like.findOrCreate({
                        where: { user_id: data.userId, entity_id: idea.id, entity_type: "Idea" },
                        defaults: { user_id: data.userId, entity_id: idea.id, entity_type: "Idea" },
                        transaction
                    });
                    if (!created) {
                        await like.destroy({ transaction });
                        await updateStats('upvotes', 'idea', ideaId, 'decrement', transaction);
                        return { success: true, message: 'Like removed' };
                    }
                    await updateStats('upvotes', 'idea', ideaId, 'increment', transaction);
                    return { success: true, message: 'Idea liked' };
                },

                favorite: async () => {
                    const [fav, created] = await Favorite.findOrCreate({
                        where: { user_id: data.userId, idea_id: idea.id },
                        defaults: { user_id: data.userId, idea_id: idea.id },
                        transaction
                    });
                    if (!created) {
                        await fav.destroy({ transaction });
                        await updateStats('favorites', 'idea', idea.id, 'decrement', transaction);
                        return { success: true, message: 'Favorite removed' };
                    }
                    await updateStats('favorites', 'idea', idea.id, 'increment', transaction);
                    return { success: true, message: 'Idea favorited' };
                },

                // ✅ Generic Handler for Common Actions
                genericAction: async (actionType) => {
                    const existingAction = await UserActions.findOne({
                        where: {
                            user_id: data.userId,
                            action_type: actionType,
                            entity_id: idea.id,
                            entity_type: 'idea'
                        },
                        transaction
                    });

                    if (existingAction) {
                        await existingAction.destroy({ transaction });
                        await idea.decrement(`${actionType}_count`, { transaction });
                        return { success: true, message: `Removed ${actionType}` };
                    }

                    await UserActions.create({
                        user_id: data.userId,
                        action_type: actionType,
                        entity_type: 'idea',
                        entity_id: idea.id,
                        ip_address: data.ip || '127.0.0.1',
                        user_agent: data.userAgent || 'unknown'
                    }, { transaction });

                    await idea.increment(`${actionType}_count`, { transaction });
                    return { success: true, message: `Added ${actionType}` };
                }
            };

            // 3. Execute Action Handler
            if (actionHandlers[action]) {
                const result = await actionHandlers[action]();
                await transaction.commit();
                return result;
            } else {
                const result = await actionHandlers.genericAction(action);
                await transaction.commit();
                return result;
            }

        } catch (error) {
            await transaction.rollback();
            console.error(`Action Failed: ${action}`, error.message);
            throw error;
        }
    },

    ConnectionRequest: async (userId, targetUserId, action) => {
        try {
            const actionHandlers = {
                sendRequest: async () => {
                    const [userConnection, created] = await UserConnection.findOrCreate({
                        where: { user_id: userId },
                        defaults: {
                            sended_requests: [],
                            pending_requests: [],
                            accepted_requests: [],
                            rejected_requests: [],
                            blocked_requests: [],
                            visibility: 'connections_only',
                            mutual_connections_count: 0,
                            is_favorite: [],
                            interaction_count: 0,
                        },
                    });
                    const [targetConnection, targetCreated] = await UserConnection.findOrCreate({
                        where: { user_id: targetUserId },
                        defaults: {
                            sended_requests: [],
                            pending_requests: [],
                            accepted_requests: [],
                            rejected_requests: [],
                            blocked_requests: [],
                            visibility: 'connections_only',
                            mutual_connections_count: 0,
                            is_favorite: [],
                            interaction_count: 0,
                        },
                    });
                    if (userConnection.sended_requests.includes(targetUserId)) {
                        userConnection.set('sended_requests', userConnection.sended_requests.filter(id => id !== targetUserId));
                        targetConnection.set('pending_requests', targetConnection.pending_requests.filter(id => id !== userId));
                        await userConnection.save();
                        await targetConnection.save();
                        return { message: 'Connection request already sent, reversed the request.', userConnection, targetConnection };
                    }

                    userConnection.set('sended_requests', [...userConnection.sended_requests, targetUserId]);
                    targetConnection.set('pending_requests', [...targetConnection.pending_requests, userId]);
                    await userConnection.save();
                    await targetConnection.save();
                    return { message: 'Connection request sent successfully.', userConnection, targetConnection };
                },

                acceptRequest: async () => {
                    const userConnection = await UserConnection.findOne({ where: { user_id: userId } });

                    if (!userConnection || !userConnection.pending_requests.includes(targetUserId)) {
                        throw new Error('Connection request not found in pending requests.');
                    }

                    const updatedPendingRequests = userConnection.pending_requests.filter(id => id !== targetUserId);
                    userConnection.set('pending_requests', updatedPendingRequests);

                    const updatedAcceptedRequests = [...userConnection.accepted_requests, targetUserId];
                    userConnection.set('accepted_requests', updatedAcceptedRequests);

                    const updatedConnectedUsers = [...userConnection.connected_user_ids, targetUserId];
                    userConnection.set('connected_user_ids', updatedConnectedUsers);

                    // await module.exports.updateMutualConnections(userId, targetUserId);
                    // await module.exports.updateInteractionUsers(userId, targetUserId);

                    await userConnection.save();
                    return userConnection;
                },

                rejectRequest: async () => {
                    const userConnection = await UserConnection.findOne({ where: { user_id: userId } });

                    if (!userConnection || !userConnection.pending_requests.includes(targetUserId)) {
                        throw new Error('Connection request not found.');
                    }

                    const updatedPendingRequests = userConnection.pending_requests.filter(id => id !== targetUserId);
                    userConnection.set('pending_requests', updatedPendingRequests);

                    const updatedRejectedRequests = [...userConnection.rejected_requests, targetUserId];
                    userConnection.set('rejected_requests', updatedRejectedRequests);
                    await userConnection.save();
                    return userConnection;
                },

                blockUser: async () => {
                    const userConnection = await UserConnection.findOne({ where: { user_id: userId } });
                    if (!userConnection) {
                        throw new Error('User connection not found');
                    }

                    if (userConnection.blocked_requests.includes(targetUserId)) {
                        throw new Error('User already blocked.');
                    }

                    // Remove the target user from connected user ids
                    const updatedConnectedUsers = userConnection.connected_user_ids.filter(id => id !== targetUserId);
                    userConnection.set('connected_user_ids', updatedConnectedUsers);

                    // Add the target user to blocked requests
                    const updatedBlockedRequests = [...userConnection.blocked_requests, targetUserId];
                    userConnection.set('blocked_requests', updatedBlockedRequests);

                    // Store the block timestamp
                    userConnection.set('blocked_at', new Date());

                    await userConnection.save();

                    return userConnection;
                },

                unblockUser: async () => {
                    const userConnection = await UserConnection.findOne({ where: { user_id: userId } });

                    if (!userConnection || !userConnection.blocked_requests.includes(targetUserId)) {
                        throw new Error('User not blocked.');
                    }

                    // Remove target user from blocked requests
                    const updatedBlockedRequests = userConnection.blocked_requests.filter(id => id !== targetUserId);
                    userConnection.set('blocked_requests', updatedBlockedRequests);

                    // Optionally, clear the blocked timestamp if necessary
                    userConnection.set('blocked_at', null);
                    await userConnection.save();
                    return userConnection;
                },

                markAsFavorite: async () => {
                    const userConnection = await UserConnection.findOne({ where: { user_id: userId } });

                    if (!userConnection || !userConnection.connected_user_ids.includes(targetUserId)) {
                        throw new Error('User is not connected.');
                    }

                    // Check if the user is already marked as favorite
                    if (userConnection.is_favorite.includes(targetUserId)) {
                        throw new Error('User already marked as favorite.');
                    }

                    // Add targetUserId to the favorite list
                    const updatedFavorites = [...userConnection.is_favorite, targetUserId];
                    userConnection.set('is_favorite', updatedFavorites);
                    await userConnection.save();
                    return userConnection;
                },

                updateMutualConnections: async (userId, targetUserId) => {
                    const userConnection = await UserConnection.findOne({ where: { user_id: userId } });
                    const targetConnection = await UserConnection.findOne({ where: { user_id: targetUserId } });
            
                    if (!userConnection || !targetConnection) {
                        throw new Error('User connections not found.');
                    }
            
                    // Find mutual connections by comparing connected users
                    const mutualConnections = userConnection.connected_user_ids.filter(id =>
                        targetConnection.connected_user_ids.includes(id)
                    );
            
                    // Store mutual connection IDs
                    userConnection.set('mutual_connection_ids', mutualConnections);
                    targetConnection.set('mutual_connection_ids', mutualConnections);
            
                    await userConnection.save();
                    await targetConnection.save();
                },
            
                updateInteractionUsers: async (userId, targetUserId) => {
                    const userConnection = await UserConnection.findOne({ where: { user_id: userId } });
                    const targetConnection = await UserConnection.findOne({ where: { user_id: targetUserId } });
            
                    if (!userConnection || !targetConnection) {
                        throw new Error('User connections not found.');
                    }
            
                    // Add target user to interaction list if not already present
                    if (!userConnection.interaction_user_ids.includes(targetUserId)) {
                        userConnection.set('interaction_user_ids', [...userConnection.interaction_user_ids, targetUserId]);
                    }
            
                    if (!targetConnection.interaction_user_ids.includes(userId)) {
                        targetConnection.set('interaction_user_ids', [...targetConnection.interaction_user_ids, userId]);
                    }
            
                    await userConnection.save();
                    await targetConnection.save();
                },

            };

            if (actionHandlers[action]) {
                const result = await actionHandlers[action]();
                return result;
            } else {
                const result = await actionHandlers.genericAction(action);
                return result;
            }

        } catch (error) {
            console.error(`Action Failed: ${action}`, error.message);
            throw error;
        }
    },

    getConnectionData: async (userId, field) => {
        const attributes = field ? [field] : null;
        const connection = await UserConnection.findOne({ where: { user_id: userId }, attributes });
        return connection ? (field ? connection[field] : connection) : (field ? [] : {});
    },

    logUserAction: async (actionData) => {
        return await UserActions.create(actionData);
    },

    getUserActions: async (userId) => {
        return await UserActions.findAll({ where: { user_id: userId } });
    },

    getActionsByType: async (actionType) => {
        return await UserActions.findAll({ where: { action_type: actionType } });
    },

    getEntityActions: async (entityType, entityId) => {
        return await UserActions.findAll({ where: { entity_type: entityType, entity_id: entityId } });
    },

    countActionsByType: async (actionType) => {
        return await UserActions.count({ where: { action_type: actionType } });
    },

    getRecentActions: async (limit = 10) => {
        return await UserActions.findAll({ order: [['timestamp', 'DESC']], limit });
    },

    getPopularEntities: async (entityType) => {
        return await UserActions.findAll({
            attributes: ['entity_id', [sequelize.fn('COUNT', sequelize.col('entity_id')), 'count']],
            where: { entity_type: entityType },
            group: ['entity_id'],
            order: [[sequelize.literal('count'), 'DESC']],
            limit: 10,
        });
    },

    getActionsByDateRange: async (startDate, endDate) => {
        return await UserActions.findAll({
            where: {
                timestamp: { [Op.between]: [startDate, endDate] }
            }
        });
    },

    deleteUserAction: async (id) => {
        const action = await UserActions.findByPk(id);
        if (!action) throw new Error('User action not found');
        return await action.destroy();
    },

    updateUserAction: async (id, updateData) => {
        const action = await UserActions.findByPk(id);
        if (!action) throw new Error('User action not found');
        return await action.update(updateData);
    },


};
