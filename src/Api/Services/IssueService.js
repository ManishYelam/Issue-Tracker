const { Op } = require("sequelize");
const Issue = require("../Models/Issue");
const { validateWithLOVs, createUpsertIssueSchema } = require("../Middlewares/Joi_Validations/issueSchema");

module.exports = {
  upsertIssue: async (issueData) => {
    try {
      const [issue, created] = await Issue.upsert(issueData, {
        returning: true,
      });
      return { success: true, issue, created };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // **Bulk insert or update issues**
  bulkIssue: async (bulkIssues) => {
    if (!Array.isArray(bulkIssues) || bulkIssues.length === 0) {
      return { success: false, message: "Invalid input: Expected an array of issue objects." };
    }

    const validationResults = await Promise.all(
      bulkIssues.map(async (issue) => {
        const { error, value } = await validateWithLOVs(createUpsertIssueSchema, issue);
        return error ? { issue, errors: error.details } : { issue: value };
      })
    );

    const invalidIssues = validationResults.filter((result) => result.errors);
    if (invalidIssues.length > 0) {
      return { success: false, message: "Some issues failed validation.", errors: invalidIssues };
    }

    const validIssues = validationResults.map((result) => result.issue);

    const issues = await Issue.bulkCreate(validIssues, {
      updateOnDuplicate: [
        "title", "description", "issueType", "priority", "status", "category", "impactArea", "reproducibility", "rootCause", "assignedTo", "reportedBy", "resolvedBy", "resolvedAt", "dueDate", "resolutionNotes", "attachments", "tags", "relatedIssues", "escalationLevel", "escalatedTo", "workaround", "estimatedEffort", "actualEffort", "deploymentRequired",
      ],
    });

    return { success: true, message: "Bulk issues processed successfully", issues };
  },

  getAllIssues: async ({ page = 1, limit = 10, filters = {}, search = '', searchFields = [] }) => {
    try {
      const offset = (page - 1) * limit;

      let whereConditions = {};
      // Apply filters dynamically
      if (filters.issueType) whereConditions.issueType = filters.issueType;
      if (filters.priority) whereConditions.priority = filters.priority;
      if (filters.status) whereConditions.status = filters.status;
      if (filters.category) whereConditions.category = filters.category;
      if (filters.assignedTo) whereConditions.assignedTo = filters.assignedTo;
      if (filters.reportedBy) whereConditions.reportedBy = filters.reportedBy;
      if (filters.resolvedBy) whereConditions.resolvedBy = filters.resolvedBy;
      if (filters.dueDate) whereConditions.dueDate = { [Op.gte]: new Date(filters.dueDate) };

      // Apply dynamic search on specified fields
      if (search && searchFields.length > 0) {
        whereConditions[Op.or] = searchFields.map(field => ({
          [field]: { [Op.like]: `%${search}%` }
        }));
      }

      // Fetch issues with pagination, filters, and search applied
      const { rows, count } = await Issue.findAndCountAll({
        where: whereConditions,
        limit,
        offset,
        order: [['createdAt', 'DESC']], // Sort by latest issues
      });

      return {
        message: '✅ Issues fetched successfully.',
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: rows,
      };
    } catch (error) {
      throw new Error(`❌ Error in getAllIssues: ${error.message}`);
    }
  },

  getIssueById: async (issue_id) => {
    try {
      const issue = await Issue.findOne({ where: { issue_id } });
      if (!issue) {
        return { success: false, message: "Issue not found" };
      }
      return { success: true, issue };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  deleteIssueById: async (issue_id) => {
    try {
      const deleted = await Issue.destroy({ where: { issue_id } });
      if (!deleted) {
        return { success: false, message: "Issue not found or already deleted" };
      }
      return { success: true, message: "Issue deleted successfully" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  updateIssueStatus: async (issue_id, status) => {
    try {
      const issue = await Issue.findByPk(issue_id);
      if (!issue) {
        return { success: false, message: "Issue not found" };
      }
      await issue.update({ status });
      return { success: true, message: "Issue status updated successfully", issue };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

};
