const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'ME', 'CE', 'BT', 'CHE', 'CH', 'EE', 'EP', 'ICDT', 'Other'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const calculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    trim: true,
  },
  userBranch: {
    type: String,
    trim: true,
  },
  courseData: {
    ma101: mongoose.Schema.Types.Mixed,
    ph101: mongoose.Schema.Types.Mixed,
    ph102: mongoose.Schema.Types.Mixed,
    ge102: mongoose.Schema.Types.Mixed,
    ge104: mongoose.Schema.Types.Mixed,
    humanities: mongoose.Schema.Types.Mixed,
    nso: mongoose.Schema.Types.Mixed,
    hs101: mongoose.Schema.Types.Mixed,
  },
  result: {
    cgpa: Number,
    totalCredits: Number,
    totalGradePoints: Number,
    courses: mongoose.Schema.Types.Mixed,
  },
  calculatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
const Calculation = mongoose.model('Calculation', calculationSchema);

module.exports = { User, Calculation };
