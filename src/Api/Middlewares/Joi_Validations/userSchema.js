const Joi = require('joi');
const { checkExistsEmail } = require('../../Services/UserService');
const { prefixes } = require('../../../Config/Database/Data');
const { getAllLOVs } = require('../../Services/GenericServices');

const checkEmailDuplicate = async (value, helpers) => {
  const user = await checkExistsEmail(value);
  if (user) {
    return helpers.message(`Duplicate email found. Please provide a unique email address. Email - ${value}`);
  }
  return value;
};

const userSchema = Joi.object({
  email: Joi.string().email().max(100).required().external(checkEmailDuplicate),
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  date_of_birth: Joi.date().iso().optional(),
  phone_number: Joi.string().max(15).optional(),
  address: Joi.string().max(500).optional(),
  role: Joi.string().required().valid(),
  role_id: Joi.number().integer().optional().default(2),
  user_metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
});

const userUpdateSchema = Joi.object({
  email: Joi.string().email().max(100).optional(),
  first_name: Joi.string().max(50).optional(),
  last_name: Joi.string().max(50).optional(),
  date_of_birth: Joi.date().iso().optional(),
  phone_number: Joi.string().max(15).optional(),
  address: Joi.string().max(500).optional(),
  role_id: Joi.number().integer().optional(),
  user_metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
});

const roleSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(500).optional(),
  created_by: Joi.string().required(),
  updated_by: Joi.string().required(),
});

const permissionSchema = Joi.object({
  name: Joi.string().max(100).required(),
});

const userLogSchema = Joi.object({
  userId: Joi.number().integer().positive().optional(),
  sourceIp: Joi.string().ip().required(),
  relatedInfo: Joi.string().max(500).optional(),
  logoffBy: Joi.string().valid('SYSTEM', 'USER').optional(),
  logoffAt: Joi.date().iso().optional(),
  loginAt: Joi.date().iso().optional().default(new Date()),
  jwtToken: Joi.string().required(),
});

module.exports = {
  userSchema,
  userUpdateSchema,
  roleSchema,
  permissionSchema,
  userLogSchema,
};

const generateUserSchema = async (isUpdate = false) => {
  const userRoleLOVs = await getAllLOVs(['UserRole'], true);
  const userStatusLOVs = await getAllLOVs(['status'], true);
  const userRoleCodes = userRoleLOVs.map(lov => lov.code);
  const userStatusCodes = userStatusLOVs.map(lov => lov.code.toLowerCase());

  return Joi.object({
    ...(isUpdate
      ? {
          status: Joi.string()
            .valid(...userStatusCodes)
            .optional(),
        } // Don't include email for updates & include status for updates
      : { email: Joi.string().email().max(100).required().external(checkEmailDuplicate) }),
    first_name: Joi.string().max(50)[isUpdate ? 'optional' : 'required'](),
    last_name: Joi.string().max(50)[isUpdate ? 'optional' : 'required'](),
    date_of_birth: Joi.date().iso().optional(),
    phone_number: Joi.string().max(15).optional(),
    address: Joi.string().max(500).optional(),
    role: Joi.string()
      .valid(...userRoleCodes)
      [isUpdate ? 'optional' : 'required'](),
    role_id: Joi.number().integer().optional(),
    user_metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  });
};

const createUserSchema = () => generateUserSchema(false);
const updateUserSchema = () => generateUserSchema(true);

module.exports = { createUserSchema, updateUserSchema };
