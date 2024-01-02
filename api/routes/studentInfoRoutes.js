const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');


// Get student information by email
router.get('/:email', studentController.getStudentInfoByEmail);

// Add student information
router.post('/addStudentInfo', studentController.addStudentInfo);
 
router.get('/student/:studentId', studentController.getStudentInfoByStudentId);

router.put('/updateContact/:email', studentController.updateContactInfoByEmail);

module.exports = router;
