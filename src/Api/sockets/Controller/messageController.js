const { Message, Room, MediaStorage, Notification } = require('../../Api/Models/Chat/ChatAssociations');

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, content, media } = req.body;
    let mediaStorageId = null;

    if (media) {
      const savedMedia = await MediaStorage.create({ filePath: media.filePath, fileType: media.fileType });
      mediaStorageId = savedMedia.id;
    }

    const message = await Message.create({ roomId, senderId: req.user.id, content, mediaStorageId });
    await Notification.create({ userId: req.user.id, message: `New message in room: ${roomId}`, type: 'NEW_MESSAGE' });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    // const messages = await Message.findAll({ where: { roomId: req.params.roomId } });
    res.status(200).json({ success: true, hii: 'messages' });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};
