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
  .use('/messages', messageRouter)
  .use('/notifications', authMiddleware, notificationRouter)
  .use('/rooms', authMiddleware, roomRouter)
  

module.exports = router;
