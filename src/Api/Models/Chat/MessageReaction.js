const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../Config/Database/db.config');
const User = require('../User');
const Message = require('./Message');

const MessageReaction = sequelize.MAIN_DB_NAME.define(
  'MessageReaction',
  {
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Message,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    reactionType: {
      type: DataTypes.ENUM('like', 'love', 'laugh', 'angry', 'sad', 'wow', 'dislike', 'custom'),
      allowNull: false,
    },
    customReaction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reactionIcon: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'tbl_message_reaction',
    timestamps: true,
  }
);

module.exports = MessageReaction;
