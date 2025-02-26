const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config'); // Ensure this is the correct path
const User = require('./User'); // Make sure the User model is correctly defined and exported

const userlogAttribute = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User, // The User model
      key: 'id', // Reference the id field in the User table
    },
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Set default as current timestamp
  },
  sourceIp: {
    type: DataTypes.STRING(45),
    allowNull: false, // IP address must be provided
  },
  relatedInfo: {
    type: DataTypes.TEXT,
    allowNull: true, // Additional info related to the log can be optional
  },
  logoffBy: {
    type: DataTypes.ENUM('SYSTEM', 'USER'), // Logoff triggered by system or user
    allowNull: true,
  },
  logoffAt: {
    type: DataTypes.DATE, // Logoff time
    allowNull: true,
  },
  loginAt: {
    type: DataTypes.DATE, // Login time
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  jwtToken: {
    type: DataTypes.TEXT, // Store JWT token
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE, // Record creation time
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
};
// Define the UserLog model
const UserLog = sequelize.MAIN_DB_NAME.define('UserLog', userlogAttribute, {
  tableName: 'tbl_user_log', // Table name in the database
  timestamps: false, // Disable automatic timestamps
  underscored: true, // Use snake_case in column names
});

module.exports = UserLog;
