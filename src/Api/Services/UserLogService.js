const { Op } = require('sequelize');
const { UserLog } = require('../Models/Association');
const sequelize = require('../../Config/Database/sequelize.config');

module.exports = {
  upsertUserLog: async (data) => {
    try {
      const { user_id, source_ip, device, related_info, logoff_by, jwt_token, action } = data;
      let existingLog = await UserLog.findOne({
        where: {
          user_id,
          source_ip,
          logoff_at: null,
          logoff_by: null,
        },
      });

      if (existingLog && action === 'logout') {
        if (!logoff_by) {
          return { success: false, message: '❌ logoff_by is required for logout action.' };
        }
        await existingLog.update({
          logoff_at: new Date(),
          logoff_by,
        });
        return { success: true, message: '✅ User logged out successfully.', data: existingLog };
      } else if (existingLog && action === 'login') {
        await existingLog.update({
          device,
          related_info,
          login_at: new Date(),
          jwt_token,
        });
        return { success: true, message: '✅ User re-logged in successfully.', data: existingLog };
      } else {
        const newLog = await UserLog.create({
          user_id,
          source_ip,
          device,
          related_info,
          login_at: new Date(),
          jwt_token
        },
        );
        return { success: true, message: '✅ New user log created.', data: newLog };
      }
    } catch (error) {
      return { success: false, message: `❌ Error in upsertUserLog: ${error.message}` };
    }
  },

  getAllUserLogs: async ({ page = 1, limit = 10, filters = {}, search = '', searchFields = [] }) => {
    try {
      const offset = (page - 1) * limit;

      let whereConditions = {};
      // Apply filters dynamically
      if (filters.user_id) whereConditions.user_id = filters.user_id;
      if (filters.source_ip) whereConditions.source_ip = filters.source_ip;
      if (filters.device) whereConditions.device = filters.device;
      if (filters.logoff_at) whereConditions.logoff_at = { [Op.gte]: new Date(filters.logoff_at) };
      if (filters.login_at) whereConditions.login_at = { [Op.gte]: new Date(filters.login_at) };

      // Apply dynamic search on specified fields
      if (search && searchFields.length > 0) {
        whereConditions[Op.or] = searchFields.map(field => ({
          [field]: { [Op.like]: `%${search}%` }
        }));
      }

      // Fetch logs with pagination, filters, and search applied
      const { rows, count } = await UserLog.findAndCountAll({
        where: whereConditions,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        message: '✅ User logs fetched successfully.',
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: rows,
      };
    } catch (error) {
      throw new Error(`❌ Error in getAllUserLogs: ${error.message}`);
    }
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
        created_at: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
  },
};
