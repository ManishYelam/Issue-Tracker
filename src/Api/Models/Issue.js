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
    type: DataTypes.STRING,
    allowNull: false
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'MEDIUM'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING'
  },
  category: {
    type: DataTypes.STRING(100)
  },
  impactArea: {
    type: DataTypes.STRING(255)
  },
  reproducibility: {
    type: DataTypes.STRING,
    defaultValue: 'ALWAYS'
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
    type: DataTypes.STRING,
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
  tableName: 'tbl_issues',
  timestamps: true
});

module.exports = Issue;
