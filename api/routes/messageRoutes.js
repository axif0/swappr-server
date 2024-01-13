const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageControllers');

const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, messageController.getAllMessages);

// Route to send a message
router.post('/:swapRequestId', verifyToken, messageController.sendMessage);

// Route to get messages for a specific swap request
router.get('/:swapRequestId', verifyToken, messageController.getMessages);
router.delete('/:swapRequestId', verifyToken, messageController.deleteMessages);


module.exports = router;
