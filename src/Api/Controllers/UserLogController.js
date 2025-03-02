const userLogService = require('../Services/UserLogService');

module.exports = {
  // Create a new user log
  createUserLog: async (req, res) => {
    try {
      const newUserLog = await userLogService.createUserLog(req.body);
      res.status(201).json(newUserLog);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all user logs
  getAllUserLogs: async (req, res) => {
    try {
      const userLogs = await userLogService.getAllUserLogs();
      if (userLogs && userLogs.length > 0) {
        res.json({ success: true, data: userLogs });
      } else {
        res.json({ success: false, message: 'No user logs found for this health_id.', });
      }
    } catch (error) {
      console.error('Error fetching user logs:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get user log by ID
  getUserLogById: async (req, res) => {
    try {
      const userLog = await userLogService.getUserLogById(req.params.id);
      if (!userLog)
        return res.status(404).json({ error: 'User Log not found' });
      res.status(200).json(userLog);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update a user log by ID
  updateUserLog: async (req, res) => {
    try {
      const updatedUserLog = await userLogService.updateUserLog(req.params.id, req.body);
      res.status(200).json(updatedUserLog);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a user log by ID
  deleteUserLog: async (req, res) => {
    try {
      await userLogService.deleteUserLog(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete logs in a date range
  deleteLogsInRange: async (req, res) => {
    const { start_date, end_date } = req.params;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'startDate and endDate are required.' });
    }
    try {
      const result = await userLogService.deleteLogsInRange(start_date, end_date);
      if (result === 0) {
        return res.status(404).json({ message: 'No records found in the specified range.' });
      }
      return res.status(200).json({ message: `${result} records deleted successfully.` });
    } catch (error) {
      console.error('Error deleting logs:', error);
      return res.status(500).json({ error: 'An error occurred while deleting logs.' });
    }
  },
};
