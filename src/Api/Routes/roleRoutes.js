const express = require('express');
const roleController = require('../Controllers/RoleController');
const validate = require('../Middlewares/validateMiddleware');
const { roleCreateSchema, rolePermissionsAssignSchema, roleUpdateSchema } = require('../Middlewares/Joi_Validations/roleSchema');
const roleRouter = express.Router();

roleRouter
  .post('/', validate(roleCreateSchema), roleController.createRoles)
  .post('/:roleId/permissions', roleController.assignPermissionsToRole)
  .post('/:userID/user-permissions', roleController.assignPermissionsToUser)
  .get('/', roleController.getAllRoles)
  .get('/:id', roleController.getRoleById)
  .put('/:id', validate(roleUpdateSchema), roleController.updateRole)
  .delete('/:id', roleController.deleteRole);

module.exports = roleRouter;
