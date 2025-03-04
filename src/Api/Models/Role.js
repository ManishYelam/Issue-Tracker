const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');

const roleAttribute = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'No description',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updated_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const Role = sequelize.MAIN_DB_NAME.define('Role', roleAttribute, {
  tableName: 'tbl_role',
  timestamps: true,
});

module.exports = Role;
