const UserActionsService = require("../Services/UserActions");

module.exports = {
    actionOnIdea: async (req, res) => {
        try {
            const data = { ip: req.ip, userId: req.user.id, body: req.body };
            const { action, id } = req.params;
            const actions = await UserActionsService.actionOnIdea(data, id, action);
            res.status(201).json({ result: actions });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    ConnectionRequest: async (req, res) => {
        try {
            const { userId, targetUserId, action } = req.params;
            const actions = await UserActionsService.ConnectionRequest(parseInt(userId), parseInt(targetUserId), action);
            res.status(201).json({ result: actions });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getConnectionData: async (req, res) => {
        const { userId } = req.params;
        const field = req.query.field || null;
        if (!userId && !field) {
            return res.status(400).json({ message: 'User ID and field are required' });
        }
        try {
            const result = await UserActionsService.getConnectionData(parseInt(userId), field);
            return res.status(200).json({
                message: `Accepted Connection requests.`,
                userConnection: result,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    },

    // Log a new user action
    logUserAction: async (req, res) => {
        try {
            const newAction = await UserActionsService.logUserAction(req.body);
            return res.status(201).json(newAction);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get actions of a specific user
    getUserActions: async (req, res) => {
        try {
            const { userId } = req.params;
            const actions = await UserActionsService.getUserActions(userId);
            return res.status(200).json(actions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get actions by action type
    getActionsByType: async (req, res) => {
        try {
            const { actionType } = req.params;
            const actions = await UserActionsService.getActionsByType(actionType);
            return res.status(200).json(actions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get actions for a specific entity
    getEntityActions: async (req, res) => {
        try {
            const { entityType, entityId } = req.params;
            const actions = await UserActionsService.getEntityActions(entityType, entityId);
            return res.status(200).json(actions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Count actions by type
    countActionsByType: async (req, res) => {
        try {
            const { actionType } = req.params;
            const count = await UserActionsService.countActionsByType(actionType);
            return res.status(200).json({ count });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get recent actions
    getRecentActions: async (req, res) => {
        try {
            const { limit } = req.query;
            const actions = await UserActionsService.getRecentActions(limit);
            return res.status(200).json(actions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get popular entities based on user actions
    getPopularEntities: async (req, res) => {
        try {
            const { entityType } = req.params;
            const popularEntities = await UserActionsService.getPopularEntities(entityType);
            return res.status(200).json(popularEntities);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Get actions by date range
    getActionsByDateRange: async (req, res) => {
        try {
            const { startDate, endDate } = req.params;
            const actions = await UserActionsService.getActionsByDateRange(startDate, endDate);
            return res.status(200).json(actions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Delete a user action
    deleteUserAction: async (req, res) => {
        try {
            const { id } = req.params;
            await UserActionsService.deleteUserAction(id);
            return res.status(204).json({ message: 'User action deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Update a user action
    updateUserAction: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedAction = await UserActionsService.updateUserAction(id, updateData);
            return res.status(200).json(updatedAction);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    
};
