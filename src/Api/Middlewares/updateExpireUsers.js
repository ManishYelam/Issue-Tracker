const User = require('../Models/User');
const { Op } = require('sequelize');

const updateExpireUsers = async () => {
  try {
    // Find all users where `expiresAt` is in the past
    const users = await User.findAll({
      where: {
        expiresAt: { [Op.lt]: new Date() },
      },
    });

    for (const user of users) {
      console.log(`🔄 Updating User ID: ${user.id}, Expired At: ${user.expiresAt}`);

      user.logged_in_status = false;
      user.logoff_by = 'SYSTEM';
      user.expiredAt = new Date(); // Set expiredAt to now
      user.expiresAt = null; // Reset expiresAt

      await user.save(); // Save updated user
      console.log(`✅ Updated User ID: ${user.id}`);
    }

    console.log('✅ All expired users updated successfully.');
  } catch (error) {
    throw new Error('Error updating expired users:', error.message);
  }
};

module.exports = updateExpireUsers;
