const StudentInfo = require('../models/studentModel');

// Add student information
const addStudentInfo = async (req, res) => {
  const { studentId, email, contact } = req.body;

  try {
    const existingStudent = await StudentInfo.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student info already exists for this email.' });
    }

    const newStudentInfo = new StudentInfo({ studentId, email, contact });
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

module.exports = {
  addStudentInfo,
  getStudentInfoByEmail,
  getStudentInfoByStudentId,
  updateContactInfoByEmail, // Add the new function
};