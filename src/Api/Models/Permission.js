const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');

const permissionAttribute = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'A1',
  },
  parent_permission_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_leaf: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'active',
  },
  assigned_to: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  valid_from: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  resource_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  action_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  permission_group_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
};

const Permission = sequelize.MAIN_DB_NAME.define('Permission', permissionAttribute, {
  tableName: 'tbl_permission',
  timestamps: true,
});

module.exports = Permission;
