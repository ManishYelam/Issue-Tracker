const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../Config/Database/db.config');
const User = require('../User');

const BlockedUser = sequelize.MAIN_DB_NAME.define(
  'BlockedUser',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    blockedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPermanent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'revoked'),
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
    tableName: 'tbl_blocked_users',
    timestamps: true,
  }
);

module.exports = BlockedUser;
