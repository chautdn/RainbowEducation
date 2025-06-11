const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/type/:type', courseController.getCoursesByType);
router.get('/:id', courseController.getCourseById);

// Protected routes (admin only)
router.post('/', authenticateToken, isAdmin, courseController.createCourse);
router.put('/:id', authenticateToken, isAdmin, courseController.updateCourse);
router.delete('/:id', authenticateToken, isAdmin, courseController.deleteCourse);

module.exports = router; 