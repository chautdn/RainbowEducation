const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authenticateController');

const router = express.Router();

// Public authentication routes (no authentication required)
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/logout', authController.logout);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendEmailVerification);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Protected routes (require authentication)
router.use(authController.protect); // All routes below this will require authentication

// User profile routes
router.get('/profile', userController.getCurrentUser);
router.get('/user-profile', userController.getUserProfile);

// Lesson access routes
router.get('/lesson-access/:lessonType/:lessonId', userController.checkLessonAccess);
router.get('/lessons', userController.getUserLessons);

// Course access routes
router.get('/courses-with-access', userController.getUserCoursesWithAccess);

// Payment routes
router.post('/purchase-lesson', userController.purchaseLesson);
router.post('/purchase-subscription', userController.purchaseSubscription);

// Admin routes
router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;