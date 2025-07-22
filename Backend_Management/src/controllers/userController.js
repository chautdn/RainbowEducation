const User = require('../models/user');
const Course = require('../models/course');
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

// Get user's accessible lessons with real course data
exports.getUserLessons = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get all active courses from database
  const allCourses = await Course.find({ isActive: true });

  // Map courses with access information
  const lessonsWithAccess = allCourses.map(course => {
    const lessonType = course.category === 'animal' ? 'animal' : course.tag;
    const hasAccess = user.hasAccessToLesson(lessonType, course.lessonId);
    const isFree = course.isFree; // Use virtual field from model
    
    return {
      type: lessonType,
      id: course.lessonId,
      _id: course._id,
      title: course.title,
      description: course.description,
      image: course.image,
      level: course.level,
      duration: course.duration,
      category: course.category,
      tag: course.tag,
      price: isFree ? 0 : (course.price || 75000),
      hasAccess: hasAccess,
      isFree: isFree,
      requiresPayment: course.requiresPayment
    };
  });

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

  // Find the course
  let course;
  if (lessonType === 'animal') {
    course = await Course.findOne({ category: 'animal', lessonId: lessonId });
  } else {
    course = await Course.findOne({ tag: lessonType, lessonId: lessonId });
  }

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  // Check if user already has access
  if (user.hasAccessToLesson(lessonType, lessonId)) {
    return next(new AppError('You already have access to this lesson', 400));
  }

  // Check if course is free
  if (course.isFree) {
    return next(new AppError('This course is free and does not require payment', 400));
  }

  // Check if course requires payment
  if (!course.requiresPayment) {
    return next(new AppError('This course does not require payment', 400));
  }

  const price = course.price || 75000;

  // Simulate payment processing
  const paymentSuccess = await simulatePayment(paymentMethod, price);
  
  if (!paymentSuccess) {
    return next(new AppError('Payment failed. Please try again.', 400));
  }

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
      courseTitle: course.title,
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
  
  const user = await User.findById(userId).populate('purchasedCourses.courseId');
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
        purchasedCourses: user.purchasedCourses,
        freeTrialUsed: user.freeTrialUsed
      }
    }
  });
});

// Get all courses with user's access status
exports.getUserCoursesWithAccess = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get all active courses
  const allCourses = await Course.find({ isActive: true }).sort({ createdAt: -1 });

  // Map courses with access status
  const coursesWithAccess = allCourses.map(course => {
    const lessonType = course.category === 'animal' ? 'animal' : course.tag;
    const hasAccess = user.hasAccessToLesson(lessonType, course.lessonId);
    const isPurchased = user.purchasedCourses?.some(pc => 
      pc.courseId.toString() === course._id.toString()
    );

    return {
      _id: course._id,
      title: course.title,
      description: course.description,
      image: course.image,
      level: course.level,
      duration: course.duration,
      type: course.type,
      lessonId: course.lessonId,
      tag: course.tag,
      category: course.category,
      price: course.price || (course.requiresPayment ? 75000 : 0),
      isFree: course.isFree,
      requiresPayment: course.requiresPayment,
      hasAccess: hasAccess,
      isPurchased: isPurchased,
      progress: course.progress || 0
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      courses: coursesWithAccess,
      userSubscription: user.subscription,
      totalCourses: coursesWithAccess.length,
      freeCourses: coursesWithAccess.filter(c => c.isFree).length,
      paidCourses: coursesWithAccess.filter(c => c.requiresPayment).length,
      purchasedCourses: coursesWithAccess.filter(c => c.isPurchased).length
    }
  });
});

// PAYMENT SIMULATION FUNCTION
// TODO: Replace with real payment gateway integration
async function simulatePayment(paymentMethod, amount) {
  console.log(`Simulating ${paymentMethod} payment for ${amount} VND`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate payment success/failure (90% success rate)
  const success = Math.random() > 0.1;
  
  console.log(`Payment simulation result: ${success ? 'SUCCESS' : 'FAILED'}`);
  return success;
  
  /*
  // REAL PAYMENT GATEWAY EXAMPLES:
  
  // VNPay Integration Example
  if (paymentMethod === 'vnpay') {
    const vnpayResponse = await vnpayService.createPayment({
      amount: amount,
      orderInfo: `Payment for lesson ${lessonType}-${lessonId}`,
      returnUrl: process.env.VNPAY_RETURN_URL,
      ipAddr: req.ip
    });
    return { success: true, paymentUrl: vnpayResponse.paymentUrl };
  }
  
  // MoMo Integration Example  
  if (paymentMethod === 'momo') {
    const momoResponse = await momoService.createPayment({
      amount: amount,
      orderInfo: `Lesson payment`,
      redirectUrl: process.env.MOMO_REDIRECT_URL,
      ipnUrl: process.env.MOMO_IPN_URL
    });
    return { success: true, paymentUrl: momoResponse.payUrl };
  }
  
  // ZaloPay Integration Example
  if (paymentMethod === 'zalopay') {
    const zaloResponse = await zaloPayService.createOrder({
      amount: amount,
      description: `Payment for lesson`,
      callback_url: process.env.ZALOPAY_CALLBACK_URL
    });
    return { success: true, paymentUrl: zaloResponse.order_url };
  }
  
  // Stripe Integration Example
  if (paymentMethod === 'card') {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'vnd',
      metadata: {
        lessonType: lessonType,
        lessonId: lessonId,
        userId: userId
      }
    });
    return { success: true, clientSecret: paymentIntent.client_secret };
  }
  */
}

// Add this to your userController.js

// Get current user profile (for auth verification)
exports.getCurrentUser = catchAsync(async (req, res, next) => {
  // The protect middleware should have already set req.user
  if (!req.user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
        subscription: req.user.subscription,
        purchasedCourses: req.user.purchasedCourses,
        accessibleLessons: req.user.accessibleLessons
      }
    }
  });
});

// Add this to your userController.js

// Check if user has access to a specific lesson
exports.checkLessonAccess = catchAsync(async (req, res, next) => {
  const { lessonType, lessonId } = req.params;
  const userId = req.user.id;

  console.log(`Checking access for user ${userId}, lesson ${lessonType}-${lessonId}`);

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if user has access to this specific lesson
  const hasAccess = user.hasAccessToLesson(lessonType, lessonId);
  
  // Also check if it's a free lesson
  const isFree = (lessonType === 'vietnamese' && ['1', '2'].includes(lessonId)) ||
                 (lessonType === 'math' && ['4', '5'].includes(lessonId));
  
  // Check if user has purchased this lesson specifically
  const isPurchased = user.purchasedCourses?.some(pc => {
    // For animal lessons, check category
    if (lessonType === 'animal') {
      return pc.lessonType === 'animal' && pc.lessonId === lessonId;
    }
    // For other lessons, check tag
    return pc.lessonType === lessonType && pc.lessonId === lessonId;
  });

  console.log(`Access check result:`, {
    hasAccess,
    isFree,
    isPurchased,
    subscription: user.subscription
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      hasAccess: hasAccess || isFree || isPurchased,
      lessonType,
      lessonId,
      isFree,
      isPurchased,
      subscriptionType: user.subscription.type,
      subscriptionActive: user.subscription.isActive
    }
  });
});

// Enhanced getUserLessons function
exports.getUserLessons = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get all active courses from database
  const allCourses = await Course.find({ isActive: true });

  // Define default lessons structure
  const defaultLessons = [
    {
      type: 'vietnamese',
      id: '1',
      title: 'Nhận biết chữ cái',
      description: 'Học cách nhận biết và phát âm các chữ cái tiếng Việt',
      price: 0,
      isFree: true,
      hasAccess: true,
      category: 'vietnamese',
      level: 'Pre-K'
    },
    {
      type: 'vietnamese',
      id: '2', 
      title: 'Tập viết chữ thường',
      description: 'Học cách viết chữ thường tiếng Việt đúng chuẩn',
      price: 0,
      isFree: true,
      hasAccess: true,
      category: 'vietnamese',
      level: 'Pre-K'
    },
    {
      type: 'math',
      id: '4',
      title: 'Học viết số',
      description: 'Học cách viết các số từ 0 đến 9',
      price: 0,
      isFree: true,
      hasAccess: true,
      category: 'math',
      level: 'Pre-K'
    },
    {
      type: 'math',
      id: '5',
      title: 'Học đọc số',
      description: 'Học cách đọc và đếm số từ 0 đến 9',
      price: 0,
      isFree: true,
      hasAccess: true,
      category: 'math',
      level: 'Pre-K'
    },
    {
      type: 'animal',
      id: '1',
      title: '10 Loại động vật quanh chúng ta',
      description: 'Học về các loại động vật quen thuộc với âm thanh thật',
      price: 75000,
      isFree: false,
      hasAccess: false, // Will be determined by user's purchase status
      category: 'animal',
      level: 'Pre-K'
    }
  ];

  // Map courses from database with access information
  const lessonsWithAccess = [];

  // Add database courses if they exist
  if (allCourses.length > 0) {
    allCourses.forEach(course => {
      const lessonType = course.category === 'animal' ? 'animal' : course.tag;
      const hasAccess = user.hasAccessToLesson(lessonType, course.lessonId);
      const isFree = course.isFree;
      const isPurchased = user.purchasedCourses?.some(pc => 
        pc.courseId.toString() === course._id.toString()
      );
      
      lessonsWithAccess.push({
        type: lessonType,
        id: course.lessonId,
        _id: course._id,
        title: course.title,
        description: course.description,
        image: course.image,
        level: course.level,
        duration: course.duration,
        category: course.category,
        tag: course.tag,
        price: isFree ? 0 : (course.price || 75000),
        hasAccess: hasAccess || isFree || isPurchased,
        isFree: isFree,
        isPurchased: isPurchased,
        requiresPayment: course.requiresPayment
      });
    });
  } else {
    // Use default lessons if no courses in database
    defaultLessons.forEach(lesson => {
      const hasAccess = lesson.isFree || user.hasAccessToLesson(lesson.type, lesson.id);
      const isPurchased = user.purchasedCourses?.some(pc => 
        pc.lessonType === lesson.type && pc.lessonId === lesson.id
      );

      lessonsWithAccess.push({
        ...lesson,
        hasAccess: hasAccess || isPurchased,
        isPurchased: isPurchased,
        requiresPayment: !lesson.isFree
      });
    });
  }

  res.status(200).json({
    status: 'success',
    lessons: lessonsWithAccess,
    subscription: user.subscription,
    accessibleLessons: user.accessibleLessons,
    purchasedCourses: user.purchasedCourses
  });
});