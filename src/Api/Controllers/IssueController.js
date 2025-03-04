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
        const bulkIssues = req.body;
        if (!Array.isArray(bulkIssues) || bulkIssues.length === 0) {
          return res.status(400).json({
            success: false,
            message: "❌ Invalid input: Expected an array of issue objects.",
          });
        }

        const validIssues = [];
        const errors = [];

        for (const [index, issue] of bulkIssues.entries()) {
          const { error } = await validateWithLOVs(createUpsertIssueSchema, issue);

          if (error) {
            errors.push({
              row: index + 1,
              error: error.details[0]?.message || "Unknown validation error",
            });
          } else {
            validIssues.push(issue);
          }
        }

        if (errors.length > 0) {
          return res.status(400).json({
            success: false,
            message: "⚠️ Some issues have validation errors",
            errors,
          });
        }

        const result = await issueService.bulkIssue(validIssues);

        return res.status(201).json({
          data: result,
          count: validIssues.length,
        })
      },

      bulkCsvIssue: async () => {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        // Parse CSV File
        const rows = await parseCSV(req.file.path);
        deleteFile(req.file.path);

        // Parse Data Function
        const parseData = (row) => ({
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
          attachments: row.attachments ? row.attachments.split(",") : [],
          tags: row.tags || null,
          relatedIssues: row.relatedIssues || null,
          escalationLevel: row.escalationLevel || "None",
          escalatedTo: row.escalatedTo || null,
          workaround: row.workaround || null,
          estimatedEffort: parseInt(row.estimatedEffort, 10) || null,
          actualEffort: parseInt(row.actualEffort, 10) || null,
          deploymentRequired: row.deploymentRequired === "true",
        });

        const issues = [];
        const errors = [];

        for (const [index, row] of rows.entries()) {
          try {
            const parsedRow = parseData(row);
            const { error } = await validateWithLOVs(createUpsertIssueSchema, parsedRow);

            if (error) {
              errors.push({
                row: index + 1,
                error: error.details[0]?.message || "Unknown validation error",
              });
            } else {
              issues.push(parsedRow);
            }
          } catch (parseError) {
            errors.push({
              row: index + 1,
              error: `Error parsing row: ${parseError.message}`,
            });
          }
        }

        if (errors.length > 0) {
          return res.status(400).json({
            message: "Some rows have validation errors",
            errors,
          });
        }

        return await issueService.bulkIssue(issues);
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
