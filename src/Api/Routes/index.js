// const express = require('express');
// const routeConfig = require('./Config/routeConfig');
// const authMiddleware = require('../Middlewares/authorizationMiddleware');
// const uploadMiddleware = require('../Middlewares/uploadMiddleware');

// const middlewareMap = { authMiddleware, uploadMiddleware };

// const router = express.Router();

// routeConfig.forEach(route => {
//   const { method, path, router: subRouter, handler, middleware } = route;
//   const middlewares = [];
//   if (middleware && middleware.length) {
//     middleware.forEach(mw => {
//       if (middlewareMap[mw]) {
//         middlewares.push(middlewareMap[mw]);
//       }
//     });
//   }
//   if (subRouter) {
//     router.use(path, ...middlewares, subRouter);
//   }
//   if (method && handler) {
//     router[method](path, ...middlewares, handler);
//   }
// });

// module.exports = router;

const express = require('express');
const authMiddleware = require('../Middlewares/authorizationMiddleware');
const authRouter = require('./authRoutes');
const roleRouter = require('./roleRoutes');
const permissionRouter = require('./permissionRoutes');
// const userRouter = require('./userRoutes');
// const userActionsRouter = require('./userRoutes');
const userLogRouter = require('./userLogRoutes');
const totpRouter = require('./TotpRoutes');
const applicationRouter = require('./ApplicationPropertiesRoutes');
const ideaRouter = require('./IdeaRoutes');
const { userRouter, userActionsRouter } = require('./userRoutes');
const { roomRouter, notificationRouter, messageRouter } = require('../../sockets/Route/ChatRoutes');

const router = express.Router();

router
  .use('/', authRouter)
  .use('/roles', roleRouter)
  .use('/permissions', permissionRouter)
  .use('/users', userRouter)
  .use('/user-actions', authMiddleware, userActionsRouter)
  .use('/user_logs', authMiddleware, userLogRouter)
  .use('/totp', authMiddleware, totpRouter)
  .use('/application', applicationRouter)
  .use('/idea', authMiddleware, ideaRouter)
  .use('/messages', messageRouter)
  .use('/notifications', authMiddleware, notificationRouter)
  .use('/rooms', authMiddleware, roomRouter)
  

module.exports = router;
