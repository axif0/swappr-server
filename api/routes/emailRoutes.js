const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Route to send an email
router.post('/send', emailController.sendEmail);

module.exports = router;
