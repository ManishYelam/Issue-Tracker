const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const Issue = require('./Issue');

const issueHistoryAttributes = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  issue_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Issue,
      key: 'id'
    }
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  changeDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  }

}
const IssueHistory = sequelize.MAIN_DB_NAME.define('IssueHistory', issueHistoryAttributes, {
  timestamps: true
});

module.exports = IssueHistory;
