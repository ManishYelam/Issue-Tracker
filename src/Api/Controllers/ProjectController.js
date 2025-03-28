const projectService = require('../Services/ProjectService');

module.exports = {
  upsertProject: async (req, res) => {
    try {
      const project = await projectService.upsertProject(req.body);
      res.status(200).json({
        success: true,
        message: 'Project upserted successfully',
        project,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getProjectById: async (req, res) => {
    try {
      const { project_id } = req.params;
      if (!project_id) {
        return res.status(400).json({ success: false, message: 'Project ID is required' });
      }
      const project = await projectService.getProjectById(project_id);
      return res.status(200).json({
        success: true,
        message: 'Project fetched successfully',
        project,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getAllProjects: async (req, res) => {
    try {
      const result = await projectService.getAllProjects(req.body);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error(`🚨 Error Occurred: ${err.message}`);
      return res.status(500).json({ success: false, message: '❗ Something went wrong.', error: err.message });
    }
  },
};
