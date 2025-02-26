const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');

const UserActions = sequelize.MAIN_DB_NAME.define(
  'UserActions',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action_type: {
      type: DataTypes.ENUM('create', 'post', 'view', 'like', 'upvotes', 'comment', 'share', 'apply', 'save', 'report', 'follow', 'unfollow', 'subscribe', 'download', 'upload', 'message', 'review', 'rate', 'bookmark', 'edit', 'delete', 'feedback', 'favorite', 'unfavorite'),
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.ENUM('idea', 'profile', 'comment', 'project', 'resume', 'portfolio', 'post', 'article', 'event', 'company', 'job_listing'),
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    favorited_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    device_type: {
      type: DataTypes.ENUM('desktop', 'mobile', 'tablet'),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deleted'),
      allowNull: false,
      defaultValue: 'active',
    },
    comment_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issue_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'tbl_user_actions',
    timestamps: true,
  }
);

module.exports = UserActions;
