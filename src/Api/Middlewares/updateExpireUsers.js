const User = require('../Models/User');
const { Op } = require('sequelize');
const UserLog = require('../Models/user_logs');

const updateExpireUsers = async () => {
  try {
    // Update all expired users in one query
    const [userUpdatedCount] = await User.update(
      {
        logged_in_status: false,
        token: null,
        expiresAt: null, // Reset expiresAt
        expiredAt: new Date(), // Set expiredAt to now
      },
      {
        where: {
          expiresAt: { [Op.lt]: new Date() },
        },
      }
    );
    // Update UserLog table
    const [logUpdatedCount] = await UserLog.update(
      {
        logoff_by: 'SYSTEM',
        logoff_at: new Date(),
      },
      {
        where: {
          logoff_by: null,
          logoff_at: null,
          login_at: { [Op.lt]: new Date() },
        },
      }
    );
    console.log(`✅ Updated ${userUpdatedCount} users and ${logUpdatedCount} logs successfully.`);
  } catch (error) {
    console.error('❌ Error updating expired users:', error.message);
  }
};

module.exports = updateExpireUsers;
