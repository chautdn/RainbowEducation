const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String /*required: [true, 'Please tell us your name!'] */ },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email!"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: false,
    },
    createOn: { type: Date, default: new Date().getTime() },
    cmnd: { type: String, require: true },
    updatedAt: { type: Date, default: new Date().getTime() },
    role: {
      type: String,
      enum: ["PARENTS", "ADMIN", "STAFF"],
      default: "PARENTS",
    },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    
    // Payment and subscription fields
    subscription: {
      type: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free'
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: false
      }
    },
    purchasedCourses: [{
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  purchasedAt: {
    type: Date,
    default: Date.now
  },
  amount: Number,
  orderCode: String
}],

    
    
    // Lessons access tracking
    accessibleLessons: [{
      lessonType: {
        type: String,
        enum: ['vietnamese', 'math', 'animal'],
        required: true
      },
      lessonId: {
        type: String,
        required: true
      },
      isPaid: {
        type: Boolean,
        default: false
      },
      paymentDate: Date,
      expiresAt: Date
    }],
    
    // Free trial lessons (everyone gets these)
    freeTrialUsed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
  { versionKey: false }
);

// Hashing mật khẩu trước khi lưu
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if user has access to a lesson
UserSchema.methods.hasAccessToLesson = function(lessonType, lessonId) {
  // Free lessons that everyone can access
  const freeLessons = {
    'vietnamese': ['1', '2'], // Vietnamese lessons 1,2 are free
    'math': ['4', '5'], // Math lessons 4,5 are free  
    'animal': [] // No free animal lessons - only lesson 1 requires payment
  };
  
  // Check if lesson is free
  if (freeLessons[lessonType] && freeLessons[lessonType].includes(lessonId)) {
    return true;
  }
  
  // Check if user has premium subscription
  if (this.subscription.type === 'premium' && this.subscription.isActive && 
      this.subscription.endDate > new Date()) {
    return true;
  }
  
  // Check if user has paid for specific lesson
  const lessonAccess = this.accessibleLessons.find(
    lesson => lesson.lessonType === lessonType && 
              lesson.lessonId === lessonId && 
              lesson.isPaid &&
              (!lesson.expiresAt || lesson.expiresAt > new Date())
  );
  
  return !!lessonAccess;
};

// Method to grant access to a lesson
UserSchema.methods.grantLessonAccess = function(lessonType, lessonId, duration = null) {
  const existingAccess = this.accessibleLessons.find(
    lesson => lesson.lessonType === lessonType && lesson.lessonId === lessonId
  );
  
  if (existingAccess) {
    existingAccess.isPaid = true;
    existingAccess.paymentDate = new Date();
    if (duration) {
      existingAccess.expiresAt = new Date(Date.now() + duration);
    }
  } else {
    const newAccess = {
      lessonType,
      lessonId,
      isPaid: true,
      paymentDate: new Date()
    };
    if (duration) {
      newAccess.expiresAt = new Date(Date.now() + duration);
    }
    this.accessibleLessons.push(newAccess);
  }
};

// Index hóa email để tìm kiếm nhanh hơn
UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
