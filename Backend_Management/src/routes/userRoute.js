const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authenticateController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/logout', authController.logout);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendEmailVerification);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Payment and lesson access routes (protected)
router.get('/lessons', authController.protect, userController.getUserLessons);
router.get('/lessons/:lessonType/:lessonId/access', authController.protect, userController.checkLessonAccess);
router.post('/purchase/lesson', authController.protect, userController.purchaseLesson);
router.post('/purchase/subscription', authController.protect, userController.purchaseSubscription);
router.get('/profile', authController.protect, userController.getUserProfile);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
