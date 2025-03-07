const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');

const LikeAttribute = {
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
  entity_type: {
    type: DataTypes.ENUM('post', 'comment', 'Idea'),
    allowNull: false,
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const Like = sequelize.MAIN_DB_NAME.define('Like', LikeAttribute, {
  tableName: 'tbl_likes',
  timestamps: false,
});

module.exports = Like;
