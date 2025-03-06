const { Op } = require('sequelize');
const { UserLog } = require('../Models/Association');
const sequelize = require('../../Config/Database/sequelize.config');

module.exports = {
  upsertUserLog: async (data) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      const { user_id, source_ip, device, related_info, logoff_by, logoff_at, login_at, jwt_token } = data;

      // 🔍 Check if a log already exists for the user and source IP
      let existingLog = await UserLog.findOne({ where: { user_id, source_ip }, transaction, });

      if (existingLog && existingLog.logoff_by == null && existingLog.logoff_at == null) {
        // 🛠️ Update missing fields only
        const updateFields = {};
        if (!existingLog.logoff_by && logoff_by) updateFields.logoff_by = logoff_by;
        if (!existingLog.logoff_at && logoff_at) updateFields.logoff_at = logoff_at;
        if (!existingLog.login_at && login_at) updateFields.login_at = login_at;
        if (jwt_token) updateFields.jwt_token = jwt_token; // Always update JWT token

        if (Object.keys(updateFields).length > 0) {
          await existingLog.update(updateFields, { transaction });
          await transaction.commit();
          return { message: '✅ User log updated successfully.', data: existingLog };
        }

        // 🔄 If log exists and all fields are filled, create a new log
        const newLog = await UserLog.create(
          { user_id, source_ip, device, related_info, logoff_by, logoff_at, login_at, jwt_token },
          { transaction }
        );
        await transaction.commit();
        return { message: '✅ New user log created on re-login.', data: newLog };
      }

      // 🆕 If no existing log, create a new entry
      const newLog = await UserLog.create(
        { user_id, source_ip, device, related_info, logoff_by, logoff_at, login_at, jwt_token },
        { transaction }
      );

      await transaction.commit();
      return { message: '✅ New user log created successfully.', data: newLog };
    } catch (error) {
      await transaction.rollback();
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
