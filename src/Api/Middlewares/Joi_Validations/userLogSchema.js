const Joi = require('joi');

// Base schema for both create, update, and query user logs
const baseUserLogSchema = Joi.object({
  userId: Joi.number().integer().positive().optional().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be a positive integer',
  }),
  sourceIp: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'] })
    .optional()
    .messages({
      'string.base': 'Source IP must be a string',
      'string.ip': 'Source IP must be a valid IP address',
    }),
  relatedInfo: Joi.string().max(500).optional().messages({
    'string.base': 'Related Info must be a string',
    'string.max': 'Related Info must be at most 500 characters long',
  }),
  logoffBy: Joi.string().valid('SYSTEM', 'USER').optional().messages({
    'string.base': 'Logoff By must be a string',
    'any.only': 'Logoff By must be either SYSTEM or USER',
  }),
  logoffAt: Joi.date().optional().messages({
    'date.base': 'Logoff At must be a valid date',
  }),
  loginAt: Joi.date().optional().messages({
    'date.base': 'Login At must be a valid date',
  }),
  jwtToken: Joi.string().optional().messages({
    'string.base': 'JWT Token must be a string',
  }),
  createdAt: Joi.date().optional().messages({
    'date.base': 'Created At must be a valid date',
  }),
});

// Forked schema for "create" use case (sourceIp and jwtToken are required for creation)
const userLogCreateSchema = baseUserLogSchema.fork(['sourceIp', 'jwtToken'], schema => schema.required());

// For "update" use case, no additional required fields, use the base schema directly
const userLogUpdateSchema = baseUserLogSchema;

// For "query" use case, allow querying by `id` (UUID) and keep everything else optional
const userLogQuerySchema = baseUserLogSchema.append({
  id: Joi.string().guid({ version: 'uuidv4' }).optional().messages({
    'string.base': 'ID must be a string',
    'string.guid': 'ID must be a valid UUID',
  }),
});

module.exports = {
  userLogCreateSchema,
  userLogUpdateSchema,
  userLogQuerySchema,
};
