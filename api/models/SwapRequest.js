const mongoose = require('mongoose');
const { Schema } = mongoose;
const { formatDistanceToNow } = require('date-fns');

const swapRequestSchema = new Schema({
  user: {
    type: String, // Assuming you want to use Gmail addresses as user identifiers
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  dealerCourse: {
    type: String,
    required: true,
  },
  dealerSection: {
    type: String,
    required: true,
  },
  interestedCourse: [{
    type: String,
    required: true,
  }],
  interestedSections: [{  // Change to an array to support multiple sections
    type: String,
    required: true,
  }],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  reward: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

swapRequestSchema.virtual('timeAgo').get(function () {
  return formatDistanceToNow(this.createdAt, { addSuffix: true });
});

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

module.exports = SwapRequest;
