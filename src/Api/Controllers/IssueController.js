const { createUpsertIssueSchema, createUpdateStatusSchema, validateWithLOVs } = require("../Middlewares/Joi_Validations/issueSchema");
const issueService = require("../Services/IssueService");

const issuesController = async (req, res) => {
  try {
    const { action, issue_id } = req.params;
    const { status } = req.body;
    const IssueID = issue_id && !isNaN(issue_id) ? parseInt(issue_id, 10) : null;

    const actions = {
      upsert: async () => {
        const { error } = await validateWithLOVs(createUpsertIssueSchema, req.body);
        if (error) return res.status(400).json({ success: false, message: "❌ Validation failed!", errors: error.details.map(e => e.message) });
        return issueService.upsertIssue(req.body);
      },

      bulkIssue: async () => {
        if (!Array.isArray(req.body) || req.body.length === 0) {
          return res.status(400).json({ success: false, message: "❌ Invalid input: Expected an array of issue objects." });
        }

        const validations = await Promise.all(req.body.map(issue => validateWithLOVs(createUpsertIssueSchema, issue)));
        const validIssues = [];
        const errors = [];

        validations.forEach((result, index) => {
          if (result.error) {
            errors.push({ row: index + 1, error: result.error.details[0]?.message || "Unknown validation error" });
          } else {
            validIssues.push(req.body[index]);
          }
        });

        if (errors.length) return res.status(400).json({ success: false, message: "⚠️ Some issues have validation errors", errors });

        return issueService.bulkIssue(validIssues);
      },

      bulkCsvIssue: async () => {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const rows = await parseCSV(req.file.path);
        deleteFile(req.file.path);

        const parseData = row => ({
          issue_title: row.issue_title,
          description: row.description,
          issueType: row.issueType,
          priority: row.priority || "Medium",
          status: row.status || "Open",
          category: row.category || "General",
          impactArea: row.impactArea || null,
          reproducibility: row.reproducibility || "Always",
          rootCause: row.rootCause || null,
          assignedTo: row.assignedTo || null,
          reportedBy: row.reportedBy,
          resolvedBy: row.resolvedBy || null,
          resolvedAt: row.resolvedAt ? new Date(row.resolvedAt).toISOString() : null,
          dueDate: row.dueDate ? new Date(row.dueDate).toISOString() : null,
          resolutionNotes: row.resolutionNotes || null,
          attachments: row.attachments?.split(",") || [],
          tags: row.tags || null,
          relatedIssues: row.relatedIssues || null,
          escalationLevel: row.escalationLevel || "None",
          escalatedTo: row.escalatedTo || null,
          workaround: row.workaround || null,
          estimatedEffort: parseInt(row.estimatedEffort, 10) || null,
          actualEffort: parseInt(row.actualEffort, 10) || null,
          deploymentRequired: row.deploymentRequired === "true",
        });

        const issues = rows.map(parseData);
        const validations = await Promise.all(issues.map(issue => validateWithLOVs(createUpsertIssueSchema, issue)));
        const validIssues = [];
        const errors = [];

        validations.forEach((result, index) => {
          if (result.error) {
            errors.push({ row: index + 1, error: result.error.details[0]?.message || "Unknown validation error" });
          } else {
            validIssues.push(issues[index]);
          }
        });

        if (errors.length) return res.status(400).json({ message: "Some rows have validation errors", errors });

        return issueService.bulkIssue(validIssues);
      },

      get: async () => {
        if (!IssueID) throw new Error("🔍 Oops! Issue ID is missing. 👉 Please provide a valid Issue ID.");
        return issueService.getIssueById(IssueID);
      },

      getAll: async () => issueService.getAllIssues(req.body),

      delete: async () => {
        if (!IssueID) throw new Error("🗑️ Deletion failed! 👉 Please provide a valid Issue ID.");
        return issueService.deleteIssueById(IssueID);
      },

      updateStatus: async () => {
        if (!IssueID) throw new Error("⚠️ Cannot update status! 👉 A valid Issue ID is required.");
        const { error } = await validateWithLOVs(createUpdateStatusSchema, req.body);
        if (error) return res.status(400).json({ success: false, message: "❌ Validation failed!", errors: error.details.map(e => e.message) });
        return issueService.updateIssueStatus(IssueID, status);
      }
    };

    if (!actions[action]) {
      return res.status(400).json({
        success: false, 
        message: "❌ Invalid action! 👉 Use 'get', 'delete', 'upsert', 'updateStatus', or 'getAll'."
      });
    }

    const result = await actions[action]();
    if (!res.headersSent) return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error(`🚨 Error Occurred: ${err.message}`);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "❗ Something went wrong. 🔧 Try again later.",
        error: err.message
      });
    }
  }
};

module.exports = issuesController;
