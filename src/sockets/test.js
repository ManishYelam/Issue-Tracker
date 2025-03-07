// const { Message } = require('./models/Message'); // Adjust the path based on your project structure

const Message = require('../Api/Models/Chat/Message');

const bulkInsertMessages = async messages => {
  try {
    // Insert the array of messages into the database
    const result = await Message.bulkCreate(messages, {
      validate: true, // This will validate each entry before inserting
      returning: true, // If you want the inserted records back
    });
    console.log('Bulk Insert Successful:', result);
  } catch (error) {
    console.error('Error in Bulk Insert:', error);
  }
};

// Sample array of messages to insert
const messages = [
  {
    roomId: 15,
    senderId: 1,
    messageType: 'text',
    content: 'Hello, how are you?',
    mediaUrl: null,
    thumbnailUrl: null,
    fileSize: null,
    isRead: false,
    status: 'sent',
    priority: 'normal',
    pinned: false,
  },
  {
    roomId: 15,
    senderId: 1,
    messageType: 'image',
    content: 'Check this out!',
    mediaUrl: 'https://example.com/image.jpg',
    thumbnailUrl: null,
    fileSize: 1024,
    isRead: false,
    status: 'delivered',
    priority: 'normal',
    pinned: false,
  },
  {
    roomId: 15,
    senderId: 1,
    messageType: 'video',
    content: 'This is a video message.',
    mediaUrl: 'https://example.com/video.mp4',
    thumbnailUrl: 'https://example.com/video-thumbnail.jpg',
    fileSize: 2048,
    isRead: false,
    status: 'sent',
    priority: 'urgent',
    pinned: true,
  },
];

// Call the function to bulk insert messages
bulkInsertMessages(messages);
