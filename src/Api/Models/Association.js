const User = require('./User');
const UserLog = require('./user_logs');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermissions = require('./RolePermissions');
const Organization = require('./Organization');
const ApplicationProperties = require('./Application.Prop');
const Idea = require('./Ideas');
const UserActions = require('./UserActions');
const Like = require('./likes');
const Favorite = require('./Favorites');
const Share = require('./Shares');
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
// Organization.hasMany(User, { foreignKey: 'id' });
// User.belongsTo(Organization, { foreignKey: 'id' });

// Organization-Role relationship: An organization has many roles.
// Organization.hasMany(Role, { foreignKey: 'id' });
// Role.belongsTo(Organization, { foreignKey: 'id' });

// User-ApplicationProperties relationship: A user has many application properties.
User.hasMany(ApplicationProperties, { foreignKey: 'id', as: 'applicationProperties' });
ApplicationProperties.belongsTo(User, { foreignKey: 'id', as: 'user' });


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
Issue.hasMany(IssueHistory, { foreignKey: 'issueId', as: 'history' });
IssueHistory.belongsTo(Issue, { foreignKey: 'issueId' });

// User-Idea relationship: A user can have many ideas.
User.hasMany(Idea, { foreignKey: 'user_id' });
Idea.belongsTo(User, { foreignKey: 'user_id' });

// Organization-Idea relationship: An organization can have many ideas.
Organization.hasMany(Idea, { foreignKey: 'organization_id' });
Idea.belongsTo(Organization, { foreignKey: 'organization_id' });

// Role-Idea many-to-many relationship via RoleIdeas.
Role.belongsToMany(Idea, { through: 'RoleIdeas', foreignKey: 'role_id', otherKey: 'idea_id' });
Idea.belongsToMany(Role, { through: 'RoleIdeas', foreignKey: 'idea_id', otherKey: 'role_id' });

// User-UserActions relationship: A user can have many actions.
User.hasMany(UserActions, { foreignKey: 'user_id', as: 'actions' });
UserActions.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Idea-UserActions relationship: An idea can have many actions performed on it.
Idea.hasMany(UserActions, { foreignKey: 'entity_id', scope: { entity_type: 'idea' }, as: 'ideaActions', constraints: false });
UserActions.belongsTo(Idea, { foreignKey: 'entity_id', as: 'idea', constraints: false });

// User-Idea (Users can have many ideas).
User.hasMany(Idea, { foreignKey: 'user_id', as: 'ideas' });
Idea.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Many-to-many relationship for users favoriting ideas.
User.belongsToMany(Idea, { through: 'UserActions', as: 'favoritedIdeas', foreignKey: 'favorited_by', otherKey: 'entity_id', constraints: false });
Idea.belongsToMany(User, { through: 'UserActions', as: 'favoritedByUsers', foreignKey: 'entity_id', otherKey: 'favorited_by', constraints: false });

// Users commenting on ideas.
User.hasMany(UserActions, { foreignKey: 'user_id', as: 'commentsOnIdeas', scope: { action_type: 'comment', entity_type: 'idea' } });
UserActions.belongsTo(User, { foreignKey: 'user_id', as: 'commenter' });

// Ideas having many comments.
Idea.hasMany(UserActions, { foreignKey: 'entity_id', scope: { action_type: 'comment', entity_type: 'idea' }, as: 'ideaComments' });
UserActions.belongsTo(Idea, { foreignKey: 'entity_id', as: 'commentedIdea', constraints: false });

Idea.hasMany(UserActions, { foreignKey: 'entity_id', scope: { entity_type: 'idea' }, as: 'ideaactions' }); //getIdeaByUserId

// Associations
User.hasMany(Idea, { foreignKey: 'user_id' });
Idea.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Like, { foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });

Idea.hasMany(Favorite, { foreignKey: 'idea_id' });
Favorite.belongsTo(Idea, { foreignKey: 'idea_id' });

User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

Idea.hasMany(Share, { foreignKey: 'idea_id' });
Share.belongsTo(Idea, { foreignKey: 'idea_id' });

User.hasMany(Share, { foreignKey: 'user_id' });
Share.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserActions, { foreignKey: 'user_id' });
UserActions.belongsTo(User, { foreignKey: 'user_id' });

Idea.hasMany(UserActions, { foreignKey: 'entity_id' });
UserActions.belongsTo(Idea, { foreignKey: 'entity_id' });



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
  Idea,
  UserActions,
  Idea,
  Like,
  Favorite,
  Share,
  UserConnection,
};
