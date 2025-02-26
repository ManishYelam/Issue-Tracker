const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../Config/Database/db.config');

const Room = sequelize.MAIN_DB_NAME.define(
  'Room',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('private', 'group'),
      allowNull: false,
      defaultValue: 'group',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    roomAvatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'archived', 'closed'),
      defaultValue: 'active',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    inviteLink: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private', 'restricted'),
      defaultValue: 'private',
    },
    autoDeleteMessages: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    roomRules: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    allowReactions: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    allowMedia: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    roomPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminIds: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: 'tbl_room',
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Room;
