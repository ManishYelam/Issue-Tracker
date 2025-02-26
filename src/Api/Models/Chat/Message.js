const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../Config/Database/db.config');

const Message = sequelize.MAIN_DB_NAME.define(
  'Message',
  {
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.ENUM('text', 'image', 'video', 'audio', 'file', 'link', 'sticker', 'reaction', 'system'),
      defaultValue: 'text',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readBy: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    replyTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    forwardedFrom: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mentions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    reactionCount: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'seen', 'failed'),
      defaultValue: 'sent',
    },
    priority: {
      type: DataTypes.ENUM('normal', 'important', 'urgent'),
      defaultValue: 'normal',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'tbl_message',
    timestamps: true,
    // paranoid: true,
  }
);

module.exports = Message;
