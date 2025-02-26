const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');

const IdeaAttribute = {
  // Basic idea information
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // Additional fields for idea-specific information
  industry: {
    type: DataTypes.STRING,
    allowNull: true, // Optional, to specify the industry (e.g., FinTech, HealthTech)
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  target_market: {
    type: DataTypes.STRING,
    allowNull: true, // Optional, target market for the idea (e.g., small businesses, individuals)
  },
  stage: {
    type: DataTypes.ENUM('idea', 'prototype', 'early', 'growth', 'scale-up'),
    allowNull: false,
    defaultValue: 'idea', // Defaults to the 'idea' stage if not provided
  },
  funding_required: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // Optional, to specify the amount of funding required
  },
  funding_type: {
    type: DataTypes.ENUM('seed', 'angel', 'VC', 'bootstrapped'),
    allowNull: true, // Optional, to define the type of funding sought
  },

  // Founder-related terms and partnership
  compensation: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // Optional, to specify monetary compensation offered
  },
  equity_share: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true, // Optional, equity share offered to developers
  },
  partnership_terms: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional, to provide detailed partnership terms
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional, to provide detailed partnership terms
  },

  // Timelines and milestones for the idea
  expected_launch_date: {
    type: DataTypes.DATE,
    allowNull: true, // Optional, to set the expected launch date
  },
  development_timeline: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional, to describe the development phases and expected timeline
  },

  // Idea status and visibility
  status: {
    type: DataTypes.ENUM('open', 'closed', 'in-progress', 'completed'),
    allowNull: false,
    defaultValue: 'open', // The default status of an idea when posted
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private'),
    allowNull: false,
    defaultValue: 'public', // The default visibility of an idea (can be public or private)
  },

  // Multi-media support (attachments like images or videos to present the idea)
  pitch_video_url: {
    type: DataTypes.STRING,
    allowNull: true, // Optional, video URL for pitching the idea (e.g., YouTube, Vimeo)
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true, // JSON array to store image URLs for idea presentation (can hold multiple images)
  },

  // Metrics related to idea reach and interest
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Counter to track how many times the idea has been viewed
  },
  applications_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Counter to track how many applications have been received for the idea
  },

  // Tracking the founder's progress with the idea
  last_updated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Automatically set when the idea is updated
  },
  // Additional fields to extend the model
  tags: {
    type: DataTypes.JSON, // Array of tags for categorizing the idea
    allowNull: true, // Optional field
  },
  seeking: {
    type: DataTypes.JSON, // Array of roles the idea is seeking (e.g., Co-founders, Designers)
    allowNull: true, // Optional field
  },
  location: {
    type: DataTypes.STRING, // Location of the idea (e.g., city or region)
    allowNull: true, // Optional field
  },
  posted: {
    type: DataTypes.DATE, // Date when the idea was posted
    allowNull: false, // Required field
    defaultValue: DataTypes.NOW, // Defaults to the current date
  },
  marketSize: {
    type: DataTypes.STRING, // Market size (e.g., "$2.5B")
    allowNull: true, // Optional field
  },
  traction: {
    type: DataTypes.STRING, // Describes traction or early success (e.g., "500+ waitlist signups")
    allowNull: true, // Optional field
  },
  competition: {
    type: DataTypes.JSON, // Array of competitors
    allowNull: true, // Optional field
  },
  commitment: {
    type: DataTypes.STRING, // Commitment level (e.g., "Full-time")
    allowNull: true, // Optional field
  },
  validation: {
    type: DataTypes.JSON, // Array of validation methods (e.g., user interviews, MVP builds)
    allowNull: true, // Optional field
  },
  upvotes: {
    type: DataTypes.INTEGER, // Number of upvotes for the idea
    defaultValue: 0, // Default to 0 upvotes
  },
  comments: {
    type: DataTypes.INTEGER, // Number of comments on the idea
    defaultValue: 0, // Default to 0 comments
  },
};

const Idea = sequelize.MAIN_DB_NAME.define('Idea', IdeaAttribute, {
  tableName: 'tbl_idea',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['visibility'] },
    { fields: ['posted'] },
    { fields: ['status', 'visibility'] },
    { fields: ['upvotes', 'views_count'] },
    { fields: ['marketSize', 'traction'] },
    { fields: ['location'] },
  ],
});

module.exports = Idea;
