const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');
const Issue = require('./Issue');

const CommentAttribute = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  issue_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Issue,
      key: 'issue_id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  comment_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parent_comment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tbl_issue_comments',
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  likes_by: {
    type: DataTypes.JSON,
    defaultValue: 0,
    defaultValue: []
  },
  dislikes_by: {
    type: DataTypes.JSON,
    defaultValue: 0,
    defaultValue: []
  },
  is_edited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  edited_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reaction_data: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
  flagged_by: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  device_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
  },
};

const IssueComment = sequelize.MAIN_DB_NAME.define('IssueComment', CommentAttribute, {
  tableName: 'tbl_issue_comments',
  timestamps: false,
});

module.exports = IssueComment;
