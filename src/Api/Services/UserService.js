const { hashPassword } = require('../Helpers/hashPassword');
const { Op } = require('sequelize');
const { generateOTPTimestamped, verifyOTPTimestamped } = require('../../Utils/OTP');
const { sendLaunchCodeEmail, sendVerificationEmail } = require('./email.Service');
const { User, Role, Permission } = require('../Models/Association');
const { sequelize } = require('../../Config/Database/db.config');

module.exports = {
  createUser: async (data) => {
    try {
      // Hash password if provided
      if (data.password) data.password = await hashPassword(data.password);

      // Generate OTP
      const { otp, expiryTime } = generateOTPTimestamped(8, 300000, true);
      data.otp = otp;
      data.expiryTime = expiryTime;

      // Create user
      const newUser = await User.create({
        password: data.password,
        otp,
        expiryTime,
        ...data
      });

      // Generate verification URL
      const verificationUrl = `http://localhost:5173/verify?userId=${newUser.id}&otp=${otp}`;
      const userName = `${newUser.first_name} ${newUser.last_name}`;
      await sendLaunchCodeEmail(newUser.id, userName, newUser.email, verificationUrl, otp);

      console.log(`OTP Sent: ${otp} & Expiry: ${expiryTime}`);
      return { success: true, message: "User created successfully", user: newUser };
    } catch (error) {
      return { success: false, message: "Error creating user: " + error.message };
    }
  },

  verifyCreateUser: async (userId, launchCode) => {
    try {
      const user = await User.findByPk(userId);
      if (!user) throw new Error('User not found');

      const { launchCode: otp, expiryTime } = user;
      if (!otp || !expiryTime) throw new Error('Launch code is missing or expired');

      const { isValid, message } = verifyOTPTimestamped(launchCode, otp, expiryTime);
      if (!isValid) throw new Error(message);

      // Update user verification status
      user.isVerified = true;
      user.launchCode = null;
      user.launchCodeExpiry = null;
      await user.save();

      const userName = `${user.first_name} ${user.last_name}`;
      await sendVerificationEmail(userName, user.email);

      return user;
    } catch (error) {
      throw new Error(`Verification failed: ${error.message}`);
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
      return { updatedUser: user };
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
