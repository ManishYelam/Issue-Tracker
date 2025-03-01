const express = require('express');
const validate = require('../Middlewares/validateMiddleware');
const issuesController = require('../Controllers/IssueController');
const issuesRouter = express.Router();

issuesRouter
  .all("/:action", issuesController)
  .all("/:action/:issue_id", issuesController)

module.exports = issuesRouter;
