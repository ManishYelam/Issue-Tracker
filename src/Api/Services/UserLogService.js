const { UserLog } = require('../Models/Association');

module.exports = {
  upsertUserLog: async (data) => {
    try {
      const [userLog, created] = await UserLog.findOrCreate({
        where: { jwt_token: data.jwt_token }, // Find by token
        defaults: {
          user_id: data.user_id,
          source_ip: data.source_ip,
          device: data.device,
          related_info: data.related_info || null,
          logoff_by: data.logoff_by || null,
          logoff_at: data.logoff_at || null,
          login_at: data.login_at || new Date(),
        },
      });
      // If the record already exists, update the log data
      if (!created) {
        await userLog.update({
          source_ip: data.source_ip,
          device: data.device,
          related_info: data.related_info || null,
          logoff_by: data.logoff_by || null,
          logoff_at: data.logoff_at || null,
          login_at: data.login_at || new Date(),
        });
      }
      return {
        message: created
          ? '✅ New user log created successfully.'
          : '🔄 User log updated successfully.',
        data: userLog,
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
