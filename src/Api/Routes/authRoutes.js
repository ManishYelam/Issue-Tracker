// const express = require('express');
// const routeConfig = require('../Routes/Config/authRouteConfig');

// const authRouter = express.Router();

// routeConfig.forEach(route => {
//     const { method, path, middlewares = [], controller } = route;
//     if (!authRouter[method]) {
//         throw new Error(`Invalid HTTP method: ${method} for path: ${path}`);
//     }
//     try {
//         authRouter[method](path, ...middlewares, controller);
//     } catch (error) {
//         throw new Error(`Failed to register route for path: ${path} - ${error.message}`);
//     }
// });

// module.exports = authRouter;

const express = require('express');
const AuthController = require('../Controllers/AuthController');
const authMiddleware = require('../Middlewares/authorizationMiddleware');
const validate = require('../Middlewares/validateMiddleware');
const { loginSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema } = require('../Middlewares/Joi_Validations/authSchema');

const authRouter = express.Router();
authRouter
  .post('/login', validate(loginSchema), AuthController.login)
  .post('/logout', authMiddleware, AuthController.logout)
  .post('/forget-password/:email', authMiddleware, AuthController.forgetPassword)
  .post('/reset-password', validate(resetPasswordSchema), authMiddleware, AuthController.resetPassword)
  .post('/change-password', validate(changePasswordSchema), authMiddleware, AuthController.changePassword)
  .post('/refresh-token', validate(refreshTokenSchema), authMiddleware, AuthController.refreshToken)

  .get('/organization', AuthController.getOrganization)
  .post('/organization', authMiddleware, AuthController.upsertOrganization)

 module.exports = authRouter;
