const { createUpsertIssueSchema, createUpdateStatusSchema, validateWithLOVs } = require("../Middlewares/Joi_Validations/issueSchema");
const issueService = require("../Services/IssueService");

const issuesController = async (req, res) => {
  try {
    const { action, issue_id } = req.params;
    const { status } = req.body;

    // Convert issue_id to number if valid, otherwise set to null
    const IssueID = issue_id && !isNaN(issue_id) ? parseInt(issue_id, 10) : null;

    // Define actions with async validation
    const actions = {
      upsert: async () => {
        const { error } = await validateWithLOVs(createUpsertIssueSchema, req.body);
        if (error) {
          return res.status(400).json({
            success: false, message: "❌ Validation failed!", errors: error.details.map((err) => err.message),
          });
        }
        return await issueService.upsertIssue(req.body);
      },
      bulkIssue: async () => {               
          const result = await issueService.bulkIssue(req.body);
          if (!result.success) {
            return res.status(400).json(result);
          }
          return res.status(201).json(result);
      },
      get: async () => {
        if (IssueID === null) throw new Error(`🔍 Oops! Issue ID is missing.  
        👉 Please provide a valid Issue ID to fetch details.`);
        return await issueService.getIssueById(IssueID);
      },
      getAll: async () => {
        return await issueService.getAllIssues(req.body);
      },
      delete: async () => {
        if (IssueID === null) throw new Error(`🗑️ Deletion failed!  
        👉 Please provide a valid Issue ID to delete.`);
        return await issueService.deleteIssueById(IssueID);
      },
      updateStatus: async () => {
        if (IssueID === null) throw new Error(`⚠️ Cannot update status!  
        👉 A valid Issue ID is required.`);
        const { error } = await validateWithLOVs(createUpdateStatusSchema, req.body);
        if (error) {
          return res.status(400).json({
            success: false, message: "❌ Validation failed!", errors: error.details.map((err) => err.message),
          });
        }
        return await issueService.updateIssueStatus(IssueID, status);
      },
    };

    // Check if action is valid
    if (!actions[action]) {
      return res.status(400).json({
        success: false, message: `❌ Invalid action!  
        👉 Please use a valid action such as 'get', 'delete', 'upsert', 'updateStatus', or 'getAll'.`,
      });
    }

    // Execute the requested action
    const result = await actions[action]();

    // Send response if headers are not already sent
    if (!res.headersSent) {
      return res.status(result.success ? 200 : 400).json(result);
    }
  } catch (err) {
    console.error(`🚨 Error Occurred: ${err.message}`);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false, message: `❗ Something went wrong on our end.  
        🔧 Please try again later or contact support.`, error: err.message, // Optional: Remove this in production
      });
    }
  }
};

module.exports = issuesController;
