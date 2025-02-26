const ideaService = require('../Services/IdeaService');

module.exports = {
    createIdea: async (req, res) => {
        try {
            const data = { ip: req.ip, userId: req.user.id };
            const idea = await ideaService.createIdeaWithUserAction(data, req.body);
            res.status(201).json({ result: idea });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getAllIdeas: async (req, res) => {
        try {
            const ideas = await ideaService.getAllIdeas();
            res.status(200).json({ data: ideas });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getIdeaById: async (req, res) => {
        try {
            const idea = await ideaService.getIdeaById(req.params.id);
            res.status(200).json({ data: idea });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    getIdeaByUserId: async (req, res) => {
        try {
            const idea = await ideaService.getIdeaByUserId(req.params.id);
            res.status(200).json({ data: idea });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    updateIdea: async (req, res) => {
        try {
            const updatedIdea = await ideaService.updateIdea(req.params.id, req.body);
            res.status(200).json({ result: updatedIdea });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteIdea: async (req, res) => {
        try {
            await ideaService.deleteIdea(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    incrementViews: async (req, res) => {
        try {
            const updatedIdea = await ideaService.incrementViews(req.params.id);
            res.status(200).json({ result: updatedIdea });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    upvoteIdea: async (req, res) => {
        try {
            console.log(req.user)
            const updatedIdea = await ideaService.upvoteIdea(req.params.id);
            res.status(200).json(updatedIdea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    addComment: async (req, res) => {
        try {
            const updatedIdea = await ideaService.addComment(req.params.id, req.body.comment);
            res.status(200).json(updatedIdea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    searchIdeasByTitle: async (req, res) => {
        try {
            const ideas = await ideaService.searchIdeasByTitle(req.params.title);
            res.status(200).json({ ideas: ideas });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getLatestIdeas: async (req, res) => {
        try {
            const ideas = await ideaService.getLatestIdeas();
            res.status(200).json(ideas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getPopularIdeas: async (req, res) => {
        try {
            const ideas = await ideaService.getPopularIdeas();
            res.status(200).json(ideas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getRecommendedIdeas: async (req, res) => {
        try {
            const ideas = await ideaService.getRecommendedIdeas();
            res.status(200).json(ideas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getRelatedIdeas: async (req, res) => {
        try {
            const ideas = await ideaService.getRelatedIdeas(req.params.id);
            res.status(200).json(ideas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getIdeaComments: async (req, res) => {
        try {
            const comments = await ideaService.getIdeaComments(req.params.id);
            res.status(200).json(comments);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    followIdea: async (req, res) => {
        try {
            const updatedIdea = await ideaService.followIdea(req.params.id);
            res.status(200).json(updatedIdea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getIdeaFollowers: async (req, res) => {
        try {
            const followers = await ideaService.getIdeaFollowers(req.params.id);
            res.status(200).json(followers);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    reportIdea: async (req, res) => {
        try {
            const updatedIdea = await ideaService.reportIdea(req.params.id);
            res.status(200).json(updatedIdea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    updateIdeaStatus: async (req, res) => {
        try {
            const updatedIdea = await ideaService.updateIdeaStatus(req.params.id, req.body.status);
            res.status(200).json(updatedIdea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getIdeasByStatus: async (req, res) => {
        try {
            const ideas = await ideaService.getIdeasByStatus(req.params.status);
            res.status(200).json(ideas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getIdeasByUser: async (req, res) => {
        try {
            const ideas = await ideaService.getIdeasByUser(req.params.userId);
            res.status(200).json(ideas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getFavoriteIdeas: async (req, res) => {
        try {
            const ideas = await ideaService.getFavoriteIdeas(req.params.userId);
            res.status(200).json(ideas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    addToFavorites: async (req, res) => {
        try {
            const updatedIdea = await ideaService.addToFavorites(req.params.userId, req.params.ideaId);
            res.status(200).json(updatedIdea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    removeFromFavorites: async (req, res) => {
        try {
            const updatedIdea = await ideaService.removeFromFavorites(req.params.userId, req.params.ideaId);
            res.status(200).json(updatedIdea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
