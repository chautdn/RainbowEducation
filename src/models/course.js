const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Pre-K', 'K', '1', '2', '3', '4', '5']
  },
  duration: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['reading', 'writing'],
    default: 'reading'
  },
  lessonId: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
courseSchema.index({ type: 1, level: 1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
