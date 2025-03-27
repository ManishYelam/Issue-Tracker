const { Op, Sequelize } = require('sequelize');
const { validateWithLOVs, createUpsertIssueSchema } = require('../Middlewares/Joi_Validations/issueSchema');
const IssueStats = require('../Models/issueStats');
const Issue = require('../Models/Issue');
const sequelize = require('../../Config/Database/sequelize.config');

module.exports = {
  upsertIssue: async (issueData, user_id) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      const [issue, created] = await Issue.upsert(issueData, {
        returning: true,
        transaction,
      });

      if (created) {
        await Issue.update({ reported_by: user_id }, { where: { issue_id: issue.issue_id }, transaction });
      }

      const [issueStats, isNew] = await IssueStats.findOrCreate({
        where: { user_id: issue.user_id },
        defaults: {
          user_id: issue.user_id,
          total_issues: 0,
          pending_issues: 0,
          in_progress_issues: 0,
          on_hold_issues: 0,
          resolved_issues: 0,
          to_be_tested_issues: 0,
          tested_issues: 0,
          committed_issues: 0,
          rejected_issues: 0,
          critical_issues: 0,
          high_priority_issues: 0,
          medium_priority_issues: 0,
          low_priority_issues: 0,
          overdue_issues: 0,
        },
        transaction,
      });

      const totalIssues = await Issue.count({ where: { user_id: issue.user_id }, transaction });
      const statusCounts = await Issue.findAll({
        where: { user_id: issue.user_id },
        attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
        group: ['status'],
        transaction,
        raw: true,
      });
      const issueStatusCounts = statusCounts.reduce((acc, { status, count }) => {
        acc[`${status.toLowerCase()}_issues`] = count;
        return acc;
      }, {});

      const overdueIssues = await Issue.count({
        where: {
          user_id: issue.user_id,
          due_date: { [Op.lt]: new Date() },
          status: { [Op.notIn]: ['RESOLVED', 'REJECTED'] },
        },
        transaction,
      });

      const priorityCounts = await Issue.findAll({
        where: { user_id: issue.user_id },
        attributes: ['priority', [Sequelize.fn('COUNT', Sequelize.col('priority')), 'count']],
        group: ['priority'],
        transaction,
        raw: true,
      });

      const priorityStatusCounts = {
        low_priority_issues: 0,
        medium_priority_issues: 0,
        high_priority_issues: 0,
        critical_priority_issues: 0,
      };

      priorityCounts.forEach(({ priority, count }) => {
        priorityStatusCounts[`${priority.toLowerCase()}_priority_issues`] = count;
      });

      await issueStats.update(
        {
          total_issues: totalIssues,
          overdue_issues: overdueIssues,
          ...issueStatusCounts,
          ...priorityStatusCounts,
        },
        { transaction }
      );

      await transaction.commit();
      return { success: true, issue, created };
    } catch (err) {
      await transaction.rollback();
      return { success: false, message: err.message };
    }
  },

  bulkIssue: async bulkIssues => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      const issues = await Issue.bulkCreate(bulkIssues, {
        updateOnDuplicate: [
          'title',
          'description',
          'issue_type',
          'priority',
          'status',
          'category',
          'impact_area',
          'reproducibility',
          'root_cause',
          'assigned_to',
          'reported_by',
          'resolved_by',
          'resolved_at',
          'due_date',
          'resolution_notes',
          'attachments',
          'tags',
          'related_issues',
          'escalation_level',
          'escalated_to',
          'workaround',
          'estimated_effort',
          'actual_effort',
          'deployment_required',
          'environments',
          'browsers',
        ],
        transaction,
      });

      const userIds = [...new Set(bulkIssues.map(issue => issue.user_id))];

      await Promise.all(
        userIds.map(async userId => {
          await IssueStats.findOrCreate({
            where: { user_id: userId },
            defaults: {
              user_id: userId,
              total_issues: 0,
              pending_issues: 0,
              in_progress_issues: 0,
              on_hold_issues: 0,
              resolved_issues: 0,
              to_be_tested_issues: 0,
              tested_issues: 0,
              committed_issues: 0,
              rejected_issues: 0,
              critical_issues: 0,
              high_priority_issues: 0,
              medium_priority_issues: 0,
              low_priority_issues: 0,
              overdue_issues: 0,
            },
            transaction,
          });
        })
      );

      await Promise.all(
        userIds.map(async userId => {
          const totalIssues = await Issue.count({ where: { user_id: userId }, transaction });
          const statusCounts = await Issue.findAll({
            where: { user_id: userId },
            attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
            group: ['status'],
            transaction,
            raw: true,
          });
          const issueStatusCounts = statusCounts.reduce((acc, { status, count }) => {
            acc[`${status.toLowerCase()}_issues`] = count;
            return acc;
          }, {});

          const overdueIssues = await Issue.count({
            where: {
              user_id: userId,
              due_date: { [Op.lt]: new Date() },
              status: { [Op.notIn]: ['RESOLVED', 'REJECTED'] },
            },
            transaction,
          });

          const priorityCounts = await Issue.findAll({
            where: { user_id: userId },
            attributes: ['priority', [Sequelize.fn('COUNT', Sequelize.col('priority')), 'count']],
            group: ['priority'],
            transaction,
            raw: true,
          });

          const priorityStatusCounts = {
            low_priority_issues: 0,
            medium_priority_issues: 0,
            high_priority_issues: 0,
            critical_priority_issues: 0,
          };

          priorityCounts.forEach(({ priority, count }) => {
            priorityStatusCounts[`${priority.toLowerCase()}_priority_issues`] = count;
          });

          await IssueStats.update(
            {
              total_issues: totalIssues,
              overdue_issues: overdueIssues,
              ...issueStatusCounts,
              ...priorityStatusCounts,
            },
            { where: { user_id: userId }, transaction }
          );
        })
      );

      await transaction.commit();
      return { success: true, message: 'Bulk issues processed successfully', issues };
    } catch (err) {
      await transaction.rollback();
      return { success: false, message: err.message };
    }
  },

  getAllIssues: async ({ page = 1, limit = 10, filters = {}, search = '', searchFields = [] }) => {
    try {
      const offset = (page - 1) * limit;

      let whereConditions = {};
      // Apply filters dynamically
      // if (filters.issue_type) whereConditions.issueType = filters.issueType;
      // if (filters.priority) whereConditions.priority = filters.priority;
      // if (filters.status) whereConditions.status = filters.status;
      // if (filters.category) whereConditions.category = filters.category;
      // if (filters.assigned_to) whereConditions.assignedTo = filters.assignedTo;
      // if (filters.reported_by) whereConditions.reportedBy = filters.reportedBy;
      // if (filters.resolved_by) whereConditions.resolvedBy = filters.resolvedBy;
      // if (filters.due_date) whereConditions.dueDate = { [Op.gte]: new Date(filters.dueDate) };
      // ✅ Apply filters dynamically
      Object.keys(filters).forEach(key => {
        if (filters[key]) whereConditions[key] = filters[key];
      });

      // Apply dynamic search on specified fields
      if (search && searchFields.length > 0) {
        whereConditions[Op.or] = searchFields.map(field => ({
          [field]: { [Op.like]: `%${search}%` },
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
        success: true,
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

  getIssueById: async issue_id => {
    try {
      const issue = await Issue.findOne({ where: { issue_id } });
      if (!issue) {
        return { success: false, message: 'Issue not found' };
      }
      return { success: true, issue };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  deleteIssueById: async issue_id => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      // 🔍 Find the issue first
      const issue = await Issue.findByPk(issue_id, { transaction });
      if (!issue) {
        await transaction.rollback();
        return { success: false, message: 'Issue not found or already deleted' };
      }

      // 🗑️ Delete the issue
      await Issue.destroy({ where: { issue_id }, transaction });

      // 🔄 Update total_issues in IssueStats
      const totalIssues = await Issue.count({ where: { user_id: issue.user_id }, transaction });

      // 🔍 Check if IssueStats exists
      const issueStats = await IssueStats.findOne({ where: { user_id: issue.user_id }, transaction });

      if (issueStats) {
        await issueStats.update({ total_issues: totalIssues }, { transaction });
      }

      await transaction.commit();
      return { success: true, message: 'Issue deleted successfully' };
    } catch (err) {
      await transaction.rollback();
      return { success: false, message: err.message };
    }
  },

  updateIssueStatus: async (user_id, issue_id, newStatus) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      // 🔍 Fetch the issue
      const issue = await Issue.findByPk(issue_id, { transaction });
      if (!issue) {
        await transaction.rollback();
        return { success: false, message: 'Issue not found' };
      }

      // 🔄 If status is already the same, do nothing
      const prevStatus = issue.status;
      if (prevStatus === newStatus) {
        await transaction.rollback();
        return { success: false, message: 'No changes detected. Status is already updated.' };
      }

      // 🆕 Update the issue status
      const updateData = { status: newStatus };
      if (newStatus === 'RESOLVED') {
        updateData.resolved_by = user_id;
        updateData.resolved_at = new Date();
      } else if (prevStatus === 'RESOLVED') {
        updateData.resolved_by = null;
        updateData.resolved_at = null;
      }
      await issue.update(updateData, { transaction });

      // 🔄 Fetch IssueStats for the user
      const issueStats = await IssueStats.findOne({ where: { user_id: issue.user_id }, transaction });

      if (issueStats) {
        // 📌 Decrement the previous status count (only if > 0)
        if (issueStats[`${prevStatus.toLowerCase()}_issues`] > 0) {
          await issueStats.decrement(`${prevStatus.toLowerCase()}_issues`, { by: 1, transaction });
        }
        // 📌 Increment the new status count
        await issueStats.increment(`${newStatus.toLowerCase()}_issues`, { by: 1, transaction });
        // 🔄 Update total issues count
        const totalIssues = await Issue.count({ where: { user_id: issue.user_id }, transaction });
        await issueStats.update({ total_issues: totalIssues }, { transaction });
      } else {
        return;
      }

      await transaction.commit();
      return { success: true, message: 'Issue status updated successfully', issue };
    } catch (err) {
      await transaction.rollback();
      return { success: false, message: err.message };
    }
  },

  getIssueStats: async (user_id = null, fields = []) => {
    try {
      const validFields = [
        'total_issues',
        'pending_issues',
        'in_progress_issues',
        'on_hold_issues',
        'resolved_issues',
        'to_be_tested_issues',
        'tested_issues',
        'committed_issues',
        'rejected_issues',
        'critical_priority_issues',
        'high_priority_issues',
        'medium_priority_issues',
        'low_priority_issues',
        'overdue_issues',
      ];

      const validSelectedFields = fields.length > 0 ? fields.filter(field => validFields.includes(field)) : [];

      if (fields.length > 0 && validSelectedFields.length === 0) {
        return { success: false, message: 'Invalid fields provided.' };
      }

      const queryOptions = {
        attributes: validSelectedFields.length > 0 ? validSelectedFields : undefined,
        raw: true,
      };

      const issueStats = user_id
        ? await IssueStats.findOne({ where: { user_id }, ...queryOptions })
        : await IssueStats.findAll(queryOptions);

      if (!issueStats || (Array.isArray(issueStats) && issueStats.length === 0)) {
        return { success: false, message: user_id ? 'Issue stats not found for this user' : 'No issue stats available' };
      }

      return { success: true, data: issueStats };
    } catch (err) {
      console.error('Error fetching issue stats:', err);
      return { success: false, message: 'Internal server error', error: err.message };
    }
  },
};
