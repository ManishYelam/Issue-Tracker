const { generate, verify } = require('../../Controllers/TotpController');

module.exports = [
  {
    method: 'post',
    path: '/generate/:email',
    middlewares: [],
    controller: generate,
  },
  {
    method: 'post',
    path: '/verify',
    middlewares: [],
    controller: verify,
  },
];
