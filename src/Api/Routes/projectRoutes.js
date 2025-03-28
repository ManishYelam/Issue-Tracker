const express = require('express');
const projectController = require('../Controllers/ProjectController');

const projectRouter = express.Router();

projectRouter
  .post('/upsert', projectController.upsertProject)
  .get('/:project_id', projectController.getProjectById)
  .post('/', projectController.getAllProjects);

module.exports = projectRouter;
