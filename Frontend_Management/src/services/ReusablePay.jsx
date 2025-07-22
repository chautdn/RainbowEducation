import React, { useState } from 'react';
import { Lock, Loader, Check, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

// Mock service for demo - replace with your actual service
const CoursePaymentService = {
  async createPayment(courseId, amount) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      checkoutUrl: `https://pay.payos.vn/checkout/${Date.now()}`,
      orderCode: Date.now().toString(),
      amount: amount
    };
  },
  
  formatPrice(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
};

const CoursePaymentButton = ({ 
  courseId, 
  courseTitle = "Khóa học",
  amount = 75000, 
  onPaymentSuccess,
  isPurchased = false,
  buttonText = "Mua khóa học",
  purchasedText = "Đã mua",
  className = "",
  size = "medium", // small, medium, large
  variant = "primary" // primary, secondary, gradient
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (isPurchased) {
      toast.info('Bạn đã mua khóa học này!');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create payment session
      const paymentData = await CoursePaymentService.createPayment(courseId, amount);
      
      if (paymentData.success && paymentData.checkoutUrl) {
        // Store orderCode in sessionStorage for verification after redirect
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          orderCode: paymentData.orderCode,
          courseId: courseId,
          amount: amount,
          timestamp: Date.now()
        }));
        
        // Redirect to PayOS checkout
        window.location.href = paymentData.checkoutUrl;
      } else {
        throw new Error('Không thể tạo phiên thanh toán');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi tạo thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  // Variant classes
  const variantClasses = {
    primary: isPurchased 
      ? 'bg-green-500 hover:bg-green-600' 
      : 'bg-blue-600 hover:bg-blue-700',
    secondary: isPurchased
      ? 'bg-gray-500 hover:bg-gray-600'
      : 'bg-purple-600 hover:bg-purple-700',
    gradient: isPurchased
      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    text-white font-semibold rounded-lg
    transition-all duration-300 transform hover:scale-105
    flex items-center justify-center gap-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    shadow-lg hover:shadow-xl
    ${className}
  `;

  if (isPurchased) {
    return (
      <button 
        className={baseClasses}
        disabled
      >
        <Check size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
        {purchasedText}
      </button>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || isProcessing}
      className={baseClasses}
    >
      {isLoading ? (
        <>
          <Loader className="animate-spin" size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
          Đang xử lý...
        </>
      ) : (
        <>
          <CreditCard size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
          {buttonText}
          <span className="ml-1 font-bold">
            {CoursePaymentService.formatPrice(amount)}
          </span>
        </>
      )}
    </button>
  );
};

// Demo Component showing different use cases
const CoursePaymentDemo = () => {
  const [purchasedCourses, setPurchasedCourses] = useState({});

  const handlePaymentSuccess = (courseId) => {
    setPurchasedCourses(prev => ({ ...prev, [courseId]: true }));
    toast.success('Thanh toán thành công! Khóa học đã được mở.');
  };

  const courses = [
    { id: '1', title: 'Tiếng Việt Cơ Bản', price: 75000 },
    { id: '2', title: 'Toán Học Nâng Cao', price: 100000 },
    { id: '3', title: 'Động Vật Thế Giới', price: 50000 },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Course Payment Button Demo
        </h1>
        
        {/* Different button variants */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">Khóa học chất lượng cao</p>
              
              <CoursePaymentButton
                courseId={course.id}
                courseTitle={course.title}
                amount={course.price}
                isPurchased={purchasedCourses[course.id]}
                onPaymentSuccess={() => handlePaymentSuccess(course.id)}
                variant="gradient"
              />
            </div>
          ))}
        </div>

        {/* Size variations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Size Variations</h2>
          <div className="flex gap-4 flex-wrap">
            <CoursePaymentButton
              courseId="demo-small"
              amount={75000}
              size="small"
              buttonText="Small"
            />
            <CoursePaymentButton
              courseId="demo-medium"
              amount={75000}
              size="medium"
              buttonText="Medium"
            />
            <CoursePaymentButton
              courseId="demo-large"
              amount={75000}
              size="large"
              buttonText="Large"
            />
          </div>
        </div>

        {/* Variant examples */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Style Variants</h2>
          <div className="flex gap-4 flex-wrap">
            <CoursePaymentButton
              courseId="demo-primary"
              amount={75000}
              variant="primary"
              buttonText="Primary"
            />
            <CoursePaymentButton
              courseId="demo-secondary"
              amount={75000}
              variant="secondary"
              buttonText="Secondary"
            />
            <CoursePaymentButton
              courseId="demo-gradient"
              amount={75000}
              variant="gradient"
              buttonText="Gradient"
            />
          </div>
        </div>

        {/* Usage instructions */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3 text-blue-800">
            How to Use CoursePaymentButton
          </h3>
          <pre className="bg-white p-4 rounded-lg overflow-x-auto text-sm">
{`<CoursePaymentButton
  courseId={course.id}
  courseTitle={course.title}
  amount={75000}
  isPurchased={false}
  onPaymentSuccess={(courseId) => console.log('Paid:', courseId)}
  variant="gradient"
  size="medium"
  buttonText="Mua ngay"
  purchasedText="Đã sở hữu"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Export both the button component and demo
export default CoursePaymentButton;
export { CoursePaymentDemo };