const { upsertIssueSchema, updateStatusSchema } = require("../Middlewares/Joi_Validations/issueSchema");
const issueService = require("../Services/IssueService");

const issuesController = async (req, res) => {
  try {
    const { action, issue_id } = req.params;
    const { status } = req.body;

    // Convert issue_id to number if valid, otherwise set to null
    const IssueID = issue_id && !isNaN(issue_id) ? parseInt(issue_id, 10) : null;

    // console.log(`📩 Received Request: { action: ${action}, IssueID: ${IssueID}, status: ${status} }`);
    // console.log(`📌 Data Types: { action: ${typeof action}, issue_id: ${typeof IssueID}, status: ${typeof status} }`);

    // Define actions with backtick messages
    const actions = {
      upsert: async () => {
        const { error } = upsertIssueSchema.validate(req.body, { abortEarly: false });
        if (error) {
          return res.status(400).json({
            success: false,
            message: "❌ Validation failed!",
            errors: error.details.map((err) => err.message) // Return all validation errors
          });
        }
        return await issueService.upsertIssue(req.body);
      },
      get: async () => {
        if (IssueID === null) throw new Error(`🔍 Oops! Issue ID is missing.  
        👉 Please provide a valid Issue ID to fetch details.`);
        return await issueService.getIssueById(IssueID);
      },
      getAll: async () => {
        return await issueService.getIssues(req.query);
      },
      delete: async () => {
        if (IssueID === null) throw new Error(`🗑️ Deletion failed!  
        👉 Please provide a valid Issue ID to delete.`);
        return await issueService.deleteIssueById(IssueID);
      },
      updateStatus: async () => {
        if (IssueID === null) throw new Error(`⚠️ Cannot update status!  
        👉 A valid Issue ID is required.`);
        const { error } = updateStatusSchema.validate(req.body, { abortEarly: false });
        if (error) {
          return res.status(400).json({
            success: false,
            message: "❌ Validation failed!",
            errors: error.details.map((err) => err.message) // Return all validation errors
          });
        }
        return await issueService.updateIssueStatus(IssueID, status);
      },
    };

    // Check if action is valid
    if (!actions[action]) {
      return res.status(400).json({
        success: false,
        message: `❌ Invalid action!  
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
        success: false,
        message: `❗ Something went wrong on our end.  
        🔧 Please try again later or contact support.`,
        error: err.message, // Optional: Remove this in production
      });
    }
  }
};

module.exports = issuesController;
