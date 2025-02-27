const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(8).max(255).required(),
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
