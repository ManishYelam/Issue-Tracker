const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../Config/Database/db.config');
const User = require('../User');

const UserSettings = sequelize.MAIN_DB_NAME.define(
  'UserSettings',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    darkMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notificationMuted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en',
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    privacyLevel: {
      type: DataTypes.ENUM('public', 'private', 'friends'),
      defaultValue: 'public',
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pushNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    theme: {
      type: DataTypes.STRING,
      defaultValue: 'default',
    },
    fontSize: {
      type: DataTypes.STRING,
      defaultValue: 'medium',
    },
    showOnlineStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    profileVisibility: {
      type: DataTypes.ENUM('everyone', 'friends', 'only_me'),
      defaultValue: 'everyone',
    },
    soundEffectsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    twoFactorAuthEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    autoLogoutDuration: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    dateFormat: {
      type: DataTypes.STRING,
      defaultValue: 'MM/DD/YYYY',
    },
  },
  {
    tableName: 'tbl_user_settings',
    timestamps: true,
  }
);

module.exports = UserSettings;
