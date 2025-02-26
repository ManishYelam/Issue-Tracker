const { hashPassword } = require('../Helpers/hashPassword');
const { Op } = require('sequelize');
const { generateOTPTimestamped, verifyOTPTimestamped } = require('../../Utils/OTP');
const { sendLaunchCodeEmail, sendVerificationEmail } = require('./email.Service');
const { User, Role, Permission  } = require('../Models/Association');
const { sequelize } = require('../../Config/Database/db.config');

module.exports = {
  createUser: async (data) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      // Hash password if provided
      if (data.password) {
        data.password = await hashPassword(data.password);
      }
      // Generate OTP
      const { otp, expiryTime } = generateOTPTimestamped();
      data.otp = otp;
      data.expiryTime = expiryTime;
      // User object
      const user = {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        date_of_birth: data.date_of_birth,
        phone_number: data.phone_number,
        whatsapp_number: data.whatsapp_number,
        address: data.address,
        status: data.status || "active",
        role_id: data.role_id || 2,
        user_metadata: data.user_metadata,
      };
      const newUser = await User.create(user, { transaction });
      await transaction.commit();

      const generateVerificationUrl = (userId, otp) => {
        const baseUrl = "http://localhost:5000/verify";
        return `${baseUrl}?userId=${userId}&otp=${otp}`;
      };
      const verificationUrl = generateVerificationUrl(newUser._id, otp);
      await sendLaunchCodeEmail(newUser.id, newUser.username, newUser.email, verificationUrl, otp);
      console.log("OTP Sent:", otp);

      return { newUser  };
    } catch (error) {
      await transaction.rollback();
      throw new Error("Error creating user: " + error.message);
    }
  },

  verifyCreateUser: async (data) => {
    try {
      const user = await User.findByPk(data);
      if (!user) throw new Error('User not found');
      const { launchCode: savedCode, launchCodeExpiry } = user;
      const { isValid, message } = verifyOTPTimestamped(
        data.launchCode,
        savedCode,
        launchCodeExpiry
      );
      if (!isValid) throw new Error(message);
      user.isVerified = true;
      user.launchCode = null;
      user.launchCodeExpiry = null;
      await user.save();
      await sendVerificationEmail(user.username, user.email);
      return user;
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  },

  getAllUsers: async () => {
    return User.findAll({ include: [Role] });
  },

  getUserById: async (id) => {
    const user = await User.findByPk(id, {
      include: {
        model: Role,
        // include: {
        //   model: Permission,
        //   through: { attributes: [] },
        // },
      },
    });
    return user;
  },

  checkExistsEmail: async (email) => {
    const user = await User.findOne({ where: { email } });
    return user;
  },

  checkExistsUsername: async (username) => {
    const user = await User.findOne({ where: { username } });
    return user;
  },

  updateUser: async (userId, data) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        throw new Error("User not found");
      }
      // Prepare updated user data
      const updatedUserData = {
        username: data.username ?? user.username,
        email: data.email ?? user.email,
        first_name: data.first_name ?? user.first_name,
        last_name: data.last_name ?? user.last_name,
        date_of_birth: data.date_of_birth ?? user.date_of_birth,
        phone_number: data.phone_number ?? user.phone_number,
        whatsapp_number: data.whatsapp_number ?? user.whatsapp_number,
        address: data.address ?? user.address,
        status: data.status ?? user.status,
        role_id: data.role_id ?? user.role_id,
        user_metadata: data.user_metadata ? { ...user.user_metadata, ...data.user_metadata } : user.user_metadata
      };
      // Update user record
      await user.update(updatedUserData, { transaction });
      await transaction.commit();
      return { updatedUser: user  };
    } catch (error) {
      await transaction.rollback();
      throw new Error("Error updating user: " + error.message);
    }
  },

  deleteUser: (id) => {
    return User.destroy({ where: { id } });
  },

  deleteUserRanges: async (startId, endId) => {
    const deletedCount = await User.destroy({
      where: {
        id: {
          [Op.between]: [startId, endId],
        },
      },
    });
    return deletedCount;
  },

  checkUserPermission: async (userId, permissionName) => {
    const user = await User.findByPk(userId, {
      include: {
        model: Role,
        include: Permission,
      },
    });
    if (!user) throw new Error('User not found');
    const roles = user.Roles || [];
    const hasPermission = roles
      .flatMap((role) => role.Permissions || [])
      .some((perm) => perm.name === permissionName);
    return hasPermission;
  },
};
