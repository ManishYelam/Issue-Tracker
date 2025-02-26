const Joi = require('joi');

const loginSchema = Joi.object({
  usernameOrEmail: Joi.string().required().messages({
    'string.base': 'Username or email must be a string.',
    'string.empty': 'Username or email is required.',
    'any.required': 'Username or email is required.',
  }),
  password: Joi.string().min(8).max(255).required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters long.',
    'string.max': 'Password must be at most 255 characters long.',
    'any.required': 'Password is required.',
  }),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(255).required().messages({
    'string.base': 'Old password must be a string.',
    'string.empty': 'Old password is required.',
    'string.min': 'Old password must be at least 8 characters long.',
    'string.max': 'Old password must be at most 255 characters long.',
    'any.required': 'Old password is required.',
  }),
  newPassword: Joi.string().min(8).max(255).required().messages({
    'string.base': 'New password must be a string.',
    'string.empty': 'New password is required.',
    'string.min': 'New password must be at least 8 characters long.',
    'string.max': 'New password must be at most 255 characters long.',
    'any.required': 'New password is required.',
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.base': 'Token must be a string.',
    'string.empty': 'Token is required.',
    'any.required': 'Token is required.',
  }),
  newPassword: Joi.string().min(8).max(255).required().messages({
    'string.base': 'New password must be a string.',
    'string.empty': 'New password is required.',
    'string.min': 'New password must be at least 8 characters long.',
    'string.max': 'New password must be at most 255 characters long.',
    'any.required': 'New password is required.',
  }),
});

const refreshTokenSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.base': 'Token must be a string.',
    'string.empty': 'Token is required.',
    'any.required': 'Token is required.',
  }),
});

module.exports = {
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
};
