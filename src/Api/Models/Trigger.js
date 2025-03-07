const Issue = require('./Issue');
const IssueStats = require('./Issue');

module.exports = () => {
  // ✅ AFTER CREATE (New Issue Added)
  Issue.afterCreate(async issue => {
    try {
      const stats = await IssueStats.findOrCreate({
        where: { userId: issue.assignedTo },
        defaults: {
          userId: issue.assignedTo,
          totalIssues: 0,
          pendingIssues: 0,
          inProgressIssues: 0,
          onHoldIssues: 0,
          resolvedIssues: 0,
          toBeTestedIssues: 0,
          testedIssues: 0,
          committedIssues: 0,
          rejectedIssues: 0,
          criticalIssues: 0,
          highPriorityIssues: 0,
          mediumPriorityIssues: 0,
          lowPriorityIssues: 0,
          overdueIssues: 0,
        },
      });

      const [issueStats, created] = stats;

      // Increment relevant fields
      await issueStats.increment({
        totalIssues: 1,
        [`${issue.status.replace(/\s+/g, '').toLowerCase()}Issues`]: 1,
        [`${issue.priority.toLowerCase()}PriorityIssues`]: 1,
        overdueIssues: issue.dueDate < new Date() ? 1 : 0,
      });
    } catch (error) {
      throw new Error('Error in afterCreate trigger:', error);
    }
  });

  // ✅ AFTER UPDATE (Issue Status Change)
  Issue.afterUpdate(async (issue, options) => {
    try {
      const previousStatus = options.previous.status;
      const newStatus = issue.status;

      if (previousStatus !== newStatus) {
        await IssueStats.increment(
          { [`${newStatus.replace(/\s+/g, '').toLowerCase()}Issues`]: 1 },
          { where: { userId: issue.assignedTo } }
        );

        await IssueStats.decrement(
          { [`${previousStatus.replace(/\s+/g, '').toLowerCase()}Issues`]: 1 },
          { where: { userId: issue.assignedTo } }
        );
      }

      const previousDueDate = options.previous.dueDate;
      if (previousDueDate !== issue.dueDate) {
        await IssueStats.increment({ overdueIssues: issue.dueDate < new Date() ? 1 : 0 }, { where: { userId: issue.assignedTo } });
      }
    } catch (error) {
      throw new Error('Error in afterUpdate trigger:', error);
    }
  });

  // ✅ AFTER DESTROY (Issue Deleted)
  Issue.afterDestroy(async issue => {
    try {
      await IssueStats.decrement(
        {
          totalIssues: 1,
          [`${issue.status.replace(/\s+/g, '').toLowerCase()}Issues`]: 1,
          [`${issue.priority.toLowerCase()}PriorityIssues`]: 1,
          overdueIssues: issue.dueDate < new Date() ? 1 : 0,
        },
        {
          where: { userId: issue.assignedTo },
        }
      );
    } catch (error) {
      throw new Error('Error in afterDestroy trigger:', error);
    }
  });
};
