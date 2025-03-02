const express = require('express');
const validateAsync = require('../Middlewares/validateAsyncMiddleware');
const authMiddleware = require('../Middlewares/authorizationMiddleware');
const { userSchema, userUpdateSchema, createUserSchema, updateUserSchema } = require('../Middlewares/Joi_Validations/userSchema');
const userController = require('../Controllers/UserController');

const userRouter = express.Router();
const userActionsRouter = express.Router();

// User routes
userRouter
  .post('/', validateAsync(createUserSchema), userController.createUser)
  .get('/verify', userController.verifyCreateUser)
  .get('/:userId/permissions/:permissionName', authMiddleware, userController.checkUserPermission)
  .get('/', userController.getAllUsers)
  .get('/:id', userController.getUserById)
  .put('/:id', authMiddleware, validateAsync(updateUserSchema), userController.updateUser)
  .delete('/:id', authMiddleware, userController.deleteUser)
  .delete('/user_range/:start_id/to/:end_id', authMiddleware, userController.deleteUserRanges);

// User Actions routes
userActionsRouter
  
// Export both routers properly
module.exports = {
  userRouter,
  userActionsRouter
};
