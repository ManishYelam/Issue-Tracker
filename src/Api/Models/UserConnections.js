const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');

const UserConnection = sequelize.MAIN_DB_NAME.define(
  'UserConnection',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    connected_user_ids: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    sended_requests: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    pending_requests: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    accepted_requests: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    rejected_requests: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    blocked_requests: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private', 'connections_only'),
      defaultValue: 'connections_only',
    },
    mutual_connection_ids: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    is_favorite: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    interaction_user_ids: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
    tableName: 'tbl_user_connections',
  }
);

module.exports = UserConnection;
