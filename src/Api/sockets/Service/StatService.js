const issueStats = require('../../Models/issueStats');  

const statService = (socket, io) => {
  console.log(`Stats service connected: ${socket.id}`);

  const interval = setInterval(async () => {
    try {
      const updatedStats = await issueStats.findAll({ where: { user_id: socket.user.id } });    
      socket.emit('statsData', updatedStats);
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
