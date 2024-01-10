const mongoose = require('mongoose');

const studentInfoSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: String,
    required: true
  },
  swapRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SwapRequest'
    }
  ]
});

const StudentInfo = mongoose.model('StudentInfo', studentInfoSchema);

module.exports = StudentInfo;
