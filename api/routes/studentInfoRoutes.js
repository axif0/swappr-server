const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const verifyToken = require('../middleware/verifyToken');

// Get student information by email
router.get('/:email', studentController.getStudentInfoByEmail);

// Add student information
router.post('/addStudentInfo', studentController.addStudentInfo);
 
router.get('/student/:studentId', studentController.getStudentInfoByStudentId);

router.put('/updateContact/:email', studentController.updateContactInfoByEmail);

router.post('/addSwapRequests/:email', studentController.addSwapRequestsToStudent);

router.get('/pinnedCourses/:email', verifyToken, studentController.getPinnedCourses);

router.delete('/pinnedCourses/delete/:email/:id', verifyToken, studentController.deletePinnedCourse);

module.exports = router;
