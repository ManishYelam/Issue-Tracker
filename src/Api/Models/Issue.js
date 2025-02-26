const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');

const issueAttributes =
{
  issue_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  issueType: {
    type: DataTypes.ENUM('Bug', 'Feature Request', 'Task', 'Security', 'Performance'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    defaultValue: 'Medium'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'On Hold', 'Resolved', 'To Be Tested', 'Tested', 'Commited', 'Rejected'),
    defaultValue: 'Open'
  },
  category: {
    type: DataTypes.STRING(100)
  },
  impactArea: {
    type: DataTypes.STRING(255)
  },
  reproducibility: {
    type: DataTypes.ENUM('Always', 'Sometimes', 'Rarely', 'Cannot Reproduce'),
    defaultValue: 'Always'
  },
  rootCause: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reportedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  resolvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true
  },
  tags: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  relatedIssues: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  escalationLevel: {
    type: DataTypes.ENUM('None', 'L1', 'L2', 'L3', 'Critical'),
    defaultValue: 'None'
  },
  escalatedTo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  workaround: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimatedEffort: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  actualEffort: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  deploymentRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}

const Issue = sequelize.MAIN_DB_NAME.define('Issue', issueAttributes, {
  timestamps: true
});

module.exports = Issue;
