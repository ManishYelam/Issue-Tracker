const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../Config/Database/db.config');

const Notification = sequelize.MAIN_DB_NAME.define(
  'Notification',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('message', 'friend_request', 'mention', 'system', 'reminder', 'announcement'),
      defaultValue: 'message',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    redirectUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isImportant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM('pending', 'sent', 'failed'),
      defaultValue: 'pending',
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sentBy: {
      type: DataTypes.INTEGER,
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
  },
  {
    tableName: 'tbl_notifications',
    timestamps: true,
    // paranoid: true,
  }
);

module.exports = Notification;
