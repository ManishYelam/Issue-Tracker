const User = require('./User');
const UserLog = require('./user_logs');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermissions = require('./RolePermissions');
const Organization = require('./Organization');
const ApplicationProperties = require('./Application.Prop');
const Like = require('./likes');
const UserConnection = require('./UserConnections');
const Issue = require('./Issue');
const IssueHistory = require('./IssueHistory');
const IssueComment = require('./IssueComment');
const IssueStats = require('./issueStats');

// User-Role relationship: A user belongs to a role, and a role has many users.
User.belongsTo(Role, { through: 'UserRoles', foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

// User-UserLog relationship: A user can have many logs.
User.hasMany(UserLog, { foreignKey: 'user_id' });
UserLog.belongsTo(User, { foreignKey: 'user_id' });

// Role-Permission many-to-many relationship via RolePermissions.
Role.belongsToMany(Permission, { through: 'RolePermissions', foreignKey: 'role_id', otherKey: 'permission_id' });
Permission.belongsToMany(Role, { through: 'RolePermissions', foreignKey: 'permission_id', otherKey: 'role_id' });

// Organization-User relationship: An organization has many users.
Organization.hasMany(User, { foreignKey: 'id' });
User.belongsTo(Organization, { foreignKey: 'id' });

// Organization-Role relationship: An organization has many roles.
Organization.hasMany(Role, { foreignKey: 'id' });
Role.belongsTo(Organization, { foreignKey: 'id' });

// User-ApplicationProperties relationship: A user has many application properties.
User.hasMany(ApplicationProperties, { foreignKey: 'user_id', as: 'applicationProperties' });
ApplicationProperties.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Issue belongs to a User (reportedBy)
Issue.belongsTo(User, { foreignKey: 'reportedBy', as: 'reporter' });

// Issue is assigned to a User (assignedTo)
Issue.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

// Issue is resolved by a User (resolvedBy)
Issue.belongsTo(User, { foreignKey: 'resolvedBy', as: 'resolver' });

// Issue is escalated to a User (escalatedTo)
Issue.belongsTo(User, { foreignKey: 'escalatedTo', as: 'escalationHandler' });

// Issue has many Comments
Issue.hasMany(IssueComment, { foreignKey: 'issueId', as: 'comments' });
IssueComment.belongsTo(Issue, { foreignKey: 'issueId' });

// Issue has many History records
Issue.hasMany(IssueHistory, { foreignKey: 'issue_id', as: 'history' });
IssueHistory.belongsTo(Issue, { foreignKey: 'issue_id' });

IssueStats.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  UserLog,
  Role,
  Permission,
  RolePermissions,
  Organization,
  ApplicationProperties,
  Issue,
  IssueComment,
  IssueHistory,
  IssueStats,
  Like,
  UserConnection,
};
