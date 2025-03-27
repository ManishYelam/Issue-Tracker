const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const Projects = require('./Project');
const User = require('./User');

const teamAttribute = {
  team_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
  },
  team_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  project_id: {
    type: DataTypes.UUID,
    references: {
      model: Projects,
      key: 'project_id',
    },
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: true,
  },
  team_lead_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  team_type: {
    type: DataTypes.ENUM('Development', 'QA', 'Design', 'Operations'),
    allowNull: false,
  },
  communication_channel: {
    type: DataTypes.STRING(255), // e.g., Slack, Teams, Email
    allowNull: true,
  },
};

const Team = sequelize.MAIN_DB_NAME.define('Team', teamAttribute, {
  tableName: 'tbl_team',
  timestamps: true,
});

module.exports = Team;
