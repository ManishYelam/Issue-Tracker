// const express = require('express');
// const routeConfig = require('../Routes/Config/permissionRouteConfig');

// const permissionRouter = express.Router();

// routeConfig.forEach(route => {
//     const { method, path, middlewares = [], controller } = route;
//     if (!permissionRouter[method]) {
//         throw new Error(`Invalid HTTP method: ${method} for path: ${path}`);
//     }
//     try {
//         permissionRouter[method](path, ...middlewares, controller);
//     } catch (error) {
//         throw new Error(`Failed to register route for path: ${path} - ${error.message}`);
//     }
// });

// module.exports = permissionRouter;

const express = require('express');
const permissionController = require('../Controllers/PermissionController');
const validate = require('../Middlewares/validateMiddleware');
const { permissionCreateSchema, permissionUpdateSchema } = require('../Middlewares/Joi_Validations/roleSchema');
const permissionRouter = express.Router();

permissionRouter
  .post('/', validate(permissionCreateSchema), permissionController.createPermissions)
  .get('/', permissionController.getAllPermissions)
  .get('/:id', permissionController.getPermissionById)
  .put('/:id', validate(permissionUpdateSchema), permissionController.updatePermission)
  .delete('/:id', permissionController.deletePermission)
  .get('/tree/:userId', permissionController.getUserPermissionTree)
  .get('/tree', permissionController.getAllPermissionsTree);

module.exports = permissionRouter;
