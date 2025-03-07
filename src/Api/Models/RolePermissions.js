const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/Database/db.config');

const rolePermissionsAttributes = {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  permission_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
};

const RolePermissions = sequelize.MAIN_DB_NAME.define('RolePermissions', rolePermissionsAttributes, {
  tableName: 'tbl_role_permissions',
  timestamps: false,
});

module.exports = RolePermissions;
