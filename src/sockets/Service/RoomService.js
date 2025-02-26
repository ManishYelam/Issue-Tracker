const { Op } = require('sequelize');
const { Room, RoomMembers, User, Message, MessageReaction } = require('../../Api/Models/Chat/ChatAssociations');
const { sequelize } = require('../../Config/Database/db.config');
const Role = require('../../Api/Models/Role');
const Permission = require('../../Api/Models/Permission');
const { getMessagesByRoom } = require('../Controller/roomController');

module.exports = {
  createRoom: async (roomData, userId) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      const [room, created] = await Room.findOrCreate({
        where: {
          name: roomData.name,
          createdBy: userId
        },
        defaults: {
          ...roomData,
          createdBy: userId
        },
        transaction
      });

      if (!created) {
        throw new Error('You already have a room with this name.');
      }

      await RoomMembers.create(
        { userId: userId, roomId: room.id, role: 'owner' },
        { transaction }
      );

      await transaction.commit();
      return room;
    } catch (error) {
      await transaction.rollback();
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  },

  getRooms: async (page = 1, limit = 10, filters = {}) => {
    try {
      const offset = (page - 1) * limit;
      const whereConditions = [];

      if (filters.visibility) {
        whereConditions.push({ visibility: filters.visibility });
      }

      if (filters.search) {
        whereConditions.push({
          [Op.or]: [
            { name: { [Op.like]: `%${filters.search}%` } },
            { description: { [Op.like]: `%${filters.search}%` } }
          ]
        });
      }

      return await Room.findAndCountAll({
        where: whereConditions.length ? { [Op.and]: whereConditions } : {},
        include: [{
          model: RoomMembers,
          attributes: ['role'],
          include: [{
            model: User,
            attributes: ['id', 'username']
          }]
        }],
        limit: parseInt(limit),
        offset: offset,
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  },

  getRoomByID: async (id) => {
    try {
      const room = await Room.findByPk(id, {
        include: [{
          model: RoomMembers,
          include: [{
            model: User,
            attributes: ['id', 'username']
          }]
        }]
      });

      if (!room) {
        const error = new Error('Room not found');
        error.statusCode = 404;
        throw error;
      }
      return room;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  },

  joinRoom: async (userId, roomId) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      const room = await Room.findByPk(roomId, { transaction });
      if (!room) {
        throw new Error('Room not found');
      }

      if (room.visibility === 'private') {
        throw new Error('Cannot join private room without invitation');
      }

      const [member, created] = await RoomMembers.findOrCreate({
        where: { userId, roomId },
        defaults: { role: 'member' },
        transaction
      });

      if (!created) {
        throw new Error('User is already in the room');
      }

      await transaction.commit();
      return { message: 'Joined room successfully', room: room };
    } catch (error) {
      await transaction.rollback();
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  },

  updateRoom: async (roomId, updateData, userId) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      const room = await Room.findByPk(roomId, { transaction });
      if (!room) {
        throw new Error('Room not found');
      }
      if (room.createdBy !== userId) {
        throw new Error('Unauthorized: You are not the room owner');
      }

      Object.assign(room, updateData);
      await room.save({ transaction });
      await transaction.commit();
      return { message: 'Room updated successfully', updatedRoom: room };
    } catch (error) {
      await transaction.rollback();
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  },

  deleteRoom: async (roomId, userId) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      const room = await Room.findByPk(roomId, { transaction });
      if (!room) {
        throw new Error('Room not found');
      }
      if (room.createdBy !== userId) {
        throw new Error('Unauthorized: You are not the room owner');
      }

      await Room.destroy({
        where: { id: roomId },
        transaction
      });
      await transaction.commit();
      return { message: 'Room deleted successfully', room: room };
    } catch (error) {
      await transaction.rollback();
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  },

  leaveRoom: async (userId, roomId) => {
    const transaction = await sequelize.MAIN_DB_NAME.transaction();
    try {
      const room = await Room.findByPk(roomId, { transaction });
      if (!room) {
        throw new Error('Room not found');
      }
      if (room.createdBy === userId) {
        throw new Error('Room owner cannot leave. Transfer ownership first.');
      }

      const result = await RoomMembers.destroy({
        where: { userId, roomId },
        transaction
      });
      if (!result) {
        throw new Error('User not in room');
      }

      await transaction.commit();
      return { message: 'Left room successfully', room: room };
    } catch (error) {
      await transaction.rollback();
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  },

  removeUserFromRoom: async (requesterId, roomId, userId) => {
    const transaction = await sequelize.transaction();
    try {
      const requesterMembership = await RoomMembers.findOne({
        where: { userId: requesterId, roomId },
        transaction
      });

      if (!requesterMembership || !['owner', 'admin'].includes(requesterMembership.role)) {
        throw new Error('Insufficient permissions');
      }

      const targetMembership = await RoomMembers.findOne({
        where: { userId, roomId },
        transaction
      });

      if (!targetMembership) {
        throw new Error('User not in room');
      }

      if (targetMembership.role === 'owner') {
        throw new Error('Cannot remove room owner');
      }

      if (requesterMembership.role === 'admin' && targetMembership.role === 'admin') {
        throw new Error('Admins cannot remove other admins');
      }

      await targetMembership.destroy({ transaction });
      await transaction.commit();
      return { message: 'User removed successfully' };
    } catch (error) {
      await transaction.rollback();
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  },

  updateUserRole: async (requesterId, roomId, userId, newRole) => {
    const transaction = await sequelize.transaction();
    try {
      const validRoles = ['admin', 'member'];
      if (!validRoles.includes(newRole)) {
        throw new Error('Invalid role');
      }

      const requesterMembership = await RoomMembers.findOne({
        where: { userId: requesterId, roomId },
        transaction
      });

      if (!requesterMembership || requesterMembership.role !== 'owner') {
        throw new Error('Only room owner can update roles');
      }

      const targetMembership = await RoomMembers.findOne({
        where: { userId, roomId },
        transaction
      });

      if (!targetMembership) {
        throw new Error('User not in room');
      }

      if (targetMembership.role === 'owner') {
        throw new Error('Cannot modify owner role');
      }

      targetMembership.role = newRole;
      await targetMembership.save({ transaction });
      await transaction.commit();
      return { message: 'Role updated successfully' };
    } catch (error) {
      await transaction.rollback();
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  },

  getRoomMembers: async (roomId) => {
    try {
      return await RoomMembers.findAll({
        where: { roomId },
        include: [{
          model: User,
          attributes: ['id', 'username', 'email']
        }],
        order: [
          ['role', 'DESC'],
          ['joinDate', 'ASC']
        ]
      });
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  },

  sendMessage: async (data) => {
    try {
      const message = await Message.create(data);
      return message;
    } catch (error) {
      throw new Error('Failed to send message');
    }
  },

  getMessagesByRoom: async (roomId, startMessageId, endMessageId) => {
    try {
      const messages = await Message.findAll({
        where: {
          roomId,
          id: { [Op.between]: [startMessageId, endMessageId] }
        },
        include: [{
          model: MessageReaction
        }],
        order: [['createdAt', 'ASC']],
        limit: endMessageId,
        offset: 0,
      });
      return messages;
    } catch (error) {
      throw new Error('Failed to fetch messages');
    }
  },

  updateMessage: async (messageId, userId) => {
    try {
      const message = await Message.findOne({ where: { id: messageId, senderId: userId } });
      if (!message) throw new Error('Message not found or unauthorized');

      message.isDeleted = true;
      message.deletedAt = new Date();
      await message.save();
      return message;
    } catch (error) {
      throw new Error('Failed to delete message');
    }
  },
};
// const user = await User.findByPk(1, {
//     attributes:[],
//     include: [
//     //   {
//     //     model: Role,
//     //     attributes: [],
//     //     include: [
//     //       {
//     //         model: Permission,
//     //         attributes: [],
//     //       },
//     //     ],
//     //   },
//       {
//         model: Room,
//         include: [
//           {
//             model: Message,
//             where: {
//               roomId: roomId, 
//               id: { [Op.between]: [startMessageId, endMessageId] },
//             },
//             order: [['createdAt', 'ASC']],
//             limit: 10,
//             offset: 0,
//             include: [
//               {
//                 model: MessageReaction,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   });