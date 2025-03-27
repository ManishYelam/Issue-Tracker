const { sequelize } = require('../../Config/Database/db.config');
const {
  User,
  UserLog,
  Role,
  Permission,
  RolePermissions,
  ApplicationProperties,
  Like,
  UserConnection,
  Issue,
  IssueComment,
  IssueHistory,
  IssueStats,
  ListOfValues,
  Projects,
  Team,
  TeamMember,
} = require('./Association');
const {
  BlockedUser,
  MediaStorage,
  Message,
  MessageReaction,
  Notification,
  Room,
  RoomMembers,
  UserSettings,
} = require('./Chat/ChatAssociations');

module.exports = {
  InitializeDatabase: async () => {
    try {
      // await sequelize.MAIN_DB_NAME.sync({ alter: false });

      await Promise.all([
        User.sync({ alter: false }),
        UserLog.sync({ alter: false }),
        Role.sync({ alter: false }),
        Permission.sync({ alter: false }),
        RolePermissions.sync({ alter: false }),
        ApplicationProperties.sync({ alter: false }),
        Like.sync({ alter: false }),
        Issue.sync({ alter: false }),
        IssueComment.sync({ alter: false }),
        IssueHistory.sync({ alter: false }),
        IssueStats.sync({ alter: false }),
        UserConnection.sync({ alter: false }),

        BlockedUser.sync({ alter: false }),
        MediaStorage.sync({ alter: false }),
        Message.sync({ alter: false }),
        MessageReaction.sync({ alter: false }),
        Notification.sync({ alter: false }),
        Room.sync({ alter: false }),
        RoomMembers.sync({ alter: false }),
        UserSettings.sync({ alter: false }),

        ListOfValues.sync({ alter: false }),

        Projects.sync({ alter: true }),
        Team.sync({ alter: false }),
        TeamMember.sync({ alter: false }),

        // ApplicationProperties.addConstraint('ApplicationProperties', {
        //   type: 'unique',
        //   fields: ['property_name', 'status'],
        //   where: { status: 'active' },
        //   name: 'unique_active_app_email',
        // }),
      ]);
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  },
};
