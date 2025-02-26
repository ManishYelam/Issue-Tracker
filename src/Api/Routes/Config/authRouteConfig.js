const { login, logout, forgetPassword, resetPassword, changePassword, refreshToken } = require("../../Controllers/AuthController");
const authMiddleware = require("../../Middlewares/authorizationMiddleware");
const { loginSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema } = require("../../Middlewares/Joi_Validations/authSchema");
const validate = require("../../Middlewares/validateMiddleware");

module.exports = [
  {
    method: 'post',
    path: '/login',
    middleware: [validate(loginSchema)],
    controller: login,
  },
  {
    method: 'post',
    path: '/logout',
    middleware: [authMiddleware],
    controller: logout,
  },
  {
    method: 'post',
    path: '/forget-password/:email',
    middleware: [],
    controller: forgetPassword,
  },
  {
    method: 'post',
    path: '/reset-password',
    middleware: [validate(resetPasswordSchema), authMiddleware],
    controller: resetPassword,
  },
  {
    method: 'post',
    path: '/change-password',
    middleware: [validate(changePasswordSchema), authMiddleware],
    controller: changePassword,
  },
  {
    method: 'post',
    path: '/refresh-token',
    middleware: [validate(refreshTokenSchema), authMiddleware],
    controller: refreshToken,
  },
];
