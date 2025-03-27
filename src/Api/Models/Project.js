const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');

const ProjectsAttribute = {
  project_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
  },
  project_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: true,
  },
  client_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Completed', 'On Hold', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Active',
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    allowNull: false,
    defaultValue: 'Medium',
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  progress_percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
};

const Projects = sequelize.MAIN_DB_NAME.define('Projects', ProjectsAttribute, {
  tableName: 'tbl_Projects',
  timestamps: true,
});

module.exports = Projects;
