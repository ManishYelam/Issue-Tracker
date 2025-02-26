const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../Config/Database/db.config');

const RoomMembers = sequelize.MAIN_DB_NAME.define(
  'RoomMembers',
  {
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('member', 'admin', 'moderator', 'owner'),
      defaultValue: 'member',
    },
    isMuted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mutedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bannedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bannedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    joinDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    leaveDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pinnedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastSeen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isTyping: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customNickname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'left', 'banned'),
      defaultValue: 'active',
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
    tableName: 'tbl_room_members',
    timestamps: true,
    // paranoid: true,
  }
);

module.exports = RoomMembers;
