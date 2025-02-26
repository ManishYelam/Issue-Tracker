const { UserLog } = require('../Models/Association');

module.exports = {
  createUserLog: async (data) => {
    return await UserLog.create(data);
  },

  getAllUserLogs: async () => {
    return await UserLog.findAll();
  },

  getUserLogById: async (id) => {
    return await UserLog.findByPk(id);
  },

  updateUserLog: async (id, data) => {
    const userLog = await UserLog.findByPk(id);
    if (!userLog) throw new Error('User Log not found');
    return await UserLog.update(data, { where: { id } });
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
