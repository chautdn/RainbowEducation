import React, { useState, useEffect } from "react";
import { Lock, Crown, Check, CreditCard, Loader } from "lucide-react";
import CoursePaymentService from '../../services/coursePaymentService';

export default function CategorySection({ title, active, categoryType, note }) {
  const navigate = (path) => {
    console.log('Navigate to:', path);
    window.location.href = path;
  };
  
  const grades = ["Pre-K", "K", "1", "2", "3", "4", "5"];
  const [selectedGrade, setSelectedGrade] = useState("Pre-K");
  const [courses, setCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load courses from backend
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await CoursePaymentService.getUserCourses();
        if (response.success) {
          setCourses(response.courses);
          // Update purchased courses list
          const purchased = response.courses
            .filter(course => course.isPurchased)
            .map(course => course._id);
          setPurchasedCourses(purchased);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Filter courses based on selected criteria
  const getCurrentCourses = () => {
    return courses.filter(course => {
      // Filter by grade/level
      if (course.level !== selectedGrade) return false;
      
      // Filter by category/type
      if (categoryType === "math" && course.tag !== "math") return false;
      if (categoryType === "vietnamese") {
        if (note === "animals") {
          return course.category === "animal";
        } else {
          return course.tag === "vietnamese" && course.category !== "animal";
        }
      }
      
      return true;
    });
  };

  const currentCourses = getCurrentCourses();

  const handleCourseClick = async (course) => {
    const isPurchased = course.isPurchased || course.hasAccess;
    
    if (course.isFree || isPurchased) {
      // Navigate to course
      if (course.tag === "math" || course.category === "math") {
        navigate(`/lesson-detail/math/lesson${course.lessonId}`);
      } else if (course.category === "animal") {
        navigate(`/lesson-detail/animal/lesson${course.lessonId}`);
      } else if (course.tag === "vietnamese") {
        navigate(`/lesson-detail/vietnamese/lesson${course.lessonId}`);
      }
    } else {
      // Course needs payment
      try {
        setLoadingPayment(course._id);
        setError(null);
        
        // Use the course's actual _id for payment
        const paymentData = await CoursePaymentService.createCoursePayment(
          course.lessonId, // Use lessonId since backend now handles this
          course.price || 75000
        );
        
        if (paymentData.success && paymentData.checkoutUrl) {
          // Save return info for after payment
          sessionStorage.setItem('courseReturnUrl', JSON.stringify({
            courseId: course._id,
            lessonId: course.lessonId,
            categoryType: course.tag || course.category,
            category: course.category,
            orderCode: paymentData.orderCode
          }));
          
          // Redirect to PayOS checkout
          console.log('Redirecting to PayOS:', paymentData.checkoutUrl);
          window.location.href = paymentData.checkoutUrl;
        } else {
          throw new Error(paymentData.error || 'No checkout URL received');
        }
        
      } catch (error) {
        console.error('Payment error:', error);
        setError(error.message);
        
        // Show user-friendly error
        if (error.message.includes('login')) {
          alert('Vui lòng đăng nhập để mua khóa học');
        } else if (error.message.includes('free')) {
          alert('Khóa học này miễn phí, không cần thanh toán');
        } else if (error.message.includes('already purchased')) {
          alert('Bạn đã mua khóa học này rồi');
          // Refresh courses to update status
          window.location.reload();
        } else {
          alert(`Lỗi thanh toán: ${error.message}`);
        }
      } finally {
        setLoadingPayment(null);
      }
    }
  };

  // Test backend connection
  const testBackend = async () => {
    try {
      const response = await CoursePaymentService.testConnection();
      console.log('Backend test:', response);
      alert(response.success ? 'Backend connected!' : `Backend error: ${response.error}`);
    } catch (error) {
      alert(`Cannot connect to backend: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-[#3a3fa3] shadow p-6 min-h-[75vh] font-sans flex items-center justify-center">
        <div className="text-white text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} />
          <div>Đang tải khóa học...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl bg-[#3a3fa3] shadow p-6 min-h-[75vh] font-sans transition-all duration-500
        ${
          active
            ? "scale-100 opacity-100"
            : "scale-90 opacity-60 pointer-events-none"
        }`}
    >
      {/* Header with Test Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-extrabold text-2xl text-white tracking-wide">
          {title?.toUpperCase()}
        </h2>
        <button
          onClick={testBackend}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Test Backend
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Grade Selector */}
      <div className="flex items-center gap-4 mb-8 pl-5">
        <span
          className="text-white text-lg font-semibold mr-1"
          style={{ minWidth: 70 }}
        >
          Lớp
        </span>
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold transition-all
              ${
                selectedGrade === grade
                  ? "bg-[#6ee7e7] text-[#23326d] shadow-lg"
                  : "bg-[#23277e] text-white hover:bg-[#4b50b7]"
              }
            `}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-4 gap-6">
        {currentCourses.length === 0 ? (
          <div className="col-span-4 text-center text-white py-8">
            <div className="text-lg">Không có khóa học nào cho lớp {selectedGrade}</div>
          </div>
        ) : (
          currentCourses.map((course) => {
            const isPurchased = course.isPurchased || course.hasAccess;
            const isLoading = loadingPayment === course._id;
            const getIcon = () => (course.tag === "math" || course.category === "math" ? "🔢" : 
                                  course.category === "animal" ? "🐾" : "📚");

            return (
              <div
                key={course._id}
                onClick={() => !isLoading && handleCourseClick(course)}
                className={`bg-[#302f5b] rounded-md text-white text-xs p-4 min-w-[220px] min-h-[220px] shadow-md hover:brightness-110 transition-all duration-300 flex flex-col cursor-pointer relative ${
                  course.tag === "math" || course.category === "math"
                    ? "border-2 border-green-400"
                    : course.category === "animal"
                    ? "border-2 border-orange-400" 
                    : "border-2 border-purple-400"
                } ${!course.isFree && !isPurchased ? 'ring-4 ring-yellow-400 ring-opacity-50 shadow-xl' : ''}`}
              >
                {/* Course Type Badge */}
                <div className="absolute top-2 right-2 text-lg">{getIcon()}</div>
                
                {/* Payment Status Badge */}
                {isPurchased && !course.isFree && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Check size={12} />
                    ĐÃ MUA
                  </div>
                )}
                
                {!course.isFree && !isPurchased && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                    <Crown size={12} />
                    PREMIUM
                  </div>
                )}
                
                {course.isFree && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    MIỄN PHÍ
                  </div>
                )}

                {/* Course Image */}
                <div
                  className={`w-full h-32 rounded mb-4 flex items-center justify-center text-4xl transition-all duration-300
                  ${
                    course.tag === "math" || course.category === "math"
                      ? "bg-gradient-to-br from-green-500 to-blue-500"
                      : course.category === "animal"
                      ? "bg-gradient-to-br from-orange-500 to-red-500"
                      : "bg-gradient-to-br from-purple-500 to-pink-500"
                  }
                  ${!course.isFree && !isPurchased ? 'blur-sm hover:blur-none' : ''}
                `}
                  style={{
                    backgroundImage: course.image ? `url(${course.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!course.image && getIcon()}
                </div>

                {/* Course Title */}
                <div className="font-semibold text-base mb-2">
                  {course.title}
                </div>
                
                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-80 rounded-md flex flex-col items-center justify-center text-white">
                    <Loader className="animate-spin mb-2" size={32} />
                    <div className="text-sm">Đang kết nối PayOS...</div>
                  </div>
                )}
                
                {/* Payment Overlay */}
                {!course.isFree && !isPurchased && !isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 rounded-md flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                    <CreditCard size={32} className="mb-2" />
                    <div className="text-sm font-bold">Cần thanh toán</div>
                    <div className="text-lg font-bold text-yellow-400">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(course.price || 75000)}
                    </div>
                    <div className="text-xs mt-2 text-center px-2">
                      Nhấn để thanh toán qua PayOS
                    </div>
                  </div>
                )}
                
                <div className="text-xs">{course.description}</div>

                {/* Progress indicator */}
                <div className="mt-auto pt-2">
                  <div className="w-full bg-gray-600 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full 
                        ${
                          course.tag === "math" || course.category === "math"
                            ? "bg-green-400"
                            : course.category === "animal"
                            ? "bg-orange-400"
                            : "bg-purple-400"
                        }
                      `}
                      style={{ width: isPurchased || course.isFree ? "100%" : "0%" }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 opacity-75">
                    {isPurchased || course.isFree ? "Đã mở khóa" : "Chưa mở khóa"}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}