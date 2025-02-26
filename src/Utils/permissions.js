const { User, Role, Permission } = require('../Api/Models/Association');

module.exports = {
  assignPermissionsToRole: async (roleId, permissionIds) => {
    try {
      const role = await Role.findByPk(roleId);
      if (!role) {
        console.error(`Role with ID ${roleId} not found.`);
        return;
      }

      const permissions = await Permission.findAll({
        where: { id: permissionIds },
      });

      if (permissions.length === 0) {
        console.error(`No permissions found for IDs: ${permissionIds}`);
        return;
      }

      await role.addPermissions(permissions);
      console.log(`Permissions assigned to role ID ${roleId}:`, permissionIds);
    } catch (error) {
      console.error('Error assigning permissions:', error);
    }
  },

  checkUserPermission: async (userId, permissionName) => {
    try {
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          include: Permission,
        },
      });

      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        return false;
      }

      const hasPermission = user.Roles.flatMap((role) => role.Permissions).some(
        (perm) => perm.name === permissionName
      );

      return hasPermission;
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  },
};

// assignPermissionsToRole(1, [1, 2, 3]);

// checkUserPermission(1, 'edit_articles')
//     .then(hasPermission => {
//         console.log('User has permission:', hasPermission);
//     });
