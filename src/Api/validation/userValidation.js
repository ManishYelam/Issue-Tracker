const Joi = require('joi');

const registerSchema = Joi.object({
  user_name: Joi.string().required(),
  role: Joi.string()
    .valid('SuperAdmin', 'Admin', 'Moderator', 'User', 'Guest')
    .required(),
  user_email: Joi.string().email().required(),
  user_password: Joi.string().min(6).required(),
  user_contact: Joi.string().min(10).max(15).required(),
});

const loginSchema = Joi.object({
  user_email: Joi.string().email().required(),
  user_password: Joi.string().required(),
});

const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const refreshTokenSchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  refreshTokenSchema,
};
