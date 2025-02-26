const Stats = require('../../Api/Models/Stats');
const UserConnection = require('../../Api/Models/UserConnections');

const statService = (socket, io) => {
  console.log(`Stats service connected: ${socket.id}`);

  const interval = setInterval(async () => {
    try {
      // const updatedStats = await Stats.findAll({});
      // socket.emit('statsData', updatedStats);
      // const connections = await UserConnection.findAll({ where: { user_id: socket.user.id } });
      // socket.emit('UserConnection', connections);
    } catch (error) {
      console.error('Error fetching stats or connections:', error);
    }
  }, 5000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log(`Socket ${socket.id} disconnected from stats service`);
  });
};

module.exports = { statService };
