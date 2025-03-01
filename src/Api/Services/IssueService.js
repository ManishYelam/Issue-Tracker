const Issue = require("../Models/Issue");

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

  getIssues: async (query) => {
    try {
      const {
        search,
        searchFields = ["title", "description"],
        status,
        priority,
        issueType,
        assignedTo,
        reportedBy,
        page = 1,
        limit = 10,
        orderBy = "createdAt",
        sortOrder = "DESC",
      } = query;

      const whereConditions = {};

      if (status) whereConditions.status = status;
      if (priority) whereConditions.priority = priority;
      if (issueType) whereConditions.issueType = issueType;
      if (assignedTo) whereConditions.assignedTo = assignedTo;
      if (reportedBy) whereConditions.reportedBy = reportedBy;

      if (search && searchFields.length > 0) {
        whereConditions[Op.or] = searchFields.map((field) => ({
          [field]: { [Op.iLike]: `%${search}%` },
        }));
      }

      const offset = (page - 1) * limit;

      const { count, rows: issues } = await Issue.findAndCountAll({
        where: whereConditions,
        order: [[orderBy, sortOrder]],
        limit: limit,
        offset: offset,
      });

      return {
        success: true,
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit,
        issues,
      };
    } catch (err) {
      return { success: false, message: err.message };
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
