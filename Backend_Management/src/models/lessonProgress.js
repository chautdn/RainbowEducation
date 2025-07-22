const mongoose = require('mongoose');

const LessonProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonType: {
    type: String,
    enum: ['vietnamese', 'math', 'animal'],
    required: true
  },
  lessonId: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0 // seconds
  },
  progress: {
    type: Number,
    default: 0 // percent (0-100)
  },
  notes: {
    type: String,
    default: ''
  },
  attempts: {
    type: Number,
    default: 0
  },
  lastVisited: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Additional fields for detailed tracking
  completedLetters: [{
    type: String
  }],
  currentLetter: {
    type: String
  },
  currentGroup: {
    type: Number,
    default: 0
  },
  lastStudiedAt: {
    type: Date
  },
  lessonStartTime: {
    type: Date
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  bestScore: {
    type: Number,
    default: 0
  },
  averageTimePerQuestion: {
    type: Number,
    default: 0 // seconds
  }
}, { timestamps: true });

LessonProgressSchema.index({ user: 1, lessonType: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('LessonProgress', LessonProgressSchema); 