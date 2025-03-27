const projectService = require('../Services/ProjectService');

exports.upsertProject = async (req, res) => {
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
};
