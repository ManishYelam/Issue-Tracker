const { createUpsertIssueSchema, createUpdateStatusSchema, validateWithLOVs } = require("../Middlewares/Joi_Validations/issueSchema");
const issueService = require("../Services/IssueService");


module.exports = {
  /**
   * 🆕 Upsert a Single Issue (Create/Update)
   */
  upsertIssue: async (req, res) => {
    try {
      const { error } = await (createUpsertIssueSchema, req.body);
      if (error) {
        return res.status(400).json({ success: false, message: "❌ Validation failed!", errors: error.details.map(e => e.message) });
      }
      const result = await issueService.upsertIssue(req.body);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error(`🚨 Error Occurred: ${err.message}`);
      return res.status(500).json({ success: false, message: "❗ Something went wrong.", error: err.message });
    }
  },

  /**
   * 🔄 Bulk Insert/Update Issues
   */
  bulkIssue: async (req, res) => {
    try {
      if (!Array.isArray(req.body) || req.body.length === 0) {
        return res.status(400).json({ success: false, message: "❌ Invalid input: Expected an array of issue objects." });
      }

      // Validate all issues
      const validIssues = [];
      const errors = [];
      for (const [index, issue] of req.body.entries()) {
        const validation = await validateWithLOVs(createUpsertIssueSchema, issue);
        if (validation.error) {
          errors.push({ row: index + 1, error: validation.error.details[0]?.message || "Unknown validation error" });
        } else {
          validIssues.push(issue);
        }
      }

      if (errors.length) {
        return res.status(400).json({ success: false, message: "⚠️ Some issues have validation errors", errors });
      }

      const result = await issueService.bulkIssue(validIssues);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error(`🚨 Error Occurred: ${err.message}`);
      return res.status(500).json({ success: false, message: "❗ Something went wrong.", error: err.message });
    }
  },

  /**
   * 📂 Bulk Upload Issues via CSV
   */
  bulkCsvIssue: async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const rows = await parseCSV(req.file.path);
      deleteFile(req.file.path);

      const parseData = row => ({
        title: row.issue_title,
        description: row.description,
        issue_type: row.issueType,
        priority: row.priority || "Medium",
        status: row.status || "Open",
        category: row.category || "General",
        impact_area: row.impactArea || null,
        reproducibility: row.reproducibility || "Always",
        root_cause: row.rootCause || null,
        assigned_to: row.assignedTo || null,
        reported_by: row.reportedBy,
        resolved_by: row.resolvedBy || null,
        resolved_at: row.resolvedAt ? new Date(row.resolvedAt).toISOString() : null,
        due_date: row.dueDate ? new Date(row.dueDate).toISOString() : null,
        resolution_notes: row.resolutionNotes || null,
        attachments: row.attachments?.split(",") || [],
        tags: row.tags || null,
        related_issues: row.relatedIssues || null,
        escalation_level: row.escalationLevel || "None",
        escalated_to: row.escalatedTo || null,
        workaround: row.workaround || null,
        estimated_effort: parseInt(row.estimatedEffort, 10) || null,
        actual_effort: parseInt(row.actualEffort, 10) || null,
        deployment_required: row.deploymentRequired === "true",
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

      const result = await issueService.bulkIssue(validIssues);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error(`🚨 Error Occurred: ${err.message}`);
      return res.status(500).json({ success: false, message: "❗ Something went wrong.", error: err.message });
    }
  },

  updateIssueStatus: async (req, res) => {
    try {
      const issue_id = parseInt(req.params.issue_id, 10);
      const { status } = req.body;
      const user_id = req.user_info.id;
      if (isNaN(issue_id)) {
        return res.status(400).json({ success: false, message: "⚠️ Invalid Issue ID provided." });
      }
      const { error } = await validateWithLOVs(createUpdateStatusSchema, req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "❌ Validation failed!",
          errors: error.details.map(e => e.message)
        });
      }

      const result = await issueService.updateIssueStatus(user_id, issue_id, status);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error(`🚨 Error Occurred in updateIssueStatus: ${err.message}`);
      return res.status(500).json({
        success: false,
        message: "❗ Something went wrong.",
        error: err.message
      });
    }
  },

  /**
   * 🔍 Get a Single Issue by ID
   */
  getIssueById: async (req, res) => {
    try {
      const issue_id = parseInt(req.params.issue_id, 10);
      if (isNaN(issue_id)) return res.status(400).json({ success: false, message: "Invalid Issue ID" });

      const result = await issueService.getIssueById(issue_id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      console.error(`🚨 Error Occurred: ${err.message}`);
      return res.status(500).json({ success: false, message: "❗ Something went wrong.", error: err.message });
    }
  },

  /**
   * 📊 Get All Issues (With Filters & Pagination)
   */
  getAllIssues: async (req, res) => {
    try {
      const result = await issueService.getAllIssues(req.body);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (err) {
      console.error(`🚨 Error Occurred: ${err.message}`);
      return res.status(500).json({ success: false, message: "❗ Something went wrong.", error: err.message });
    }
  },

  /**
   * 🗑️ Delete an Issue
   */
  deleteIssueById: async (req, res) => {
    try {
      const issue_id = parseInt(req.params.issue_id, 10);
      if (isNaN(issue_id)) return res.status(400).json({ success: false, message: "Invalid Issue ID" });

      const result = await issueService.deleteIssueById(issue_id);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (err) {
      console.error(`🚨 Error Occurred: ${err.message}`);
      return res.status(500).json({ success: false, message: "❗ Something went wrong.", error: err.message });
    }
  },
};

