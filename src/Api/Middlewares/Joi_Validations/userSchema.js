const Joi = require('joi');
const { checkExistsEmail, checkExistsUsername, } = require('../../Services/UserService');
const { prefixes } = require('../../../Config/Database/Data');

const checkEmailDuplicate = async (value, helpers) => {
  const user = await checkExistsEmail(value);
  if (user) {
    return helpers.message(
      `Duplicate email found. Please provide a unique email address. Email - ${value}`
    );
  }
  return value;
};

const checkUsernameDuplicate = async (value, helpers) => {
  const user = await checkExistsUsername(value);
  if (user) {
    return helpers.message(
      `Duplicate username found. Please provide a unique username. Username - ${value}`
    );
  }
  return value;
};

const founderSchema = Joi.object({
  startup_name: Joi.string().max(100).required(),
  industry: Joi.string().max(100).valid("Tech", "Health", "Finance", "Education", "Retail", "Other").required(),
  number_of_employees: Joi.number().integer().min(1).required(),
  stage: Joi.string().valid("*-", "Ideation", "Validation", "Early Traction", "Scaling").required(),
  nature_of_business: Joi.string().valid("Product", "Service", "Process").required(),
  revenue_model: Joi.string().max(255).required(),
  unique_value_proposition: Joi.string().max(500).required(),
  pitch_deck: Joi.string().uri().required(),
});

const userSchema = Joi.object({
  username: Joi.string().max(50).required().external(checkUsernameDuplicate),
  email: Joi.string().email().max(100).required().external(checkEmailDuplicate),
  password: Joi.string().min(8).max(255).required(),
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  date_of_birth: Joi.date().iso().optional(),
  phone_number: Joi.string().max(15).optional(),
  whatsapp_number: Joi.string().max(15).optional(),
  address: Joi.string().max(500).optional(),
  status: Joi.string().valid('active', 'inactive', 'banned').default('active'),
  role_id: Joi.number().integer().optional().default(2),
  user_metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional(),

  // Conditionally include startup fields if role_id is 1
  founder_info: Joi.when("role_id", {
    is: 1,
    then: founderSchema.required(),
    otherwise: Joi.forbidden(),
  }),
});

const userUpdateSchema = Joi.object({
  username: Joi.string().max(50).optional(),
  email: Joi.string().email().max(100).optional(),
  password: Joi.string().min(8).max(255).forbidden(),
  first_name: Joi.string().max(50).optional(),
  last_name: Joi.string().max(50).optional(),
  date_of_birth: Joi.date().iso().optional(),
  phone_number: Joi.string().max(15).optional(),
  whatsapp_number: Joi.string().max(15).optional(),
  address: Joi.string().max(500).optional(),
  status: Joi.string().valid('active', 'inactive', 'banned').optional(),
  role_id: Joi.number().integer().optional(),
  user_metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional(),

  // Conditionally include startup fields if role_id is 1
  founder_info: Joi.when("role_id", {
    is: 1,
    then: founderSchema.required(),
    otherwise: Joi.forbidden(),
  }),
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
