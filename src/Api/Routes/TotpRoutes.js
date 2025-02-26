// const express = require('express');
// const routeConfig = require('../Routes/Config/totpRouteConfig');
// const TotpRouter = express.Router();

// routeConfig.forEach(route => {
//     const { method, path, middlewares = [], controller } = route;
//     if (!TotpRouter[method]) {
//         throw new Error(`Invalid HTTP method: ${method} for path: ${path}`);
//     }
//     try {
//         TotpRouter[method](path, ...middlewares, controller);
//     } catch (error) {
//         throw new Error(`Failed to register route for path: ${path} - ${error.message}`);
//     }
// });

// module.exports = TotpRouter;

const express = require('express');
const TotpController = require('../Controllers/TotpController');
const TotpRouter = express.Router();

TotpRouter
  .post('/generate/:email', TotpController.generate) // Route to generate TOTP secret and QR code
  .post('/verify', TotpController.verify); // Route to verify TOTP code

module.exports = TotpRouter;
