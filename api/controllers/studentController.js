const StudentInfo = require('../models/studentModel');
const mongoose = require('mongoose');
const SwapRequest = require('../models/SwapRequest');

// Add student information
const addStudentInfo = async (req, res) => {
  const { studentId, email, contact } = req.body;

  try {
    const existingStudent = await StudentInfo.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student info already exists for this email.' });
    }

    const newStudentInfo = new StudentInfo({ studentId, email, contact, swapRequests: [] });
    await newStudentInfo.save();
    res.status(201).json(newStudentInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get student information by email
const getStudentInfoByEmail = async (req, res) => {
  try {
    const studentInfo = await StudentInfo.findOne({ email: req.params.email });
    if (!studentInfo) {
      return res.status(404).json({ message: 'Student info not found for this email.' });
    }
    res.status(200).json(studentInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student information by student ID
const getStudentInfoByStudentId = async (req, res) => {
  try {
    const studentInfo = await StudentInfo.findOne({ studentId: req.params.studentId });
    if (!studentInfo) {
      return res.status(404).json({ message: 'Student info not found for this student ID.' });
    }
    res.status(200).json(studentInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 

const updateContactInfoByEmail = async (req, res) => {
  const { contact } = req.body;

  try {
    const updatedStudentInfo = await StudentInfo.findOneAndUpdate(
      { email: req.params.email },
      { contact },
      { new: true }
    );

    if (!updatedStudentInfo) {
      return res.status(404).json({ message: 'Student info not found for this email.' });
    }

    res.status(200).json(updatedStudentInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Controller function to add swapRequests to StudentInfo by email
const addSwapRequestsToStudent = async (req, res) => {
  const { email } = req.params;
  const { swapRequestIds } = req.body;

  try {
    // Find the student by email
    const student = await StudentInfo.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: 'Student not found for this email.' });
    }

    // Check for duplicate swap request IDs
    const duplicateSwapRequests = swapRequestIds.filter(id => student.swapRequests.includes(id));

    if (duplicateSwapRequests.length > 0) {
      return res.status(400).json({ message: 'Duplicate swap request IDs found.' });
    }

    // Add the swapRequestIds to the student's swapRequests array
    student.swapRequests = student.swapRequests.concat(swapRequestIds);

    // Save the updated student information
    await student.save();

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to fetch details of pinned courses based on swapRequest IDs
const fetchPinnedCourses = async (swapRequestIds) => {
  try {
      // Ensure that each element in swapRequestIds is a valid ObjectId
      const isValidObjectIds = swapRequestIds.every((id) => mongoose.Types.ObjectId.isValid(id));

      if (!isValidObjectIds) {
        throw new Error('Invalid ObjectId in swapRequestIds');
      }
   
      // Convert swapRequestIds to ObjectId instances
      const objectIdArray = swapRequestIds.map((id) => new mongoose.Types.ObjectId(id));
      console.log(objectIdArray)
      // Fetch details of pinned courses from the SwapRequest model
      const pinnedCourses = await SwapRequest.find({ _id: { $in: objectIdArray } });
      console.log(pinnedCourses)
      return pinnedCourses;

  } catch (error) {
    throw new Error(`Error fetching pinned courses: ${error.message}`);
  }
};

// Controller function to get pinned courses for the current user
const getPinnedCourses = async (req, res) => {
  const { email } = req.params;

  try {
    // Find the student by email
    const student = await StudentInfo.findOne({ email });
    // console.log(student)
    if (!student) {
      return res.status(404).json({ message: 'Student not found for this email.' });
    }

    // Fetch details of pinned courses using the swapRequests array
    const pinnedCourses = await fetchPinnedCourses(student.swapRequests);
   
    res.status(200).json({ pinnedCourses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const deletePinnedCourse = async (req, res) => {
  const { email, id } = req.params; // Change 'requestId' to 'id'

  try {
    // Find the student by email
    const student = await StudentInfo.findOne({ email });
    console.log(student);
    if (!student) {
      return res.status(404).json({ message: 'Student not found for this email.' });
    }

    // Ensure that swapRequests is an array before using findIndex
    if (!Array.isArray(student.swapRequests)) {
      // Handle the case where swapRequests is not an array
      return res.status(500).json({ message: 'swapRequests is not an array.' });
    }

    // Check if the requestId exists in the swapRequests array
    const indexToRemove = student.swapRequests.findIndex((idInArray) => idInArray.toString() === id);

    console.log('Index to remove:', indexToRemove);

    if (indexToRemove === -1) {
      console.log('Request ID not found:', id);
      return res.status(404).json({ message: 'Pinned course not found for this ID in swapRequests array.' });
    }

    // Use $pull to remove the specific element from the array
    student.swapRequests.pull(student.swapRequests[indexToRemove]);

    // Save the updated student information
    await student.save();

    res.status(200).json({ message: 'Pinned course successfully removed from the swapRequests array.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  addStudentInfo,
  getStudentInfoByEmail,
  getStudentInfoByStudentId,
  updateContactInfoByEmail,
  addSwapRequestsToStudent,
  getPinnedCourses,
  fetchPinnedCourses,
  deletePinnedCourse
};
