const { Op } = require("sequelize");
const Permission = require("../Models/Permission");
const Role = require("../Models/Role");
const RolePermissions = require("../Models/RolePermissions");
const User = require("../Models/User");
const { getUserById } = require("./UserService");

module.exports = {
  createRoles: async (data) => {
    return Role.bulkCreate(data);
  },

  assignPermissionsToRole: async (roleId, permissionIds) => {
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new Error("Role not found");
    }
    const permissions = await Permission.findAll({
      where: { id: permissionIds },
    });
    if (!permissions.length) {
      throw new Error("Permissions not found");
    }
    await role.addPermissions(permissions);
    return {
      message: "Permissions assigned to role successfully",
      role,
      permissions,
    };
  },

  _assignPermissionsToUserInDB: async (userID, validPermissions) => {
    try {
      if (!Array.isArray(validPermissions) || validPermissions.length === 0) {
        return { message: "No valid permissions to update." };
      }
      const [updatedUser] = await User.update(
        { permission_ids: validPermissions },
        { where: { id: userID } }
      );
      return { message: "User permissions updated successfully", updatedUser };
    } catch (error) {
      console.error("Error updating user permissions:", error.message);
      return { error: error.message };
    }
  },

  assignPermissionsToUser: async (userID, permissionIds) => {
    try {
      const user = await getUserById(userID);
      if (!user) {
        throw new Error("User not found");
      }

      if (!user.Role || !user.Role.id) {
        throw new Error("User role is missing");
      }

      const role = await module.exports.getRoleById(user.Role.id);
      if (!role) {
        throw new Error("Role not found");
      }

      if (!role.role || !role.role.Permissions) {
        throw new Error("Role or permissions not found");
      }

      const validPermissionIdsArray = role.role.Permissions.map(permission => {
        if (!permission || !permission.id) {
          return null;
        }
        return permission.id;
      }).filter(id => id !== null);

      // Separate valid and invalid permission IDs
      const validPermissions = permissionIds.filter(id => validPermissionIdsArray.includes(id));
      const invalidPermissions = permissionIds.filter(id => !validPermissionIdsArray.includes(id));

      let permissionUpdateResult = null;

      // Upsert valid permissions (Insert or Update logic in DB)
      if (validPermissions.length > 0) {
        try {
          permissionUpdateResult = await module.exports._assignPermissionsToUserInDB(userID, validPermissions);
        } catch (dbError) {
          return {
            message: "Failed to update permissions",
            validPermissions,
            invalidPermissions,
            error: dbError.message
          };
        }
      }
      return {
        updatedPermissions: permissionUpdateResult,
        validPermissions,
        invalidPermissions
      };

    } catch (error) {
      return {
        message: "Failed to update permissions",
        error: error.message
      };
    }
  },

  getAllRoles: async ({ page = 1, limit = 10, search = "", searchFields = [], filters = {} }) => {
    try {
      const offset = (page - 1) * limit;
      let whereConditions = {};
      let permissionWhereConditions = {};

      // **Apply Role Filters Dynamically**
      if (filters.status) whereConditions.status = filters.status;
      if (filters.created_by) whereConditions.created_by = filters.created_by;
      if (filters.updated_by) whereConditions.updated_by = filters.updated_by;
      if (filters.name) whereConditions.name = { [Op.like]: `%${filters.name}%` };
      if (filters.code) whereConditions.code = { [Op.like]: `%${filters.code}%` };

      // **Apply Permission Filters Dynamically**
      if (filters.permission_name) permissionWhereConditions.name = { [Op.like]: `%${filters.permission_name}%` };
      if (filters.permission_level) permissionWhereConditions.level = filters.permission_level;
      if (filters.permission_status) permissionWhereConditions.status = filters.permission_status;

      // **Apply Dynamic Search Using `.map()`**
      let searchConditions = search && searchFields.length > 0
        ? searchFields.map((field) => ({ [field]: { [Op.like]: `%${search}%` } }))
        : [];

      // **Final WHERE condition combining filters & search**
      let finalWhereCondition = { ...whereConditions };
      if (searchConditions.length > 0) {
        finalWhereCondition[Op.or] = searchConditions;
      }

      // **Fetch Roles with Filters, Pagination & Include Permissions**
      const { rows, count } = await Role.findAndCountAll({
        where: finalWhereCondition,
        include: [
          {
            model: Permission,
            where: permissionWhereConditions, // Apply filters on permissions
            required: false, // Allows roles with no permissions
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        message: "✅ Roles fetched successfully.",
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: rows,
      };
    } catch (error) {
      throw new Error(`❌ Error in getAllRoles: ${error.message}`);
    }
  },

  getRoleById: async (id) => {
    const role = await Role.findByPk(id, {
      include: {
        model: Permission,
        through: { attributes: [] },
      },
    });
    return { role };
  },

  updateRole: async (id, data) => {
    return Role.update(data, { where: { id } });
  },

  deleteRole: async (id) => {
    return Role.destroy({ where: { id } });
  },
};
