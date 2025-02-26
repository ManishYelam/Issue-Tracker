const { Message, Room, MessageReaction, Notification, MediaStorage, BlockedUser, RoomMembers, UserSettings } = require('../../Api/Models/Chat/ChatAssociations');
const { joinRoom, createRoom, getRooms, getRoomByID, updateRoom, deleteRoom, leaveRoom, removeUserFromRoom, updateUserRole, getRoomMembers, sendMessage, updateMessage, getMessagesByRoom } = require('./RoomService');

const chatService = (socket, io) => {
  console.log(`Chat service connected: ${socket.id}`);

  const socketHandlers = (socket) => {
    socket.on('joinRoom', async (roomId) => {
      try {
        const room = await joinRoom(socket.user.id, roomId);
        socket.emit('roomJoined', { message: 'Joined room successfully', roomId: room.id });
        socket.to(roomId).emit('userJoined', { userId: socket.user.id, roomId });
      } catch (error) {
        console.error('Error joining room:', error.message);
        socket.emit('error', error.message || 'Error joining room');
      }
    });

    socket.on('createRoom', async (roomData) => {
      try {
        const room = await createRoom(roomData, socket.user.id);
        socket.emit('roomCreated', { message: 'Room created successfully', roomId: room.id });
      } catch (error) {
        console.error('Error creating room:', error.message);
        socket.emit('error', error.message || 'Error creating room');
      }
    });

    socket.on('getRooms', async ({ page, limit, filters }) => {
      try {
        const rooms = await getRooms(page, limit, filters);
        socket.emit('roomsList', rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error.message);
        socket.emit('error', error.message || 'Error fetching rooms');
      }
    });

    socket.on('getRoomById', async (roomId) => {
      try {
        const room = await getRoomByID(roomId);
        socket.emit('roomDetails', room);
      } catch (error) {
        console.error('Error fetching room:', error.message);
        socket.emit('error', error.message || 'Error fetching room');
      }
    });

    socket.on('updateRoom', async ({ roomId, updateData }) => {
      try {
        const result = await updateRoom(roomId, updateData, socket.user.id);
        socket.emit('roomUpdated', result);
      } catch (error) {
        console.error('Error updating room:', error.message);
        socket.emit('error', error.message || 'Error updating room');
      }
    });

    socket.on('deleteRoom', async (roomId) => {
      try {
        const result = await deleteRoom(roomId, socket.user.id);
        socket.emit('roomDeleted', result);
      } catch (error) {
        console.error('Error deleting room:', error.message);
        socket.emit('error', error.message || 'Error deleting room');
      }
    });

    socket.on('leaveRoom', async (roomId) => {
      try {
        const result = await leaveRoom(socket.user.id, roomId);
        socket.emit('roomLeft', result);
        socket.to(roomId).emit('userLeft', { userId: socket.user.id, roomId });
      } catch (error) {
        console.error('Error leaving room:', error.message);
        socket.emit('error', error.message || 'Error leaving room');
      }
    });

    socket.on('removeUserFromRoom', async ({ requesterId, roomId, userId }) => {
      try {
        const result = await removeUserFromRoom(requesterId, roomId, userId);
        socket.emit('userRemoved', result);
        socket.to(roomId).emit('userRemoved', { userId });
      } catch (error) {
        console.error('Error removing user:', error.message);
        socket.emit('error', error.message || 'Error removing user');
      }
    });

    socket.on('updateUserRole', async ({ requesterId, roomId, userId, newRole }) => {
      try {
        const result = await updateUserRole(requesterId, roomId, userId, newRole);
        socket.emit('roleUpdated', result);
      } catch (error) {
        console.error('Error updating role:', error.message);
        socket.emit('error', error.message || 'Error updating role');
      }
    });

    socket.on('getRoomMembers', async (roomId) => {
      try {
        const members = await getRoomMembers(roomId);
        socket.emit('roomMembers', members);
      } catch (error) {
        console.error('Error fetching members:', error.message);
        socket.emit('error', error.message || 'Error fetching members');
      }
    });

    socket.on('sendMessage', async ({ data }) => {
      try {
        const message = await sendMessage(data)
        socket.emit('messageSent', { message: 'Message sent successfully', message });
        socket.to(data.roomId).emit('newMessage', { message });
      } catch (error) {
        console.error('Error sending message:', error.message);
        socket.emit('error', error.message || 'Error sending message');
      }
    });

    socket.on('getMessagesByRoom', async ({ roomId, startMessageId, endMessageId }) => {
      try {
        const message = await getMessagesByRoom(roomId, startMessageId, endMessageId)
        socket.emit('messageGet', { message: 'Message get successfully', message });
        socket.to(roomId).emit('newMessage', { message });
      } catch (error) {
        console.error('Error getting message:', error.message);
        socket.emit('error', error.message || 'Error getting message');
      }
    });

    socket.on('updateMessage', async ({ data }) => {
      try {
        const message = await updateMessage(data)
        socket.emit('messageUpdate', { message: 'Message update successfully', message });
        socket.to(data.roomId).emit('newMessage', { message });
      } catch (error) {
        console.error('Error updating message:', error.message);
        socket.emit('error', error.message || 'Error updating message');
      }
    });



  };

  socketHandlers(socket);
};

module.exports = { chatService };
