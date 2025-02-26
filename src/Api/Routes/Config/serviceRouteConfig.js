const { getAllServicesData, getServiceData, } = require('../../Controllers/ServiceController');

module.exports = [
  {
    method: 'get',
    path: '/all-services',
    middlewares: [],
    controller: getAllServicesData,
  },
  {
    method: 'get',
    path: '/:service/:endpoint',
    middlewares: [],
    controller: getServiceData,
    dynamicService: true, // Special flag for handling dynamic service URLs
  },
];
