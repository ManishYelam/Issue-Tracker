const express = require('express');
const moment = require('moment');
const authMiddleware = require('./Middleware/authMiddleware');
const { io, server } = require('../Config/Setting/socket.config');
const { chatService } = require('./Service/ChatService');
const { statService } = require('./Service/StatService');
const { notificationService } = require('./Service/NotificationService');

const app = express();
app.use(express.json());
io.use(authMiddleware);

io.on('connection', (socket) => {
  const onlineUsers = {}; 
  console.log(onlineUsers);

  socket.on('user_connected', () => {
    const user = socket.user;
    if (!user) {
        console.log('User authentication failed.');
        return;
    }
    if (!onlineUsers[user.id]) {
        onlineUsers[user.id] = {
            socketId: socket.id,
            username: user.username,
            lastActive: new Date(),
        };
        socket.broadcast.emit('user_status_change', {
            userId: user.id,
            username: user.username,
            status: 'online',
        });
        console.log(onlineUsers);
        console.log(`User ${user.username} (${user.id}) is online.`);
    } else {
        console.log(`User ${user.username} (${user.id}) is already online.`);
    }
});

  notificationService(socket, io, onlineUsers)
  chatService(socket, io, onlineUsers);
  statService(socket, io, onlineUsers);

  socket.on('disconnect', () => {
    for (const [userId, userInfo] of Object.entries(onlineUsers)) {
      if (userInfo.socketId === socket.id) {
        console.log(`User ${userInfo.username} (${userId}) disconnected.`);
        socket.broadcast.emit('user_status_change', {
          userId,
          username: userInfo.username,
          status: 'offline',
        });
        delete onlineUsers[userId];
        break;
      }
    }
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`✅ WebSocket and HTTP server running on port ${PORT} - ${moment().format('llll')}`);
});
