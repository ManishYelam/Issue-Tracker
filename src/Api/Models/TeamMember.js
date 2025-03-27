const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const Team = require('./Team');
const User = require('./User');

const teamMemberAttribute = {
  team_member_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
  },
  team_id: {
    type: DataTypes.UUID,
    references: {
      model: Team,
      key: 'team_id',
    },
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  joining_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  workload_percentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100, // Full-time member
  },
};

const TeamMember = sequelize.MAIN_DB_NAME.define('TeamMember', teamMemberAttribute, {
  tableName: 'tbl_team_members',
  timestamps: true,
});

module.exports = TeamMember;
