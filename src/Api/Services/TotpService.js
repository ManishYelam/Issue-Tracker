const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { getUserByEmail } = require('./UserService');

module.exports = {
  generateTotp: async userEmail => {
    const user = await getUserByEmail(userEmail);

    const secret = speakeasy.generateSecret({ length: 50 });
    const otpauth = `otpauth://totp/${user}?secret=${secret.base32}&issuer=@ManishYelam$..!`;

    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    return { secret: secret.base32, qrCodeUrl };
  },

  verifyTotp: (userToken, secret) => {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: userToken,
      window: 1,
    });
  },
};
