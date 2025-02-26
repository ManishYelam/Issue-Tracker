const { createUserLog, getAllUserLogs, getUserLogById, updateUserLog, deleteUserLog, deleteLogsInRange } = require("../../Controllers/UserLogController");
const validate = require("../../Middlewares/validateMiddleware");
const { userLogCreateSchema, userLogUpdateSchema } = require("../../Middlewares/Joi_Validations/userLogSchema");

module.exports = [
  {
    method: 'post',
    path: '/',
    middlewares: [validate(userLogCreateSchema)],
    controller: createUserLog,
  },
  {
    method: 'get',
    path: '/',
    middlewares: [],
    controller: getAllUserLogs,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [],
    controller: getUserLogById,
  },
  {
    method: 'put',
    path: '/:id',
    middlewares: [validate(userLogUpdateSchema)],
    controller: updateUserLog,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [],
    controller: deleteUserLog,
  },
  {
    method: 'delete',
    path: '/logs_range/:start_date/to/:end_date',
    middlewares: [],
    controller: deleteLogsInRange,
  },
];
