const Permission = require("../Models/Permission");
const Role = require("../Models/Role");
const User = require("../Models/User");

module.exports = {
  createPermission: async (data) => {
    return Permission.bulkCreate(data);
  },

  getAllPermissions: async () => {
    return await Permission.findAll();;
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

  getUserPermissionTree: async () => {
    try {
      const user = await User.findAll({
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
