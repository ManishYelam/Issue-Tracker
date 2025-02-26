const authRouter = require('../authRoutes');
const roleRouter = require('../roleRoutes');
const permissionRouter = require('../permissionRoutes');
const userRouter = require('../userRoutes');
const userLogRouter = require('../userLogRoutes');
const departmentRouter = require('../departmentRoutes');
const totpRouter = require('../TotpRoutes');
const authMiddleware = require('../../Middlewares/authorizationMiddleware');
const uploadMiddleware = require('../../Middlewares/uploadMiddleware');
const { uploadMedia } = require('../../Controllers/mediaController');

module.exports = [
  {
    path: '/',
    router: authRouter,
    middleware: [],
  },
  {
    path: '/roles',
    router: roleRouter,
    middleware: [],
  },
  {
    path: '/permissions',
    router: permissionRouter,
    middleware: [authMiddleware],
  },
  {
    path: '/users',
    router: userRouter,
    middleware: [],
  },
  {
    path: '/user_logs',
    router: userLogRouter,
    middleware: [authMiddleware],
  },
  {
    path: '/departments',
    router: departmentRouter,
    middleware: [authMiddleware],
  },
  {
    path: '/totp',
    router: totpRouter,
    middleware: [authMiddleware],
  },
  {
    method: 'post',
    path: '/upload/:category/:isMultiple',
    handler: uploadMedia,
    middleware: [authMiddleware, uploadMiddleware],
  },
];
