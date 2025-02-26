const { Op } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const { Idea, UserActions } = require('../Models/Association');

module.exports = {
    createIdeaWithUserAction: async (data, ideaData) => {
        const transaction = await sequelize.MAIN_DB_NAME.transaction();
        try {
            const newIdea = await Idea.create(
                { ...ideaData, user_id: data.userId },
                { transaction }
            );

            await UserActions.create({
                user_id: data.userId,
                action_type: 'create',
                entity_type: 'idea',
                entity_id: newIdea.id,
                details: {
                    title: ideaData.title,
                    description: ideaData.description,
                },
                ip_address: data.ip || '127.0.0.1',
                user_agent: ideaData.user_agent || 'unknown',
                device_type: ideaData.device_type || 'desktop',
                location: ideaData.location || 'unknown',
                idea_id: newIdea.id
            }, { transaction });

            await transaction.commit();
            return { success: true, idea: newIdea };
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating idea and user action:', error);
            throw new Error('Transaction failed: ' + error.message);
        }
    },

    getAllIdeas: async () => {
        return await Idea.findAll();
    },

    getIdeaById: async (id) => {
        return await Idea.findByPk(id);
    },

    getIdeaByUserId: async (userId) => {
        const ideas = await Idea.findAll({
            include: {
                model: UserActions,
                as: 'ideaactions',
                where: {
                    user_id: userId,
                    entity_type: 'idea',
                },
                attributes: [],
                required: true,
            },
        });
        if (!ideas.length) {
            throw new Error('No ideas found for this user.');
        }
        return ideas;
    },

    updateIdea: async (id, updateData) => {
        const idea = await Idea.findByPk(id);
        if (!idea) throw new Error('Idea not found');
        return await idea.update(updateData);
    },

    deleteIdea: async (id) => {
        const idea = await Idea.findByPk(id);
        if (!idea) throw new Error('Idea not found');
        return await idea.destroy();
    },

    incrementViews: async (id) => {
        const idea = await Idea.findByPk(id);
        if (!idea) throw new Error('Idea not found');
        idea.views_count++;
        return await idea.save();
    },

    upvoteIdea: async (id) => {
        const idea = await Idea.findByPk(id);
        if (!idea) throw new Error('Idea not found');
        idea.upvotes++;
        return await idea.save();
    },

    addComment: async (id) => {
        const idea = await Idea.findByPk(id);
        if (!idea) throw new Error('Idea not found');
        idea.comments++;
        await idea.save();

        return await idea.save();
    },

    searchIdeasByTitle: async (title) => {
        return await Idea.findAll({ where: { title: { [Op.like]: `%${title}%` } } });
    },

    getLatestIdeas: async () => {
        return await Idea.findAll({ order: [['posted', 'DESC']], limit: 10 });
    },

    getPopularIdeas: async () => {
        return await Idea.findAll({ order: [['upvotes', 'DESC']], limit: 10 });
    },

    getRecommendedIdeas: async () => {
        return await Idea.findAll({ order: [['views_count', 'DESC']], limit: 10 });
    },

    getRelatedIdeas: async (id) => {
        const idea = await Idea.findByPk(id);
        return await Idea.findAll({ where: { industry: idea.industry, id: { [Op.ne]: id } } });
    },

    getIdeaComments: async (id) => {
        return await Idea.findByPk(id, { attributes: ['comments'] });
    },

    followIdea: async (id) => {
        return await Idea.increment('followers_count', { where: { id } });
    },

    getIdeaFollowers: async (id) => {
        return await Idea.findByPk(id, { attributes: ['followers_count'] });
    },

    reportIdea: async (id) => {
        return await Idea.update({ reported: true }, { where: { id } });
    },

    updateIdeaStatus: async (id, status) => {
        return await Idea.update({ status }, { where: { id } });
    },

    getIdeasByStatus: async (status) => {
        return await Idea.findAll({ where: { status } });
    },

    getIdeasByUser: async (userId) => {
        return await Idea.findAll({ where: { userId } });
    },

    getFavoriteIdeas: async (userId) => {
        return await Idea.findAll({ where: { favoritedBy: userId } });
    },

    addToFavorites: async (userId, ideaId) => {
        const idea = await Idea.findByPk(ideaId);
        return await Idea.update({ favoritedBy: userId });
    },

    removeFromFavorites: async (userId, ideaId) => {
        const idea = await Idea.findByPk(ideaId);
        if (idea.favoritedBy.includes(userId)) {
            throw new Error('Idea already favorited by this user');
        }
        idea.favoritedBy.push(userId);
        await idea.update({ favoritedBy: idea.favoritedBy });
        await UserActions.create({
            user_id: userId,
            action_type: 'favorite',
            entity_type: 'idea',
            entity_id: ideaId,
            favorited_by: userId,
            timestamp: new Date(),
            status: 'active',
        });
    }
}