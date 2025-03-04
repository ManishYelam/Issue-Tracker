const permissionService = require('../Services/PermissionService');

module.exports = {
  createPermissions: async (req, res) => {
    try {
      const newPermission = await permissionService.createPermission(req.body);
      res.status(201).json(newPermission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllPermissions: async (req, res) => {
    try {
      const { page, limit, search, searchFields, ...filters } = req.body;
      const permissions = await permissionService.getAllPermissions({ page, limit, search, searchFields, ...filters });
      res.status(200).json(permissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPermissionById: async (req, res) => {
    try {
      const permission = await permissionService.getPermissionById(req.params.id);
      if (!permission)
        return res.status(404).json({ message: 'Permission not found' });
      res.status(200).json(permission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePermission: async (req, res) => {
    try {
      const updatedPermission = await permissionService.updatePermission(req.params.id, req.body);
      if (updatedPermission[0] === 0)
        return res.status(404).json({ message: 'Permission not found' });
      res.status(200).json({ message: 'Permission updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deletePermission: async (req, res) => {
    try {
      const deleted = await permissionService.deletePermission(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: 'Permission not found' });
      res.status(200).json({ message: 'Permission deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllPermissionsTree: async (req, res) => {
    try {
      console.log(req);
      const permissionTree = await permissionService.getAllPermissionsTree();
      res.status(200).json({ permissionTree });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching permission tree',
        error: error.message,
      });
    }
  },

  getUserPermissionTree: async (req, res) => {
    try {
      const { id } = req.params;
      const permissionTree = await permissionService.getUserPermissionTree(id);
      res.status(200).json({ permissionTree });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user permission tree',
        error: error.message,
      });
    }
  },
};
