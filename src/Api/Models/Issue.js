const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const Projects = require('./Project');

const issueAttributes = {
  project_id: {
    type: DataTypes.UUID,
    references: {
      model: Projects,
      key: 'project_id',
    },
    allowNull: false,
  },
  issue_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  issue_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'MEDIUM',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING',
  },
  category: {
    type: DataTypes.STRING(100),
  },
  impact_area: {
    type: DataTypes.STRING(255),
  },
  reproducibility: {
    type: DataTypes.STRING,
    defaultValue: 'ALWAYS',
  },
  root_cause: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // assigned_to: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // },
  // reported_by: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false
  // },
  // resolved_by: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resolution_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  steps: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  related_issues: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  escalation_level: {
    type: DataTypes.STRING,
    defaultValue: 'None',
  },
  // escalated_to: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true
  // },
  workaround: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estimated_effort: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  actual_effort: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  deployment_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  environments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  browsers: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
};

const Issue = sequelize.MAIN_DB_NAME.define('Issue', issueAttributes, {
  tableName: 'tbl_issues',
  timestamps: true,
});

module.exports = Issue;
