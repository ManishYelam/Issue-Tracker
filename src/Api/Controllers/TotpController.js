const TotpService = require('../Services/TotpService');

module.exports = {
  generate: async (req, res) => {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'User email is required' });
    }

    try {
      const { secret, qrCodeUrl } = await TotpService.generateTotp(email);
      return res.json({ secret, qrCodeUrl });
    } catch (error) {
      return res.status(500).json({ message: 'Error generating TOTP', error: error.message });
    }
  },

  verify: async (req, res) => {
    const { userToken, secret } = req.body;
    if (!userToken || !secret) {
      return res.status(400).json({ message: 'User token and secret are required' });
    }

    const isValid = TotpService.verifyTotp(userToken, secret);
    if (isValid) {
      return res.json({ message: 'Token is valid' });
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  },
};
