const roomService = require('../Service/RoomService');

module.exports = {
  createRoom: async (req, res) => {
    try {
      const room = await roomService.createRoom(req.body, req.user.id);
      res.status(201).json(room);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  getRooms: async (req, res) => {
    const { page, limit, ...filters } = req.query;
    try {
      const rooms = await roomService.getRooms(page, limit, filters);
      res.status(200).json(rooms);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  getRoomByID: async (req, res) => {
    try {
      const room = await roomService.getRoomByID(req.params.id);
      res.status(200).json(room);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  joinRoom: async (req, res) => {
    try {
      const response = await roomService.joinRoom(req.user.id, req.params.roomId);
      res.status(200).json(response);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  updateRoom: async (req, res) => {
    try {
      const response = await roomService.updateRoom(req.params.roomId, req.body, req.user.id);
      res.status(200).json(response);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  deleteRoom: async (req, res) => {
    try {
      const response = await roomService.deleteRoom(req.params.roomId, req.user.id);
      res.status(200).json(response);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  leaveRoom: async (req, res) => {
    try {
      const response = await roomService.leaveRoom(req.user.id, req.params.roomId);
      res.status(200).json(response);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  removeUserFromRoom: async (req, res) => {
    try {
      const response = await roomService.removeUserFromRoom(req.user.id, req.params.roomId, req.params.userId);
      res.status(200).json(response);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  updateUserRole: async (req, res) => {
    try {
      const response = await roomService.updateUserRole(req.user.id, req.params.roomId, req.params.userId, req.body.newRole);
      res.status(200).json(response);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  getRoomMembers: async (req, res) => {
    try {
      const members = await roomService.getRoomMembers(req.params.roomId);
      res.status(200).json(members);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

  getMessagesByRoom: async (req, res) => {
    const { roomId, startMessageId, endMessageId } = req.query;
    try {
      const [roomIdInt, startMessageIdInt, endMessageIdInt] = [
        parseInt(roomId),
        parseInt(startMessageId),
        parseInt(endMessageId),
      ];
      const messages = await roomService.getMessagesByRoom(roomIdInt, startMessageIdInt, endMessageIdInt);
      return res.status(200).json({ messages });
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  },

};
