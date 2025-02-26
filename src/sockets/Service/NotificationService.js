const Notification = require("../../Api/Models/Chat/Notification");

module.exports = {
    getNotification: async (user_id, { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC', search = '', filters = {} }) => {
        try {
            const offset = (page - 1) * limit;
            const whereCondition = {
                userId: user_id,
                ...filters,
                ...(search && {
                    [Op.or]: [
                        { title: { [Op.iLike]: `%${search}%` } },
                        { message: { [Op.iLike]: `%${search}%` } },
                    ]
                })
            };
            const notifications = await Notification.findAndCountAll({
                where: whereCondition,
                order: [[sortBy, order]],
                limit,
                offset,
            });
            return {
                total: notifications.count,
                pages: Math.ceil(notifications.count / limit),
                currentPage: page,
                notifications: notifications.rows,
            };
        } catch (error) {
            throw error;
        }
    },

    deleteNotification: async (user_id, notificationId) => {
        try {
            const deleted = await Notification.destroy({
                where: {
                    id: notificationId,
                    userId: user_id
                }
            });
            if (deleted === 0) {
                throw new Error('Notification not found or already deleted.');
            }
            return { message: 'Notification deleted successfully.', deleted: deleted };
        } catch (error) {
            throw error;
        }
    },

    notificationService: (socket, io, onlineUsers) => {
        console.log(`Notification service connected: ${socket.id}`);     

        // Send notification to specific user
        socket.on('send_notification', async (data) => {
            try {
                const { userId, type, title, message, roomId, isImportant } = data;

                const notification = await Notification.create({
                    userId,
                    type,
                    title,
                    message,
                    roomId,
                    isImportant,
                    status: 'sent',
                    sentBy: socket.user.id
                });

                (onlineUsers[userId])
                    ? io.to(onlineUsers[userId].socketId).emit('receive_notification', {
                        ...notification.toJSON(),
                        from: 'System',
                    })
                    : console.log(`User ${userId} is offline. Notification saved in DB.`);

            } catch (error) {
                console.error('Error sending notification:', error);
            }
        });

        // Mark notification as read
        socket.on('mark_as_read', async (notificationId) => {
            try {
                const notification = await Notification.findByPk(notificationId);
                if (notification) {
                    notification.isRead = true;
                    notification.readAt = new Date();
                    await notification.save();
                    console.log(`Notification ${notificationId} marked as read.`);
                }
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket ${socket.id} disconnected from notification service`);
        });
    },

}