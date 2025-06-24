const User = require('../models/user');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// Check if user has access to a specific lesson
exports.checkLessonAccess = catchAsync(async (req, res, next) => {
  const { lessonType, lessonId } = req.params;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const hasAccess = user.hasAccessToLesson(lessonType, lessonId);
  
  res.status(200).json({
    status: 'success',
    data: {
      hasAccess,
      lessonType,
      lessonId,
      subscriptionType: user.subscription.type,
      subscriptionActive: user.subscription.isActive
    }
  });
});

// Get user's accessible lessons
exports.getUserLessons = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Define all available lessons with their payment status
  const allLessons = [
    { type: 'vietnamese', id: '1', title: 'Nhận biết chữ cái', price: 0 }, // Free
    { type: 'vietnamese', id: '2', title: 'Tập viết chữ thường', price: 0 }, // Free
    { type: 'math', id: '4', title: 'Học viết số', price: 0 }, // Free
    { type: 'math', id: '5', title: 'Học đọc số', price: 0 }, // Free
    { type: 'animal', id: '1', title: '10 Loại động vật quanh chúng ta', price: 75000 } // Only paid lesson
  ];

  const lessonsWithAccess = allLessons.map(lesson => ({
    ...lesson,
    hasAccess: user.hasAccessToLesson(lesson.type, lesson.id),
    isFree: lesson.price === 0
  }));

  res.status(200).json({
    status: 'success',
    data: {
      lessons: lessonsWithAccess,
      subscription: user.subscription,
      accessibleLessons: user.accessibleLessons
    }
  });
});

// Process lesson payment (simulate payment)
exports.purchaseLesson = catchAsync(async (req, res, next) => {
  const { lessonType, lessonId, paymentMethod } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if user already has access
  if (user.hasAccessToLesson(lessonType, lessonId)) {
    return next(new AppError('You already have access to this lesson', 400));
  }

  // Define lesson prices - only animal lesson 1 is paid
  const lessonPrices = {
    'animal': { '1': 75000 }
  };

  const price = lessonPrices[lessonType]?.[lessonId];
  if (price === undefined) {
    return next(new AppError('Lesson not found or not available for purchase', 404));
  }

  // TODO: REPLACE WITH REAL PAYMENT GATEWAY
  // Current: Simulation - Replace with actual payment processing
  const paymentSuccess = await simulatePayment(paymentMethod, price);
  
  if (!paymentSuccess) {
    return next(new AppError('Payment failed. Please try again.', 400));
  }
  
  /*
  // REAL IMPLEMENTATION EXAMPLE:
  try {
    let paymentResult;
    
    switch(paymentMethod) {
      case 'vnpay':
        paymentResult = await processVNPayPayment(price, lessonType, lessonId, req);
        break;
      case 'momo':
        paymentResult = await processMoMoPayment(price, lessonType, lessonId, req);
        break;
      case 'zalopay':
        paymentResult = await processZaloPayPayment(price, lessonType, lessonId, req);
        break;
      case 'card':
        paymentResult = await processCardPayment(req.body.cardDetails, price);
        break;
      default:
        return next(new AppError('Unsupported payment method', 400));
    }
    
    if (!paymentResult.success) {
      return next(new AppError(paymentResult.message || 'Payment failed', 400));
    }
    
    // Store payment transaction info
    const transaction = await PaymentTransaction.create({
      userId: user._id,
      lessonType,
      lessonId,
      amount: price,
      paymentMethod,
      transactionId: paymentResult.transactionId,
      status: 'completed'
    });
    
  } catch (paymentError) {
    console.error('Payment processing error:', paymentError);
    return next(new AppError('Payment processing failed', 500));
  }
  */

  // Grant access to lesson (30 days access)
  const accessDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  user.grantLessonAccess(lessonType, lessonId, accessDuration);
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Lesson purchased successfully',
    data: {
      lessonType,
      lessonId,
      price,
      expiresAt: new Date(Date.now() + accessDuration)
    }
  });
});

// Purchase premium subscription
exports.purchaseSubscription = catchAsync(async (req, res, next) => {
  const { subscriptionType, duration, paymentMethod } = req.body; // duration in months
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Define subscription prices (per month)
  const subscriptionPrices = {
    'basic': 100000,  // 100k VND per month
    'premium': 200000 // 200k VND per month
  };

  const monthlyPrice = subscriptionPrices[subscriptionType];
  if (!monthlyPrice) {
    return next(new AppError('Invalid subscription type', 400));
  }

  const totalPrice = monthlyPrice * duration;

  // Simulate payment processing
  const paymentSuccess = await simulatePayment(paymentMethod, totalPrice);
  
  if (!paymentSuccess) {
    return next(new AppError('Payment failed. Please try again.', 400));
  }

  // Update user subscription
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + duration);

  user.subscription = {
    type: subscriptionType,
    startDate,
    endDate,
    isActive: true
  };
  
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Subscription purchased successfully',
    data: {
      subscriptionType,
      duration,
      totalPrice,
      startDate,
      endDate
    }
  });
});

// Get user profile with payment info
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        accessibleLessons: user.accessibleLessons,
        freeTrialUsed: user.freeTrialUsed
      }
    }
  });
});

// TODO: PAYMENT GATEWAY INTEGRATION
// Replace this simulation with real payment gateway
async function simulatePayment(paymentMethod, amount) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate payment success/failure (90% success rate)
  return Math.random() > 0.1;
  
  /*
  // EXAMPLE: VNPay Integration
  if (paymentMethod === 'vnpay') {
    const vnpayResponse = await vnpayService.createPayment({
      amount: amount,
      orderInfo: `Payment for lesson ${lessonType}-${lessonId}`,
      returnUrl: process.env.VNPAY_RETURN_URL,
      ipAddr: req.ip
    });
    return vnpayResponse.paymentUrl;
  }
  
  // EXAMPLE: MoMo Integration  
  if (paymentMethod === 'momo') {
    const momoResponse = await momoService.createPayment({
      amount: amount,
      orderInfo: `Lesson payment`,
      redirectUrl: process.env.MOMO_REDIRECT_URL,
      ipnUrl: process.env.MOMO_IPN_URL
    });
    return momoResponse.payUrl;
  }
  
  // EXAMPLE: ZaloPay Integration
  if (paymentMethod === 'zalopay') {
    const zaloResponse = await zaloPayService.createOrder({
      amount: amount,
      description: `Payment for lesson`,
      callback_url: process.env.ZALOPAY_CALLBACK_URL
    });
    return zaloResponse.order_url;
  }
  */
}
