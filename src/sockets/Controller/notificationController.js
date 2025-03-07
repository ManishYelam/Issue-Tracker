const NotificationService = require('../Service/NotificationService');

module.exports = {
  getNotifications: async (req, res) => {
    try {
      const userId = req.user_info.id;
      const { page, limit, sortBy, order, search, ...filters } = req.query;

      const notificationData = await NotificationService.getNotification(userId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        sortBy: sortBy || 'createdAt',
        order: order || 'DESC',
        search: search || '',
        filters,
      });

      return res.status(200).json({
        success: true,
        message: 'Notifications fetched successfully',
        data: notificationData,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
        error: error.message,
      });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const userId = req.user_info.id;
      const { notificationId } = req.query;
      const result = await NotificationService.deleteNotification(userId, notificationId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to delete notification.' });
    }
  },
};
