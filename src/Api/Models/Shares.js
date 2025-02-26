const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');
const Idea = require('./Ideas');
// const { User, Post } = require('./Association');

const ShareAttribute = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  idea_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Idea,
      key: 'id',
    },
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const Share = sequelize.MAIN_DB_NAME.define('Share', ShareAttribute, {
  tableName: 'tbl_shares',
  timestamps: true,
});

module.exports = Share;
