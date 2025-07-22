const mongoose = require("mongoose");

// TODO: PAYMENT TRANSACTION MODEL
// This model stores all payment transactions for audit and history tracking
const PaymentTransactionSchema = new mongoose.Schema(
  {
    // User information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Lesson information
    lessonType: {
      type: String,
      enum: ["vietnamese", "math", "animal"],
      required: true,
    },
    lessonId: {
      type: String,
      required: true,
    },

    // Payment information
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "VND",
    },
    paymentMethod: {
      type: String,
      enum: ["vnpay", "momo", "zalopay", "card", "banking", "stripe"],
      required: true,
    },

    // Transaction tracking
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    gatewayTransactionId: {
      type: String, // ID from payment gateway (VNPay, MoMo, etc.)
    },

    // Status tracking
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },

    // Gateway response data (for debugging)
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Additional metadata
    metadata: {
      ipAddress: String,
      userAgent: String,
      deviceInfo: String,
    },

    // Error information (if failed)
    errorCode: String,
    errorMessage: String,

    // Refund information
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: String,
    refundedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
PaymentTransactionSchema.index({ userId: 1 });
PaymentTransactionSchema.index({ transactionId: 1 });
PaymentTransactionSchema.index({ status: 1 });
PaymentTransactionSchema.index({ createdAt: -1 });
PaymentTransactionSchema.index({ lessonType: 1, lessonId: 1 });

// Static methods for common queries
PaymentTransactionSchema.statics.findByUser = function (userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

PaymentTransactionSchema.statics.findByLesson = function (
  lessonType,
  lessonId
) {
  return this.find({ lessonType, lessonId, status: "completed" });
};

PaymentTransactionSchema.statics.getSuccessfulPayments = function (userId) {
  return this.find({ userId, status: "completed" });
};

// Instance methods
PaymentTransactionSchema.methods.markAsCompleted = function (
  gatewayResponse = {}
) {
  this.status = "completed";
  this.completedAt = new Date();
  this.gatewayResponse = gatewayResponse;
  return this.save();
};

PaymentTransactionSchema.methods.markAsFailed = function (
  errorCode,
  errorMessage
) {
  this.status = "failed";
  this.errorCode = errorCode;
  this.errorMessage = errorMessage;
  return this.save();
};

PaymentTransactionSchema.methods.processRefund = function (amount, reason) {
  this.refundAmount = amount;
  this.refundReason = reason;
  this.refundedAt = new Date();
  if (amount >= this.amount) {
    this.status = "refunded";
  }
  return this.save();
};

module.exports = mongoose.model("PaymentTransaction", PaymentTransactionSchema);

/*
USAGE EXAMPLES:

// Create new transaction
const transaction = await PaymentTransaction.create({
  userId: user._id,
  lessonType: 'animal',
  lessonId: '1',
  amount: 75000,
  paymentMethod: 'vnpay',
  transactionId: 'TXN_123456789',
  metadata: {
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  }
});

// Mark as completed
await transaction.markAsCompleted({
  vnp_ResponseCode: '00',
  vnp_TransactionNo: '123456789'
});

// Get user payment history
const userPayments = await PaymentTransaction.findByUser(userId);

// Check if user has paid for lesson
const paidLessons = await PaymentTransaction.getSuccessfulPayments(userId);
const hasPaidForAnimal = paidLessons.some(payment => 
  payment.lessonType === 'animal' && payment.lessonId === '1'
);

*/
