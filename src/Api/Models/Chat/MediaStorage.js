const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../Config/Database/db.config');
const User = require('../User');

const MediaStorage = sequelize.MAIN_DB_NAME.define(
  'MediaStorage',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnailPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storageType: {
      type: DataTypes.ENUM('local', 'cloud'),
      defaultValue: 'local',
    },
    uploadDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lastAccessed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    checksum: {
      type: DataTypes.STRING,
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
    accessPermissions: {
      type: DataTypes.ENUM('private', 'public', 'restricted'),
      defaultValue: 'private',
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'tbl_media_storage',
    timestamps: true,
  }
);

module.exports = MediaStorage;
