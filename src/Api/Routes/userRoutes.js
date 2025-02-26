const express = require('express');
const validateAsync = require('../Middlewares/validateAsyncMiddleware');
const authMiddleware = require('../Middlewares/authorizationMiddleware');
const { userSchema, userUpdateSchema } = require('../Middlewares/Joi_Validations/userSchema');
const userController = require('../Controllers/UserController');
const UserActionsController = require('../Controllers/UserActionsController');

const userRouter = express.Router();
const userActionsRouter = express.Router();

// User routes
userRouter
  .post('/', validateAsync(userSchema), userController.createUser)
  .get('/verify', userController.verifyCreateUser)
  .get('/:userId/permissions/:permissionName', authMiddleware, userController.checkUserPermission)
  .get('/', userController.getAllUsers)
  .get('/:id', userController.getUserById)
  .put('/:id', authMiddleware, validateAsync(userUpdateSchema), userController.updateUser)
  .delete('/:id', authMiddleware, userController.deleteUser)
  .delete('/user_range/:start_id/to/:end_id', authMiddleware, userController.deleteUserRanges);

// User Actions routes
userActionsRouter
  .post('/:action/:id', UserActionsController.actionOnIdea)
  .post('/log', UserActionsController.logUserAction)
  .get('/:userId', UserActionsController.getUserActions)
  .get('/type/:actionType', UserActionsController.getActionsByType)
  .get('/entity/:entityType/:entityId', UserActionsController.getEntityActions)
  .get('/count/type/:actionType', UserActionsController.countActionsByType)
  .get('/recent', UserActionsController.getRecentActions)
  .get('/popular/:entityType', UserActionsController.getPopularEntities)
  .get('/date-range/:startDate/:endDate', UserActionsController.getActionsByDateRange)
  .delete('/:id', UserActionsController.deleteUserAction)
  .put('/:id', UserActionsController.updateUserAction)

  .post('/request/:userId/:targetUserId/:action', UserActionsController.ConnectionRequest)
  .get('/request/:userId', UserActionsController.getConnectionData)

// Export both routers properly
module.exports = {
  userRouter,
  userActionsRouter
};
