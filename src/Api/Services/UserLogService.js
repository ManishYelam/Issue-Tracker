const { Op } = require('sequelize');
const { UserLog } = require('../Models/Association');

module.exports = {
  upsertUserLog: async (data) => {
    try {
      // Step 1: Check if a log exists for the given user_id & source_ip
      const existingLog = await UserLog.findOne({
        where: {
          user_id: data.user_id,
          source_ip: data.source_ip,
        },
      });
      // Step 2: If log exists but logoff_at or login_at are NULL, update only missing values
      if (existingLog && (!existingLog.logoff_at || !existingLog.login_at)) {
        const updateFields = {};
        if (!existingLog.logoff_at && data.logoff_at) updateFields.logoff_at = data.logoff_at;
        if (!existingLog.login_at && data.login_at) updateFields.login_at = data.login_at;
        if (data.jwt_token) updateFields.jwt_token = data.jwt_token; // Always update token
        await existingLog.update(updateFields);
        return {
          message: '🔄 User log updated with missing values.',
          data: existingLog,
        };
      }
      // Step 3: If log exists and all details are available, create a new log
      if (existingLog) {
        const newLog = await UserLog.create({
          user_id: data.user_id,
          source_ip: data.source_ip,
          device: data.device,
          related_info: data.related_info ,
          logoff_by: data.logoff_by,
          logoff_at: data.logoff_at , // Ensure not null
          login_at: data.login_at ,  // Ensure not null
          jwt_token: data.jwt_token,
        });
        return {
          message: '✅ New user log created on re-login.',
          data: newLog,
        };
      }
      // Step 4: If no log exists, create a new entry
      const newLog = await UserLog.create({
        user_id: data.user_id,
        source_ip: data.source_ip,
        device: data.device,
        related_info: data.related_info ,
        logoff_by: data.logoff_by,
        logoff_at: data.logoff_at, // Ensure not null
        login_at: data.login_at ,  // Ensure not null
        jwt_token: data.jwt_token,
      });
      return {
        message: '✅ New user log created successfully.',
        data: newLog,
      };
    } catch (error) {
      throw new Error(`❌ Error in upsertUserLog: ${error.message}`);
    }
  },

  getAllUserLogs: async () => {
    return await UserLog.findAll();
  },

  getUserLogById: async (id) => {
    return await UserLog.findByPk(id);
  },

  deleteUserLog: async (id) => {
    const userLog = await UserLog.findByPk(id);
    if (!userLog) throw new Error('User Log not found');
    return await UserLog.destroy({ where: { id } });
  },

  deleteLogsInRange: async (startDate, endDate) => {
    return UserLog.destroy({
      where: {
        login_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
  },
};
