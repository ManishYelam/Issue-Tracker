// const express = require('express');
// const routeConfig = require('../Routes/Config/roleRouteConfig');

// const roleRouter = express.Router();

// routeConfig.forEach(route => {
//     const { method, path, middlewares = [], controller } = route;
//     if (!roleRouter[method]) {
//         throw new Error(`Invalid HTTP method: ${method} for path: ${path}`);
//     }
//     try {
//         roleRouter[method](path, ...middlewares, controller);
//     } catch (error) {
//         throw new Error(`Failed to register route for path: ${path} - ${error.message}`);
//     }
// });

// module.exports = roleRouter;

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
