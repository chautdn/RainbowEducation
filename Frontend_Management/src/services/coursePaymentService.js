import axiosInstance from "../components/utils/AxiosInstance";

class CoursePaymentService {
  // Create payment for course
  async createCoursePayment(courseId, amount = 75000) {
    try {
      console.log("Creating payment for course:", courseId);

      const response = await axiosInstance.post(
        "/api/payment/create-course-payment",
        {
          courseId,
          amount,
        }
      );

      console.log("Payment API response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || "Payment creation failed");
      }

      return response.data;
    } catch (error) {
      console.error("Payment service error:", error);

      if (error.response?.status === 401) {
        throw new Error("Please login to purchase courses");
      }

      if (error.response?.data?.isFree) {
        throw new Error("This course is free and doesn't require payment");
      }

      if (error.response?.data?.purchased) {
        throw new Error("You already purchased this course");
      }

      throw new Error(
        error.response?.data?.error ||
          error.message ||
          "Failed to create payment"
      );
    }
  }

  // Verify payment after returning from PayOS
  async verifyPayment(orderCode) {
    try {
      const response = await axiosInstance.post("/api/payment/verify-payment", {
        orderCode,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Payment verification failed"
      );
    }
  }

  // Get user purchased courses
  async getUserCourses() {
    try {
      const response = await axiosInstance.get("/api/payment/user-courses");
      return response.data;
    } catch (error) {
      console.error("Error fetching user courses:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch user courses"
      );
    }
  }
}

export default new CoursePaymentService();
