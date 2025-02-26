const { createRole, assignPermissionsToRole, getAllRoles, getRoleById, updateRole, deleteRole } = require("../../Controllers/RoleController");
const validate = require("../../Middlewares/validateMiddleware");
const { roleCreateSchema, rolePermissionsAssignSchema, roleUpdateSchema } = require("../../Middlewares/Joi_Validations/roleSchema");

module.exports = [
  {
    method: 'post',
    path: '/',
    middlewares: [validate(roleCreateSchema)],
    controller: createRole,
  },
  {
    method: 'post',
    path: '/:roleId/permissions',
    middlewares: [validate(rolePermissionsAssignSchema)],
    controller: assignPermissionsToRole,
  },
  {
    method: 'get',
    path: '/',
    middlewares: [],
    controller: getAllRoles,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [],
    controller: getRoleById,
  },
  {
    method: 'put',
    path: '/:id',
    middlewares: [validate(roleUpdateSchema)],
    controller: updateRole,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [],
    controller: deleteRole,
  },
];
