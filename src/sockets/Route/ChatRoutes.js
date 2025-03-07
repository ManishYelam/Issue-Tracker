const express = require('express');
const messageRouter = express.Router();
const notificationRouter = express.Router();
const roomRouter = express.Router();
const userRouter = express.Router();
const messageController = require('../Controller/messageController');
const notificationController = require('../Controller/notificationController.js');
const roomController = require('../Controller/roomController.js');

messageRouter
  // .post('/send', messageController.sendMessage)
  .get('/', roomController.getMessagesByRoom);
// .delete('/:messageId', messageController.deleteMessage)

notificationRouter.get('/', notificationController.getNotifications).delete('/', notificationController.deleteNotification);

roomRouter
  .post('/', roomController.createRoom)
  .get('/', roomController.getRooms)
  .get('/:id', roomController.getRoomByID)
  .post('/:roomId/join', roomController.joinRoom)
  .put('/:roomId', roomController.updateRoom)
  .delete('/:roomId', roomController.deleteRoom)
  .post('/:roomId/leave', roomController.leaveRoom)
  .delete('/:roomId/users/:userId', roomController.removeUserFromRoom)
  .put('/:roomId/users/:userId/role', roomController.updateUserRole)
  .get('/:roomId/members', roomController.getRoomMembers);

// userRouter
//     .get('/:userId', userController.getUserProfile)
//     .put('/:userId', userController.updateUserProfile)
//     .delete('/:userId', userController.deleteUserProfile)

module.exports = {
  messageRouter,
  notificationRouter,
  roomRouter,
  userRouter,
};
