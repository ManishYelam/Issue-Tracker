const Joi = require('joi');

const roleCreateSchema = Joi.array()
  .items(
    Joi.object({
      code: Joi.string().max(100).required(),
      name: Joi.string().max(100).required(),
      description: Joi.string().max(500).optional(),
      created_by: Joi.string().required(),
      updated_by: Joi.string().required(),
    })
  )
  .min(1);

const roleUpdateSchema = Joi.object({
  code: Joi.string().max(100).required(),
  name: Joi.string().max(100).optional(),
  description: Joi.string().max(500).optional(),
  updated_by: Joi.string().required(),
});

const roleQuerySchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  name: Joi.string().max(100).optional(),
});

const permissionCreateSchema = Joi.array()
  .items(
    Joi.object({
      id: Joi.number().optional(),
      name: Joi.string().max(100).required(),
      description: Joi.string().optional(),
      url: Joi.string().optional(),
      level: Joi.string().max(100).default('A1'),
      parent_permission_id: Joi.number().integer().positive().allow(null),
      is_leaf: Joi.boolean().default(false),
      status: Joi.string().valid('active', 'inactive').default('active'),
      assigned_to: Joi.string().optional(),
      valid_from: Joi.date().optional(),
      valid_until: Joi.date().optional(),
      priority: Joi.number().integer().optional(),
      department: Joi.string().optional(),
      region: Joi.string().optional(),
      resource_type: Joi.string().optional(),
      action_type: Joi.string().optional(),
      permission_group_id: Joi.number().integer().positive().allow(null),
    })
  )
  .min(1);

const permissionUpdateSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  level: Joi.string().max(100).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  priority: Joi.number().integer().optional(),
  valid_from: Joi.date().optional(),
  valid_until: Joi.date().optional(),
  parent_permission_id: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional(),
});

const rolePermissionsAssignSchema = Joi.object({
  permissionIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required(),
  roleId: Joi.number().integer().positive().required(),
});

module.exports = {
  roleCreateSchema,
  roleUpdateSchema,
  roleQuerySchema,
  permissionCreateSchema,
  permissionUpdateSchema,
  rolePermissionsAssignSchema,
};
