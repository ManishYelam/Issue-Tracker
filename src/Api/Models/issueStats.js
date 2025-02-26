const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');

const IssueStats = sequelize.define(
  'IssueStats',
  {
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    totalIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    pendingIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    inProgressIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    onHoldIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    resolvedIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    toBeTestedIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    testedIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    committedIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    rejectedIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    criticalIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    highPriorityIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    mediumPriorityIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    lowPriorityIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    overdueIssues: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    }
  },
  {
    tableName: 'tbl_issue_stats',
    timestamps: true
  }
);

module.exports = IssueStats;
