const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');

const Stats = sequelize.MAIN_DB_NAME.define(
  'Stats',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    entity_type: {
      type: DataTypes.ENUM('idea', 'user', 'project', 'comment', 'post', 'article', 'event', 'company', 'job_listing', 'profile', 'resume'),
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    views: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    upvotes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    downvotes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    comments: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    followers: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    favorites: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    reports: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    shares: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    downloads: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    bookmarks: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    applied: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    saves: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    messages: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    ratings: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    average_rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    edits: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    deletes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    feedbacks: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    subscriptions: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    unsubscribes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'tbl_stats',
    timestamps: true,
    indexes: [
      { fields: ['entity_type', 'entity_id'] },
      { fields: ['views'] },
      { fields: ['upvotes'] },
      { fields: ['followers'] },
    ],
  }
);

module.exports = Stats;
