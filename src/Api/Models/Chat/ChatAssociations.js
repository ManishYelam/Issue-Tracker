const User = require('../User');
const BlockedUser = require('./BlockedUser');
const MediaStorage = require('./MediaStorage');
const Message = require('./Message');
const MessageReaction = require('./MessageReaction');
const Notification = require('./Notification');
const Room = require('./Room');
const RoomMembers = require('./RoomMembers');
const UserSettings = require('./UserSettings');

User.hasMany(Message, { foreignKey: 'senderId' });
User.belongsToMany(Room, { through: RoomMembers });
User.hasMany(Notification, { foreignKey: 'userId' });
User.hasMany(MessageReaction, { foreignKey: 'userId' });
User.belongsToMany(User, {
  as: 'BlockedUsers',
  through: BlockedUser,
  foreignKey: 'userId',
});
User.hasMany(MediaStorage, { foreignKey: 'userId' });
User.hasMany(UserSettings, { foreignKey: 'userId' });
User.belongsToMany(MediaStorage, {
  as: 'BlockedMedia',
  through: BlockedUser,
  foreignKey: 'userId',
  otherKey: 'mediaId',
});

// Room associations
Room.hasMany(Message, { foreignKey: 'roomId' });
Room.belongsToMany(User, { through: RoomMembers, foreignKey: 'roomId' });
Room.belongsToMany(MediaStorage, {
  through: 'RoomMessages',
  foreignKey: 'roomId',
});
Room.belongsToMany(User, {
  through: RoomMembers,
  foreignKey: 'roomId',
  as: 'roomUsers', // Ensure a unique alias for this association
});

User.belongsToMany(Room, {
  through: RoomMembers,
  foreignKey: 'userId',
  as: 'userRooms', // Ensure a unique alias for this association
});

Room.hasMany(RoomMembers, { foreignKey: 'roomId' });

RoomMembers.belongsTo(User, { foreignKey: 'userId', as: 'roomMemberUser' });
RoomMembers.belongsTo(Room, { foreignKey: 'roomId', as: 'roomMemberRoom' });

// RoomMembers associations
RoomMembers.belongsTo(User, { foreignKey: 'userId' });
RoomMembers.belongsTo(Room, { foreignKey: 'roomId' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId' });
Notification.belongsTo(MediaStorage, { foreignKey: 'mediaId' });

// Message associations
Message.belongsTo(User, { foreignKey: 'senderId' });
Message.belongsTo(Room, { foreignKey: 'roomId' });
Message.hasMany(MediaStorage, { foreignKey: 'messageId' });

// MessageReaction associations
MessageReaction.belongsTo(User, { foreignKey: 'userId' });
MessageReaction.belongsTo(Message, { foreignKey: 'messageId' });
MessageReaction.belongsTo(MediaStorage, { foreignKey: 'mediaId' });

Message.hasMany(MessageReaction, { foreignKey: 'messageId' });
MessageReaction.belongsTo(Message, { foreignKey: 'messageId' });

// BlockedUser associations
BlockedUser.belongsTo(User, { foreignKey: 'userId' });
BlockedUser.belongsTo(User, { foreignKey: 'blockedUserId' });

// UserSettings associations
UserSettings.belongsTo(User, { foreignKey: 'userId' });
UserSettings.hasMany(MediaStorage, { foreignKey: 'userId' });

// MediaStorage associations
MediaStorage.belongsTo(Message, { foreignKey: 'messageId' });
MediaStorage.belongsTo(User, { foreignKey: 'userId' });
MediaStorage.belongsToMany(Room, {
  through: 'RoomMessages',
  foreignKey: 'mediaId',
});

module.exports = {
  User,
  BlockedUser,
  MediaStorage,
  Message,
  MessageReaction,
  Notification,
  Room,
  RoomMembers,
  UserSettings,
};
