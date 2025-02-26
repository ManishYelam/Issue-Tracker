const roleService = require('../Services/RoleServices');

module.exports = {
  createRoles: async (req, res) => {
    try {
      const newRoles = await roleService.createRoles(req.body);
      res
        .status(201)
        .json({ message: 'Roles created successfully', roles: newRoles });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  assignPermissionsToRole: async (req, res) => {
    try {
      const { roleId } = req.params;
      const { permissionIds } = req.body;
      const result = await roleService.assignPermissionsToRole(
        roleId,
        permissionIds
      );
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  assignPermissionsToUser: async (req, res) => {
    try {
      const { userID } = req.params;
      const { permissionIds } = req.body;
      console.log(permissionIds);      
      const result = await roleService.assignPermissionsToUser(userID, permissionIds);
      console.log(result);
      
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllRoles: async (req, res) => {
    try {
      const health_id = req.user.health_id;
      const roles = await roleService.getAllRoles(health_id);
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getRoleById: async (req, res) => {
    try {
      const role = await roleService.getRoleById(req.params.id);
      if (!role) return res.status(404).json({ message: 'Role not found' });
      res.status(200).json(role);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateRole: async (req, res) => {
    try {
      const health_id = req.user.health_id;
      const updatedRole = await roleService.updateRole(
        health_id,
        req.params.id,
        req.body
      );
      if (updatedRole[0] === 0)
        return res.status(404).json({ message: 'Role not found' });
      res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteRole: async (req, res) => {
    try {
      const health_id = req.user.health_id;
      const deleted = await roleService.deleteRole(health_id, req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Role not found' });
      res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
