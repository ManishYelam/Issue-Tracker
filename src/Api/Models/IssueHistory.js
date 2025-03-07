const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const Issue = require('./Issue');
const User = require('./User');

const issueHistoryAttributes = {
  issue_history_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  issue_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Issue,
      key: 'issue_id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  changeDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  action_type: {
    type: DataTypes.ENUM('create', 'update', 'view', 'delete'),
    allowNull: false,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  device_type: {
    type: DataTypes.ENUM('desktop', 'mobile', 'tablet'),
    allowNull: true,
  },
  before_status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'On Hold', 'Resolved', 'To Be Tested', 'Tested', 'Commited', 'Rejected'),
    allowNull: false,
  },
  after_status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'On Hold', 'Resolved', 'To Be Tested', 'Tested', 'Commited', 'Rejected'),
    allowNull: false,
  },
  comment_text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};
const IssueHistory = sequelize.MAIN_DB_NAME.define('tbl_issue_histories', issueHistoryAttributes, {
  timestamps: true,
});

module.exports = IssueHistory;
