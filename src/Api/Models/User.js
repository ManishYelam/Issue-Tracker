const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');

const userAttribute = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  whatsapp_number: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'banned', 'online', 'offline', 'away', 'do_not_disturb'),
    defaultValue: 'active',
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiryTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  permission_ids: {
    type: DataTypes.JSON,
  },
  user_metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
 
};

const User = sequelize.MAIN_DB_NAME.define('User', userAttribute, {
  tableName: 'tbl_user',
  timestamps: true,
});

module.exports = User;
