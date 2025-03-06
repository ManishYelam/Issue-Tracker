const express = require('express');
const validate = require('../Middlewares/validateMiddleware');
const issuesController = require('../Controllers/IssueController');
const uploadMiddleware = require('../Middlewares/uploadMiddleware');
const issuesRouter = express.Router();

issuesRouter
  .post("/upsert", issuesController.upsertIssue)
  .post("/bulkIssue", issuesController.bulkIssue)
  .post("/bulkCsvIssue", uploadMiddleware, issuesController.bulkCsvIssue)
  .get("/get/:issue_id", issuesController.getIssueById)
  .get("/getAll", issuesController.getAllIssues)
  .delete("/delete/:issue_id", issuesController.deleteIssueById)
  .put("/update-status/:issue_id", issuesController.updateIssueStatus)

module.exports = issuesRouter;
