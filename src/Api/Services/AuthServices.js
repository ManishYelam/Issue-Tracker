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

    if (user.logged_in_status === true) {
      throw new Error('User is already logged In');
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    const token = generateToken(user, req, res);

    user.logged_in_status = true;
    user.token = token;
    user.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.expiresAt = null;
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

  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const user = await models.MAIN.User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) {
        throw new Error('Old password is incorrect');
      }
      const newHashedPassword = await hashPassword(newPassword, 10);
      await models.MAIN.User.update(
        { password: newHashedPassword },
        { where: { id: userId } }
      );
      const userName = `${user.first_name} ${user.last_name}`;
      await sendPasswordChangeEmail(userId, user.email, userName);
      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new Error('Password change failed', error);
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
