const { createPermission, getAllPermissions, getPermissionById, updatePermission, deletePermission } = require("../../Controllers/PermissionController");
const validate = require("../../Middlewares/validateMiddleware");
const { permissionCreateSchema, permissionUpdateSchema } = require("../../Middlewares/Joi_Validations/roleSchema");

module.exports = [
  {
    method: 'post',
    path: '/',
    middlewares: [validate(permissionCreateSchema)],
    controller: createPermission,
  },
  {
    method: 'get',
    path: '/',
    middlewares: [],
    controller: getAllPermissions,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [],
    controller: getPermissionById,
  },
  {
    method: 'put',
    path: '/:id',
    middlewares: [validate(permissionUpdateSchema)],
    controller: updatePermission,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [],
    controller: deletePermission,
  },
];
