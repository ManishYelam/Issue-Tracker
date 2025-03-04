const express = require('express');
const authMiddleware = require('../Middlewares/authorizationMiddleware');
const authRouter = require('./authRoutes');
const roleRouter = require('./roleRoutes');
const permissionRouter = require('./permissionRoutes');
const userLogRouter = require('./userLogRoutes');
const totpRouter = require('./TotpRoutes');
const applicationRouter = require('./applicationPropertiesRoutes');
const { userRouter, userActionsRouter } = require('./userRoutes');
const { roomRouter, notificationRouter, messageRouter } = require('../../sockets/Route/ChatRoutes');
const genericRouter = require('./GenericRoutes');
const issuesRouter = require('./issueRoutes');
const fileRouter = require('./fileRoutes');

const router = express.Router();

router
  .use('/', authRouter)
  .use('/roles', authMiddleware, roleRouter)
  .use('/permissions', permissionRouter)
  .use('/users', userRouter)
  .use('/user-actions', authMiddleware, userActionsRouter)
  .use('/user_logs', authMiddleware, userLogRouter)
  .use('/totp', authMiddleware, totpRouter)
  .use('/application', applicationRouter)
  .use('/messages', messageRouter)
  .use('/notifications', authMiddleware, notificationRouter)
  .use('/rooms', authMiddleware, roomRouter)
  .use('/generics', authMiddleware, genericRouter)
  .use('/issues', authMiddleware, issuesRouter)
  .use("/files", fileRouter);

module.exports = router;
