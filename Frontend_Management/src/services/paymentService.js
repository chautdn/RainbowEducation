import axiosInstance from '../components/utils/AxiosInstance';

export class PaymentService {
  // Check if user has access to a specific lesson
  static async checkLessonAccess(lessonType, lessonId) {
    try {
      const response = await axiosInstance.get(`/user/lessons/${lessonType}/${lessonId}/access`);
      return response.data.data;
    } catch (error) {
      console.error('Error checking lesson access:', error);
      throw error;
    }
  }

  // Get all user lessons with access status
  static async getUserLessons() {
    try {
      const response = await axiosInstance.get('/user/lessons');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user lessons:', error);
      throw error;
    }
  }

  // Purchase a specific lesson
  static async purchaseLesson(lessonType, lessonId, paymentMethod) {
    try {
      const response = await axiosInstance.post('/user/purchase/lesson', {
        lessonType,
        lessonId,
        paymentMethod
      });
      return response.data;
    } catch (error) {
      console.error('Error purchasing lesson:', error);
      throw error;
    }
  }

  // Purchase subscription
  static async purchaseSubscription(subscriptionType, duration, paymentMethod) {
    try {
      const response = await axiosInstance.post('/user/purchase/subscription', {
        subscriptionType,
        duration,
        paymentMethod
      });
      return response.data;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      throw error;
    }
  }

  // Get user profile with payment info
  static async getUserProfile() {
    try {
      const response = await axiosInstance.get('/user/profile');
      return response.data.data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Check if lesson is free
  static isFreeLesson(lessonType, lessonId) {
    const freeLessons = {
      'vietnamese': ['1', '2'],
      'math': ['4', '5'],
      'animal': []
    };
    
    return freeLessons[lessonType] && freeLessons[lessonType].includes(lessonId);
  }

  // Get lesson price
  static getLessonPrice(lessonType, lessonId) {
    const lessonPrices = {
      'animal': { '1': 75000 } // Only animal lesson 1 is paid
    };
    
    return lessonPrices[lessonType]?.[lessonId] || 0;
  }

  // Format Vietnamese currency
  static formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
} 