const { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require("../../Controllers/DepartmentController");
const { departmentCreateSchema, departmentUpdateSchema } = require("../../Middlewares/Joi_Validations/deptSchema");
const validate = require("../../Middlewares/validateMiddleware");

module.exports = [
  {
    method: 'post',
    path: '/',
    middlewares: [validate(departmentCreateSchema)],
    controller: createDepartment,
  },
  {
    method: 'get',
    path: '/',
    middlewares: [],
    controller: getAllDepartments,
  },
  {
    method: 'get',
    path: '/:id',
    middlewares: [],
    controller: getDepartmentById,
  },
  {
    method: 'put',
    path: '/:id',
    middlewares: [validate(departmentUpdateSchema)],
    controller: updateDepartment,
  },
  {
    method: 'delete',
    path: '/:id',
    middlewares: [],
    controller: deleteDepartment,
  },
];
