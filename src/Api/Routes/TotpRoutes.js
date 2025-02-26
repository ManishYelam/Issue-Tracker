const express = require('express');
const TotpController = require('../Controllers/TotpController');
const TotpRouter = express.Router();

TotpRouter
  .post('/generate/:email', TotpController.generate) // Route to generate TOTP secret and QR code
  .post('/verify', TotpController.verify); // Route to verify TOTP code

module.exports = TotpRouter;
