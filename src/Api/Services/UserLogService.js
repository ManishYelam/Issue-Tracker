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
