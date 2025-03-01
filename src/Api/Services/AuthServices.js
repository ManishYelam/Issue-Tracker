const { Op } = require('sequelize');
const { JWT_CONFIG } = require('../../Utils/constants');
const { comparePassword, hashPassword } = require('../Helpers/hashPassword');
const { generateToken, verifyToken, blacklistToken } = require('../../Utils/jwtSecret');
const { generateOTPTimestamped } = require('../../Utils/OTP');
const { sendResetPasswordCodeEmail, sendPasswordChangeEmail } = require('../Services/email.Service');
const { User, UserLog, Role, Permission, Organization, } = require('../Models/Association');

const AuthService = {
  login: async (email, password) => {
    try {
      // Fetch user with associated role
      const user = await User.findOne({
        where: { email },
        include: [{ model: Role }],
      });

      if (!user) throw new Error('Invalid credentials');

      // Validate password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) throw new Error('Invalid credentials');

      // Extract necessary user data for the token
      const user_info = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        date_of_birth: user.date_of_birth,
        phone_number: user.phone_number,
        address: user.address,
        status: user.status,
        isVerified: user.isVerified,
        permission_ids: user.permission_ids ?? [],
        user_metadata: user.user_metadata ?? {},
        role_info: user.Role && {
          id: user.Role.id,
          code: user.Role.code,
          name: user.Role.name,
          description: user.Role.description,
          created_by: user.Role.created_by,
          updated_by: user.Role.updated_by,
          createdAt: user.Role.createdAt,
          updatedAt: user.Role.updatedAt,
        },
      };

      // Generate JWT token
      const token = generateToken(user_info); // Fixed function call

      // Update user login status in a single database query
      await user.update({
        logged_in_status: true,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        expiredAt: null,
      });

      return { token, user };
    } catch (error) {
      console.error('Login error:', error.message);
      throw new Error('Login failed. Please try again.');
    }
  },

  logout: async (userId, token, ip) => {
    if (!token) {
      throw new Error('No token provided for logout');
    }

    if (!userId || !ip) {
      throw new Error('User ID and IP address are required for logout');
    }

    try {
      // Blacklist the token (if a mechanism is used)
      const blacklistPromise = blacklistToken ? blacklistToken(token) : Promise.resolve(null);

      // Log the logout event
      const logPromise = UserLog.create({
        userId,
        sourceIp: ip,
        logoffBy: 'USER',
        logoffAt: new Date(),
        jwtToken: token,
      });

      // Execute both operations in parallel
      const [logout] = await Promise.all([blacklistPromise, logPromise]);

      return { logout };
    } catch (error) {
      console.error('Logout error:', error.message);
      throw new Error('Logout failed. Please try again.');
    }
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

      // Ensure new password is different (direct string comparison before hashing)
      if (old_password === new_password) {
        throw new Error('New password cannot be the same as the old password');
      }

      const newHashedPassword = await hashPassword(new_password, 10);

      // Update the password in a single database query
      await user.update({ password: newHashedPassword });

      const userName = `${user.first_name} ${user.last_name}`;
      await sendPasswordChangeEmail(userId, user.email, userName);

      return { message: 'Your password has been updated successfully! For security, please log in again with your new password.' };
    } catch (error) {
      throw new Error(`Password update failed. Please try again or contact support if the issue persists. Error: ${error.message}`);
    }
  },

  forgetPassword: async (email) => {
    try {
      const user = await User.findOne({ where: { email, status: 'active' } });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate OTP & expiry time
      const { otp, expiryTime } = generateOTPTimestamped(10, 300000, true);
      await user.update({
        otp: hashedOtp,
        expiryTime,
      });

      // Generate verification and reset password links
      const resetVerificationLink = `http://localhost:5000/verify-reset-password?userId=${user.id}&token=${otp}`;

      // Send OTP email
      const userName = `${user.first_name} ${user.last_name}`;
      await sendResetPasswordCodeEmail(user.id, userName, user.email, resetVerificationLink, otp);

      return { message: 'An OTP has been sent to your email. Please verify to proceed with password reset.' };
    } catch (error) {
      throw new Error(`Forgot password request failed: ${error.message}`);
    }
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
