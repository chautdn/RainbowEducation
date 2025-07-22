// temporary-payment-route.js
// Use this route temporarily to bypass the database issue

const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const User = require("../models/user");
const { protect } = require("../controllers/authenticateController");
require("dotenv").config({ path: "./config.env" });

// Initialize PayOS
let payos = null;
try {
  const PayOS = require("@payos/node");
  if (
    process.env.PAYOS_CLIENT_ID &&
    process.env.PAYOS_API_KEY &&
    process.env.PAYOS_CHECKSUM_KEY
  ) {
    payos = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY
    );
    console.log("PayOS initialized successfully");
  }
} catch (error) {
  console.error("PayOS init failed:", error.message);
}

// Temporary in-memory storage for testing
const tempPayments = new Map();

// Create payment for course (TEMPORARY VERSION)
router.post("/create-course-payment", protect, async (req, res) => {
  try {
    const { courseId, amount = 2000 } = req.body;
    const userId = req.user._id;

    console.log("=== TEMPORARY PAYMENT TEST ===");
    console.log("Course ID:", courseId);
    console.log("Amount:", amount);

    // Find course
    let course = await Course.findOne({ lessonId: courseId });
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    console.log("Found course:", course.title);

    // Check if course requires payment
    const isPaidCourse =
      course.category === "animal" || course.isPurchased === true;
    if (!isPaidCourse) {
      return res.status(400).json({
        success: false,
        error: "This course is free",
        isFree: true,
      });
    }

    // Generate order code
    const orderCode = Date.now() % 1000000;

    // If no PayOS, simulate immediately
    if (!payos) {
      console.log("No PayOS - simulating payment");

      // Grant access immediately
      const user = await User.findById(userId);
      const lessonType = course.category === "animal" ? "animal" : course.tag;
      const accessDuration = 30 * 24 * 60 * 60 * 1000;
      user.grantLessonAccess(lessonType, course.lessonId, accessDuration);

      user.purchasedCourses.push({
        courseId: course._id,
        purchasedAt: new Date(),
        amount: amount,
        orderCode: orderCode,
      });

      await user.save();

      return res.json({
        success: true,
        simulated: true,
        message: "Payment simulated - course unlocked!",
        orderCode: orderCode,
        courseUnlocked: true,
      });
    }

    // Create PayOS payment
    try {
      const paymentData = {
        orderCode: orderCode,
        amount: amount,
        description: `Khoa hoc ${course.lessonId}`,
        items: [
          {
            name:
              course.title.length > 50
                ? course.title.substring(0, 47) + "..."
                : course.title,
            quantity: 1,
            price: amount,
          },
        ],
        returnUrl: `${process.env.CLIENT_URL}/payment/success?orderCode=${orderCode}`,
        cancelUrl: `${process.env.CLIENT_URL}/payment/cancel?orderCode=${orderCode}`,
        buyerName: req.user.name || "Hoc vien",
        buyerEmail: req.user.email,
        buyerPhone: req.user.phone || "",
      };

      console.log("Creating PayOS payment...");
      const paymentResponse = await payos.createPaymentLink(paymentData);

      // Store in temporary memory (instead of database)
      tempPayments.set(orderCode, {
        userId: userId,
        courseId: course._id,
        amount: amount,
        status: "pending",
        paymentResponse: paymentResponse,
        createdAt: new Date(),
      });

      console.log("✅ PayOS payment created successfully!");
      console.log("Checkout URL:", paymentResponse.checkoutUrl);

      res.json({
        success: true,
        checkoutUrl: paymentResponse.checkoutUrl,
        orderCode: orderCode,
        paymentLinkId: paymentResponse.paymentLinkId,
        course: {
          id: course._id,
          title: course.title,
          lessonId: course.lessonId,
        },
      });
    } catch (payosError) {
      console.error("PayOS Error:", payosError.message);
      return res.status(500).json({
        success: false,
        error: "PayOS payment failed",
        details: payosError.message,
      });
    }
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      success: false,
      error: "Payment creation failed",
      details: error.message,
    });
  }
});

// Verify payment (TEMPORARY VERSION)
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const { orderCode } = req.body;
    const userId = req.user._id;

    console.log("=== VERIFYING PAYMENT ===");
    console.log("Order code:", orderCode);

    // Check temporary storage
    const tempPayment = tempPayments.get(parseInt(orderCode));
    if (!tempPayment) {
      return res.status(404).json({
        success: false,
        error: "Payment record not found",
      });
    }

    if (tempPayment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // Get course info
    const course = await Course.findById(tempPayment.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    // If no PayOS, simulate success
    if (!payos) {
      console.log("Simulating payment verification success");

      const user = await User.findById(userId);
      const lessonType = course.category === "animal" ? "animal" : course.tag;
      const accessDuration = 30 * 24 * 60 * 60 * 1000;
      user.grantLessonAccess(lessonType, course.lessonId, accessDuration);

      user.purchasedCourses.push({
        courseId: course._id,
        purchasedAt: new Date(),
        amount: tempPayment.amount,
        orderCode: orderCode,
      });

      await user.save();

      // Clean up temp storage
      tempPayments.delete(parseInt(orderCode));

      return res.json({
        success: true,
        simulated: true,
        message: "Payment verified (simulated)",
        courseUnlocked: true,
        course: {
          id: course._id,
          title: course.title,
          lessonId: course.lessonId,
          category: course.category,
        },
      });
    }

    // Real PayOS verification
    const paymentInfo = await payos.getPaymentLinkInformation(orderCode);
    console.log("PayOS status:", paymentInfo.status);

    if (paymentInfo.status === "PAID") {
      // Grant access
      const user = await User.findById(userId);
      const lessonType = course.category === "animal" ? "animal" : course.tag;
      const accessDuration = 30 * 24 * 60 * 60 * 1000;
      user.grantLessonAccess(lessonType, course.lessonId, accessDuration);

      user.purchasedCourses.push({
        courseId: course._id,
        purchasedAt: new Date(),
        amount: tempPayment.amount,
        orderCode: orderCode,
      });

      await user.save();

      // Clean up temp storage
      tempPayments.delete(parseInt(orderCode));

      res.json({
        success: true,
        message: "Payment verified successfully",
        courseUnlocked: true,
        course: {
          id: course._id,
          title: course.title,
          lessonId: course.lessonId,
          category: course.category,
        },
      });
    } else {
      res.json({
        success: false,
        status: paymentInfo.status,
        message: "Payment not completed",
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      error: "Payment verification failed",
      details: error.message,
    });
  }
});

// Get user courses (unchanged)
router.get("/user-courses", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const allCourses = await Course.find({ isActive: true });
    const user = await User.findById(userId);

    const coursesWithStatus = allCourses.map((course) => {
      const isPurchased = user.purchasedCourses?.some(
        (pc) => pc.courseId.toString() === course._id.toString()
      );
      const isFree = course.isFree;
      const lessonType = course.category === "animal" ? "animal" : course.tag;
      const hasAccess = user.hasAccessToLesson(lessonType, course.lessonId);

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
        isFree: isFree,
        isPurchased: isPurchased,
        hasAccess: hasAccess || isFree,
        price: isFree ? 0 : course.price || 2000,
      };
    });

    res.json({
      success: true,
      courses: coursesWithStatus,
      userSubscription: user.subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch courses",
      details: error.message,
    });
  }
});

// Test endpoint
router.get("/test-payos", async (req, res) => {
  if (!payos) {
    return res.json({
      success: false,
      error: "PayOS not configured",
      simulated: true,
    });
  }

  try {
    const testOrderCode = Date.now() % 1000000;
    const testPayment = {
      orderCode: testOrderCode,
      amount: 2000,
      description: "Test payment",
      returnUrl: `${process.env.CLIENT_URL}/test`,
      cancelUrl: `${process.env.CLIENT_URL}/test`,
    };

    const result = await payos.createPaymentLink(testPayment);

    if (result.paymentLinkId) {
      try {
        await payos.cancelPaymentLink(result.paymentLinkId, "Test completed");
      } catch (err) {
        console.log("Could not cancel test payment");
      }
    }

    res.json({
      success: true,
      message: "PayOS working perfectly!",
      testOrderCode: testOrderCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
