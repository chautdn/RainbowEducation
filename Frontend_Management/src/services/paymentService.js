// services/paymentService.js
// This service connects your lesson components to the new PayOS payment system

import CoursePaymentService from './coursePaymentService';
import axiosInstance from '../components/utils/AxiosInstance';

export class PaymentService {
  
  // Check if user has access to a specific lesson
  static async checkLessonAccess(lessonType, lessonId) {
    try {
      const response = await axiosInstance.get(`/user/lesson-access/${lessonType}/${lessonId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error checking lesson access:', error);
      
      // If the endpoint doesn't exist, fall back to course access check
      try {
        const coursesResponse = await CoursePaymentService.getUserCourses();
        if (coursesResponse.success) {
          // Find the specific course/lesson
          const course = coursesResponse.courses.find(c => {
            const courseType = c.category === 'animal' ? 'animal' : c.tag;
            return courseType === lessonType && c.lessonId === lessonId;
          });
          
          if (course) {
            return {
              hasAccess: course.hasAccess || course.isFree,
              lessonType: lessonType,
              lessonId: lessonId,
              isFree: course.isFree,
              isPurchased: course.isPurchased
            };
          }
        }
      } catch (fallbackError) {
        console.error('Fallback access check failed:', fallbackError);
      }
      
      // Default to no access
      return {
        hasAccess: false,
        lessonType: lessonType,
        lessonId: lessonId,
        isFree: false,
        isPurchased: false
      };
    }
  }
  
  // Get all user lessons with access status
  static async getUserLessons() {
    try {
      // Try the new endpoint first
      const response = await CoursePaymentService.getUserCourses();
      if (response.success) {
        // Transform courses to lessons format that the components expect
        const lessons = response.courses.map(course => ({
          type: course.category === 'animal' ? 'animal' : course.tag,
          id: course.lessonId,
          _id: course._id,
          title: course.title,
          description: course.description,
          image: course.image,
          level: course.level,
          duration: course.duration,
          category: course.category,
          price: course.price || (course.isFree ? 0 : 75000),
          hasAccess: course.hasAccess,
          isFree: course.isFree,
          isPurchased: course.isPurchased,
          requiresPayment: !course.isFree
        }));
        
        return {
          status: 'success',
          lessons: lessons
        };
      }
    } catch (error) {
      console.error('Error getting user lessons:', error);
    }
    
    // Fallback: return default lesson structure
    return {
      status: 'success',
      lessons: [
        {
          type: 'vietnamese',
          id: '1',
          title: 'Nhận biết chữ cái',
          price: 0,
          hasAccess: true,
          isFree: true,
          requiresPayment: false
        },
        {
          type: 'vietnamese', 
          id: '2',
          title: 'Tập viết chữ thường',
          price: 0,
          hasAccess: true,
          isFree: true,
          requiresPayment: false
        },
        {
          type: 'math',
          id: '4',
          title: 'Học viết số',
          price: 0,
          hasAccess: true,
          isFree: true,
          requiresPayment: false
        },
        {
          type: 'math',
          id: '5', 
          title: 'Học đọc số',
          price: 0,
          hasAccess: true,
          isFree: true,
          requiresPayment: false
        },
        {
          type: 'animal',
          id: '1',
          title: '10 Loại động vật quanh chúng ta',
          price: 75000,
          hasAccess: false,
          isFree: false,
          requiresPayment: true
        }
      ]
    };
  }
  
  // Get lesson price
  static getLessonPrice(lessonType, lessonId) {
    // Free lessons
    if (lessonType === 'vietnamese' && ['1', '2'].includes(lessonId)) {
      return 0;
    }
    if (lessonType === 'math' && ['4', '5'].includes(lessonId)) {
      return 0;
    }
    
    // Paid lessons (currently only animal lessons)
    if (lessonType === 'animal') {
      return 75000;
    }
    
    return 0;
  }
  
  // Format price to Vietnamese currency
  static formatPrice(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
  
  // Purchase a lesson using the new PayOS system
  static async purchaseLesson(lessonType, lessonId, paymentMethod = 'vnpay') {
    try {
      // Map lesson to course ID for the payment system
      let courseId;
      
      if (lessonType === 'animal' && lessonId === '1') {
        courseId = '3'; // This maps to the animal course in your database
      } else {
        throw new Error('This lesson is not available for purchase');
      }
      
      // Use the new CoursePaymentService
      const result = await CoursePaymentService.createCoursePayment(courseId, this.getLessonPrice(lessonType, lessonId));
      
      return result;
      
    } catch (error) {
      console.error('Purchase lesson error:', error);
      throw error;
    }
  }
  
  // Verify payment
  static async verifyPayment(orderCode) {
    try {
      return await CoursePaymentService.verifyPayment(orderCode);
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }
  
  // Check if lesson is free
  static isLessonFree(lessonType, lessonId) {
    return this.getLessonPrice(lessonType, lessonId) === 0;
  }
  
  // Get lesson info
  static getLessonInfo(lessonType, lessonId) {
    const lessonMap = {
      'vietnamese-1': { title: 'Nhận biết chữ cái', description: 'Học cách nhận biết và phát âm các chữ cái tiếng Việt' },
      'vietnamese-2': { title: 'Tập viết chữ thường', description: 'Học cách viết chữ thường tiếng Việt đúng chuẩn' },
      'math-4': { title: 'Học viết số', description: 'Học cách viết các số từ 0 đến 9' },
      'math-5': { title: 'Học đọc số', description: 'Học cách đọc và đếm số từ 0 đến 9' },
      'animal-1': { title: '10 Loại động vật quanh chúng ta', description: 'Học về các loại động vật quen thuộc với âm thanh thật' }
    };
    
    const key = `${lessonType}-${lessonId}`;
    const info = lessonMap[key] || { title: 'Unknown Lesson', description: 'Lesson description' };
    
    return {
      type: lessonType,
      id: lessonId,
      title: info.title,
      description: info.description,
      price: this.getLessonPrice(lessonType, lessonId),
      isFree: this.isLessonFree(lessonType, lessonId)
    };
  }
}