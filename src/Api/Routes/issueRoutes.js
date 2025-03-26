const express = require('express');
const validate = require('../Middlewares/validateMiddleware');
const issuesController = require('../Controllers/IssueController');
const uploadMiddleware = require('../Middlewares/uploadMiddleware');
const roleAuth = require('../Middlewares/roleAuth');
const issuesRouter = express.Router();

issuesRouter
  .post('/upsert', roleAuth(['SOFTWARE_TESTER']), issuesController.upsertIssue)
  .post('/bulkIssue', issuesController.bulkIssue)
  .post('/bulkCsvIssue', uploadMiddleware, issuesController.bulkCsvIssue)
  .get('/get/:issue_id', issuesController.getIssueById)
  .post('/getAll', issuesController.getAllIssues)
  .delete('/delete/:issue_id', issuesController.deleteIssueById)
  .put('/update-status/:issue_id', issuesController.updateIssueStatus)
  .get('/issue-stats', issuesController.getIssueStats);

module.exports = issuesRouter;
