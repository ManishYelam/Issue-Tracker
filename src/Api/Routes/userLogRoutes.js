// const express = require('express');
// const routeConfig = require('../Routes/Config/userLogRouteConfig');

// const userLogRouter = express.Router();

// routeConfig.forEach(route => {
//     const { method, path, middlewares = [], controller } = route;
//     if (!userLogRouter[method]) {
//         throw new Error(`Invalid HTTP method: ${method} for path: ${path}`);
//     }
//     try {
//         userLogRouter[method](path, ...middlewares, controller);
//     } catch (error) {
//         throw new Error(`Failed to register route for path: ${path} - ${error.message}`);
//     }
// });

// module.exports = userLogRouter;

const express = require('express');
const userLogController = require('../Controllers/UserLogController');
const validate = require('../Middlewares/validateMiddleware');
const { userLogCreateSchema, userLogUpdateSchema } = require('../Middlewares/Joi_Validations/userLogSchema');
const userLogRouter = express.Router();

userLogRouter
  .post('/', userLogController.createUserLog)
  .get('/', userLogController.getAllUserLogs)
  .get('/:id', userLogController.getUserLogById)
  .put('/:id', userLogController.updateUserLog)
  .delete('/:id', userLogController.deleteUserLog)
  .delete('/logs_range/:start_date/to/:end_date', userLogController.deleteLogsInRange);

module.exports = userLogRouter;
