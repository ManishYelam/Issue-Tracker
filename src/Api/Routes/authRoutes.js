const express = require('express');
const AuthController = require('../Controllers/AuthController');
const authMiddleware = require('../Middlewares/authorizationMiddleware');
const validate = require('../Middlewares/validateMiddleware');
const { loginSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema } = require('../Middlewares/Joi_Validations/authSchema');

const authRouter = express.Router();
authRouter
  .post('/login', validate(loginSchema), AuthController.login)
  .post('/logout', authMiddleware, AuthController.logout)
  .post('/change-password', validate(changePasswordSchema), authMiddleware, AuthController.changePassword)
  .post('/forget-password/:email', authMiddleware, AuthController.forgetPassword)
  // .post('/reset-password', validate(resetPasswordSchema), authMiddleware, AuthController.resetPassword)
  .post('/refresh-token', validate(refreshTokenSchema), authMiddleware, AuthController.refreshToken)

  .get('/organization', AuthController.getOrganization)
  .post('/organization', authMiddleware, AuthController.upsertOrganization)

 module.exports = authRouter;
