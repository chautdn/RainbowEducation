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
  category: {
    type: String,
    required: false // Optional field for additional categorization
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
  // Determines if this course requires purchase
  isPurchased: {
    type: Boolean,
    default: false
  },
  // Price for paid courses (in VND)
  price: {
    type: Number,
    default: 0
  },
  // Course content metadata
  videoUrl: {
    type: String,
    required: false
  },
  materials: [{
    name: String,
    url: String,
    type: String // 'video', 'audio', 'pdf', 'interactive'
  }],
  // Learning objectives
  objectives: [String],
  // Prerequisites
  prerequisites: [String],
  // Difficulty level
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
courseSchema.index({ type: 1, level: 1 });
courseSchema.index({ tag: 1, category: 1 });
courseSchema.index({ lessonId: 1 });
courseSchema.index({ isActive: 1 });

// Virtual for determining if course is free
courseSchema.virtual('isFree').get(function() {
  // Free courses: Vietnamese lessons 1,2 and Math lessons 4,5
  if (this.tag === 'vietnamese' && this.category !== 'animal' && ['1', '2'].includes(this.lessonId)) {
    return true;
  }
  if (this.tag === 'math' && ['4', '5'].includes(this.lessonId)) {
    return true;
  }
  return false;
});

// Virtual for determining payment requirement
courseSchema.virtual('requiresPayment').get(function() {
  // Only animal category courses require payment
  return this.category === 'animal' || this.isPurchased === true;
});

// Static method to get free courses
courseSchema.statics.getFreeCourses = function() {
  return this.find({
    $or: [
      { tag: 'vietnamese', category: { $ne: 'animal' }, lessonId: { $in: ['1', '2'] } },
      { tag: 'math', lessonId: { $in: ['4', '5'] } }
    ],
    isActive: true
  });
};

// Static method to get paid courses
courseSchema.statics.getPaidCourses = function() {
  return this.find({
    $or: [
      { category: 'animal' },
      { isPurchased: true }
    ],
    isActive: true
  });
};

// Static method to get courses by category
courseSchema.statics.getCoursesByCategory = function(category, level = null) {
  const query = { category, isActive: true };
  if (level) query.level = level;
  return this.find(query);
};

// Static method to get courses by tag
courseSchema.statics.getCoursesByTag = function(tag, level = null) {
  const query = { tag, isActive: true };
  if (level) query.level = level;
  return this.find(query);
};

// Instance method to check if user has access
courseSchema.methods.checkUserAccess = function(user) {
  // Free courses - everyone has access
  if (this.isFree) {
    return true;
  }
  
  // Paid courses - check if user purchased
  if (this.requiresPayment) {
    return user.purchasedCourses?.some(pc => 
      pc.courseId.toString() === this._id.toString()
    );
  }
  
  return false;
};

// Ensure virtual fields are included in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;