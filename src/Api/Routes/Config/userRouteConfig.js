const { createUser, verifyCreateUser, checkUserPermission, getAllUsers, getUserById, updateUser, deleteUser, deleteUserRanges } = require("../../Controllers/UserController");
const authMiddleware = require("../../Middlewares/authorizationMiddleware");
const validateAsync = require("../../Middlewares/validateAsyncMiddleware");
const { userSchema, userUpdateSchema } = require("../../Middlewares/Joi_Validations/userSchema");

module.exports = [
  {
    method: 'post',
    path: '/',
    middlewares: [validateAsync(userSchema)],
    controller: createUser,
  },
  {
    method: 'get',
    path: '/verify',
    middlewares: [],
    controller: verifyCreateUser,
  },
  {
    method: 'get',
    path: '/:userId/permissions/:permissionName',
    middlewares: [authMiddleware],
    controller: checkUserPermission,
  },
  {
    method: 'get',
    path: '/',
    middlewares: [authMiddleware],
    controller: getAllUsers,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [authMiddleware],
    controller: getUserById,
  },
  {
    method: 'put',
    path: '/:id',
    middlewares: [validateAsync(userUpdateSchema)],
    controller: updateUser,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [authMiddleware],
    controller: deleteUser,
  },
  {
    method: 'delete',
    path: '/user_range/:start_id/to/:end_id',
    middlewares: [authMiddleware],
    controller: deleteUserRanges,
  },
];
