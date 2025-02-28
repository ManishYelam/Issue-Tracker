const { Op } = require('sequelize');
const { JWT_CONFIG } = require('../../Utils/constants');
const { comparePassword, hashPassword } = require('../Helpers/hashPassword');
const { generateToken, verifyToken, blacklistToken } = require('../../Utils/jwtSecret');
const { generateOTPTimestamped } = require('../../Utils/OTP');
const { sendResetPasswordCodeEmail, sendPasswordChangeEmail } = require('../Services/email.Service');
const { User, UserLog, Role, Permission, Organization, } = require('../Models/Association');

const AuthService = {
  login: async (email, password, req, res) => {
    const user = await User.findOne({
      where: { email: email },
      attributes: ['id', 'email', 'password', 'first_name', 'last_name', 'date_of_birth', 'phone_number', 'address', 'status', 'logged_in_status'],
      include: [{
        model: Role,
        attributes: ['id', 'name', 'description'],
        // include: [{ model: Permission, }],
      },],
    });

    if (!user) throw new Error('Invalid credentials');

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    const token = generateToken(user, req, res);

    user.logged_in_status = true;
    user.token = token;
    user.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.expiredAt = null;
    await user.save();

    return { token, user, };
  },

  logout: async (userId, token, ip) => {
    if (!token) {
      throw new Error('No token provided for logout');
    }
    // Optionally, blacklist the JWT if using a blacklist mechanism
    const logout = await blacklistToken(token);
    // Log the logout event in the UserLog table
    await UserLog.create({
      userId,
      sourceIp: ip,
      logoffBy: 'USER',
      logoffAt: new Date(),
      jwtToken: token,
    });
    return { logout };
  },

  changePassword: async (userId, old_password, new_password) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await comparePassword(old_password, user.password);
      if (!isMatch) {
        throw new Error('Old password is incorrect');
      }

      const isSameAsOld = await comparePassword(new_password, user.password);
      if (isSameAsOld) {
        throw new Error('New password cannot be the same as the old password');
      }

      const newHashedPassword = await hashPassword(new_password, 10);

      user.password = newHashedPassword;
      await user.save();

      const userName = `${user.first_name} ${user.last_name}`;
      await sendPasswordChangeEmail(userId, user.email, userName);

      return { message: 'Your password has been updated successfully! For security, please log in again with your new password.' };
    } catch (error) {
      throw new Error(`Password update failed. Please try again or contact support if the issue persists. Error: ${error.message}`);
    }
  },

  forgetPassword: async (email) => {
    const user = await models.MAIN.User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const { otp, expiryTime } = generateOTPTimestamped();
    user.otp = otp;
    user.expiryTime = expiryTime;
    const generateVerificationUrl = (userId, otp) => {
      const baseUrl = 'http://localhost:5000/verify';
      return `${baseUrl}?userId=${userId}&otp=${otp}`;
    };
    const verificationLink = generateVerificationUrl(user.id, otp);
    const resetVerificationLink = `http://localhost:5000/reset-password?userId=${user.id}&token=${otp}`;
    const userName = `${user.first_name} ${user.last_name}`;
    await sendResetPasswordCodeEmail(user.id, userName, user.email, verificationLink, resetVerificationLink, otp);
    await user.save();
    return { message: 'OTP sent to your email' };
  },

  upsertOrganization: async (data) => {
    try {
      const existingOrg = await Organization.findOne();
      // if (data.emailSettings.password) {
      //   data.emailSettings.password = await hashPassword(data.emailSettings.password);
      // }
      if (existingOrg) {
        await existingOrg.update(data);
        return { ...existingOrg.toJSON(), isNewRecord: false };
      } else {
        const newOrg = await Organization.create(data);
        return { ...newOrg.toJSON(), isNewRecord: true };
      }
    } catch (error) {
      console.error('Error in upsertOrganization:', error);
      throw new Error('Failed to upsert organization');
    }
  },

  getOrganization: async () => {
    try {
      const organization = await Organization.findOne();
      return organization ? organization.toJSON() : null;
    } catch (error) {
      console.error('Error in getOrganization:', error);
      throw new Error('Failed to fetch organization details');
    }
  },
};

module.exports = AuthService;
