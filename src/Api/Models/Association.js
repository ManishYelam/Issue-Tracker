const User = require('./User');
const UserLog = require('./user_logs');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermissions = require('./RolePermissions');
const Organization = require('./Organization');
const ApplicationProperties = require('./Application.Prop');
const Like = require('./likes');
const UserConnection = require('./UserConnections');
const IssueHistory = require('./IssueHistory');
const IssueComment = require('./IssueComment');
const IssueStats = require('./issueStats');
const ListOfValues = require('./List.Of.values');
const Issue = require('./Issue');

// User-Role relationship: A user belongs to a role, and a role has many users.
User.belongsTo(Role, { through: 'UserRoles', foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

// Define Association: User.belongsTo(Role) using role from User and code from Role
User.belongsTo(Role, {
  foreignKey: 'role', // `User.role` references `Role.code`
  targetKey: 'code',   // `code` is the primary field in Role
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Role.hasMany(User, {
  foreignKey: 'role',
  sourceKey: 'code',
});

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
Issue.belongsTo(User, { foreignKey: 'reported_by', as: 'reporter' });

// Issue is assigned to a User (assignedTo)
Issue.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

// Issue is resolved by a User (resolvedBy)
Issue.belongsTo(User, { foreignKey: 'resolved_by', as: 'resolver' });

// Issue is escalated to a User (escalatedTo)
Issue.belongsTo(User, { foreignKey: 'escalated_to', as: 'escalationHandler' });

// Issue has many Comments
Issue.hasMany(IssueComment, { foreignKey: 'issueId', as: 'comments' });
IssueComment.belongsTo(Issue, { foreignKey: 'issueId' });

// Issue has many History records
Issue.hasMany(IssueHistory, { foreignKey: 'issue_id', as: 'history' });
IssueHistory.belongsTo(Issue, { foreignKey: 'issue_id' });

IssueStats.belongsTo(User, { foreignKey: 'user_id' });

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
  ListOfValues
};
