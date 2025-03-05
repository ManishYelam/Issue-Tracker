const { Op } = require("sequelize");
const Permission = require("../Models/Permission");
const Role = require("../Models/Role");
const User = require("../Models/User");

module.exports = {
  createPermission: async (data) => {
    return Permission.bulkCreate(data);
  },

  getAllPermissions: async ({ page = 1, limit = 10, search = "", searchFields = [], filters = {} }) => {
    try {
      const offset = (page - 1) * limit;
      let whereConditions = {};

      // **Apply Filters Dynamically**
      if (filters.status) whereConditions.status = filters.status;
      if (filters.level) whereConditions.level = filters.level;
      if (filters.department) whereConditions.department = { [Op.like]: `%${filters.department}%` };
      if (filters.assigned_to) whereConditions.assigned_to = { [Op.like]: `%${filters.assigned_to}%` };
      if (filters.priority) whereConditions.priority = filters.priority;
      if (filters.action_type) whereConditions.action_type = { [Op.like]: `%${filters.action_type}%` };
      if (filters.permission_group_id) whereConditions.permission_group_id = filters.permission_group_id;

      // **Apply Dynamic Search Using `.map()`**
      let searchConditions = search && searchFields.length > 0
        ? searchFields.map((field) => ({ [field]: { [Op.like]: `%${search}%` } }))
        : [];

      // **Final WHERE condition combining filters & search**
      let finalWhereCondition = { ...whereConditions };
      if (searchConditions.length > 0) {
        finalWhereCondition[Op.or] = searchConditions;
      }

      // **Fetch Permissions with Filters, Pagination & Sorting**
      const { rows, count } = await Permission.findAndCountAll({
        where: finalWhereCondition,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        message: "✅ Permissions fetched successfully.",
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: rows,
      };
    } catch (error) {
      console.error("❌ Error in getAllPermissions:", error.message);
      throw new Error(`❌ Error in getAllPermissions: ${error.message}`);
    }
  },

  getPermissionById: async (id) => {
    return Permission.findByPk(id);
  },

  updatePermission: async (id, data) => {
    return Permission.update(data, { where: { id } });
  },

  deletePermission: async (id) => {
    return Permission.destroy({ where: { id } });
  },

  getUserPermissionTree: async (userId) => {
    try {
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          include: {
            model: Permission,
            through: { attributes: [] },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error fetching user permissions: ' + error.message);
    }
  },
};
