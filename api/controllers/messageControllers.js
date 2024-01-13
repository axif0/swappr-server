const Message = require('../models/messageModel');

// Controller function to send a message
const sendMessage = async (req, res) => {
  const { swapRequestId } = req.params;
  const { currentUseremail, text } = req.body;

  try {
    // Find the message document for the given swap request ID
    let message = await Message.findOne({ swapRequestId });

    // If the message document doesn't exist, create a new one
    if (!message) {
      message = new Message({ swapRequestId, messages: [] });
    }

    // Add the new message to the messages array
    message.messages.push({ currentUseremail, text });
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get messages for a specific swap request
const getMessages = async (req, res) => {
  const { swapRequestId } = req.params;

  try {
    // Find the message document for the given swap request ID
    const message = await Message.findOne({ swapRequestId });

    // If the message document doesn't exist, return an empty array
    if (!message) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json(message.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to view all messages for all swap requests
const getAllMessages = async (req, res) => {
    try {
      // Find all message documents
      const messages = await Message.find();
  
      // If there are no messages, return an empty array
      if (!messages) {
        return res.status(200).json({ messages: [] });
      }
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Controller function to delete messages for a specific swap request
const deleteMessages = async (req, res) => {
  const { swapRequestId } = req.params;

  try {
    // Find and delete the message document for the given swap request ID
    const deletedMessage = await Message.findOneAndDelete({ swapRequestId });

    // If the message document doesn't exist, return an error
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found for the specified swapRequestId.' });
    }

    res.status(200).json({ message: 'Messages deleted successfully.', deletedMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 

module.exports = { sendMessage, getMessages, getAllMessages, deleteMessages };