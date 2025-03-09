const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');

const IssueStats = sequelize.MAIN_DB_NAME.define(
  'IssueStats',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    total_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    pending_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    in_progress_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    on_hold_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    resolved_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    to_be_tested_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    tested_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    committed_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    rejected_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    critical_priority_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    high_priority_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    medium_priority_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    low_priority_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    overdue_issues: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
  },
  {
    tableName: 'tbl_issue_stats',
    timestamps: true,
  }
);

module.exports = IssueStats;
