const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');
const User = require('./User');
const Idea = require('./Ideas');

const FavoriteAttribute = {
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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const Favorite = sequelize.MAIN_DB_NAME.define('Favorite', FavoriteAttribute, {
  tableName: 'tbl_favorites',
  timestamps: false,
});

module.exports = Favorite;
