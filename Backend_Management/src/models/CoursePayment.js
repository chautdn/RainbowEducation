const mongoose = require('mongoose');

const CoursePaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'VND'
  },
  orderCode: {
    type: Number,  // PayOS requires numeric orderCode
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'expired'],
    default: 'pending'
  },
  paymentLinkId: String,
  checkoutUrl: String,
  qrCode: String,
  payosResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  paidAt: Date,
  expiredAt: Date,
  
  // Remove the transactionId field that's causing the duplicate key error
  // Or make it optional and not unique
  transactionId: {
    type: String,
    required: false,
    sparse: true  // This allows multiple null values
  }
}, {
  timestamps: true
});

// Create indexes, but make transactionId sparse to allow nulls
CoursePaymentSchema.index({ userId: 1 });
CoursePaymentSchema.index({ orderCode: 1 }, { unique: true });
CoursePaymentSchema.index({ status: 1 });
CoursePaymentSchema.index({ transactionId: 1 }, { sparse: true }); // sparse allows multiple nulls

module.exports = mongoose.model('CoursePayment', CoursePaymentSchema);