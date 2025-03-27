const express = require('express');
const projectController = require('../Controllers/ProjectController');

const projectRouter = express.Router();

projectRouter.post('/upsert', projectController.upsertProject);

module.exports = projectRouter;
