  import React, { useState } from 'react';
  import { X, CreditCard, Banknote, Shield } from 'lucide-react';
  import { PaymentService } from '../../services/paymentService';
  import { toast } from 'react-toastify';

  const PaymentModal = ({ isOpen, onClose, lesson, onPaymentSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('vnpay');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardDetails, setCardDetails] = useState({
      number: '',
      expiry: '',
      cvv: '',
      name: ''
    });

    const handlePayment = async () => {
      setIsProcessing(true);
      
      try {
        console.log('Starting payment for lesson:', lesson);
        
        // Use the new PaymentService which connects to PayOS
        const paymentResult = await PaymentService.purchaseLesson(
          lesson.type, 
          lesson.id, 
          paymentMethod
        );
        
        console.log('Payment result:', paymentResult);

        if (paymentResult.success) {
          if (paymentResult.simulated) {
            // Payment was simulated (no PayOS setup)
            toast.success('Thanh toán thành công (mô phỏng)! Bạn đã có quyền truy cập vào bài học này.');
            onPaymentSuccess();
            onClose();
          } else if (paymentResult.checkoutUrl) {
            // Real PayOS payment - redirect to checkout
            console.log('Redirecting to PayOS checkout:', paymentResult.checkoutUrl);
            
            // Save lesson info for return navigation
            sessionStorage.setItem('paymentReturnInfo', JSON.stringify({
              lessonType: lesson.type,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              orderCode: paymentResult.orderCode
            }));
            
            // Redirect to PayOS payment page
            window.location.href = paymentResult.checkoutUrl;
          } else {
            throw new Error('Invalid payment response');
          }
        } else {
          throw new Error(paymentResult.error || 'Payment creation failed');
        }
        
      } catch (error) {
        console.error('Payment error:', error);
        
        let errorMessage = 'Thanh toán thất bại. Vui lòng thử lại.';
        
        if (error.message.includes('login')) {
          errorMessage = 'Vui lòng đăng nhập để mua bài học.';
        } else if (error.message.includes('free')) {
          errorMessage = 'Bài học này miễn phí, không cần thanh toán.';
        } else if (error.message.includes('purchased')) {
          errorMessage = 'Bạn đã mua bài học này rồi.';
          // Refresh the page to update access status
          setTimeout(() => window.location.reload(), 1000);
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };

    const formatPrice = (price) => {
      return PaymentService.formatPrice(price);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Thanh toán bài học</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Lesson Info */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{lesson.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giá:</span>
              <span className="text-2xl font-bold text-purple-600">
                {formatPrice(lesson.price)}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              ✅ Truy cập không giới hạn trong 30 ngày<br/>
              ✅ Nội dung chất lượng cao<br/>
              ✅ Âm thanh và hình ảnh sống động
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Chọn phương thức thanh toán</h3>
            
            <div className="space-y-3">
              {/* VNPay option */}
              <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="vnpay"
                  checked={paymentMethod === 'vnpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="mr-3 w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VN</div>
                <div>
                  <div className="font-semibold">VNPay</div>
                  <div className="text-sm text-gray-500">Ví điện tử VNPay</div>
                </div>
              </label>

              {/* MoMo option */}
              <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === 'momo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="mr-3 w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
                <div>
                  <div className="font-semibold">MoMo</div>
                  <div className="text-sm text-gray-500">Ví điện tử MoMo</div>
                </div>
              </label>

              {/* ZaloPay option */}
              <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="zalopay"
                  checked={paymentMethod === 'zalopay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="mr-3 w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">Z</div>
                <div>
                  <div className="font-semibold">ZaloPay</div>
                  <div className="text-sm text-gray-500">Ví điện tử ZaloPay</div>
                </div>
              </label>

              {/* Card payment option */}
              <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <CreditCard className="mr-3 text-blue-600" size={20} />
                <div>
                  <div className="font-semibold">Thẻ tín dụng/Ghi nợ</div>
                  <div className="text-sm text-gray-500">Visa, Mastercard, JCB</div>
                </div>
              </label>

              {/* Banking option */}
              <label className="flex items-center p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="banking"
                  checked={paymentMethod === 'banking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <Banknote className="mr-3 text-green-600" size={20} />
                <div>
                  <div className="font-semibold">Internet Banking</div>
                  <div className="text-sm text-gray-500">Chuyển khoản ngân hàng</div>
                </div>
              </label>
            </div>
          </div>

          {/* Card Details Form (if card payment selected) */}
          {paymentMethod === 'card' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số thẻ
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MM/YY
                  </label>
                  <input
                    type="text"
                    placeholder="12/25"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chủ thẻ
                </label>
                <input
                  type="text"
                  placeholder="NGUYEN VAN A"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* Banking Instructions (if banking selected) */}
          {paymentMethod === 'banking' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2">Thông tin chuyển khoản</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Ngân hàng: Vietcombank</div>
                <div>Số tài khoản: 1234567890</div>
                <div>Chủ tài khoản: RAINBOW EDUCATION</div>
                <div>Nội dung: {lesson.type.toUpperCase()}-{lesson.id}-{Date.now()}</div>
              </div>
            </div>
          )}

          {/* Security Info */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <Shield className="mr-2 text-green-600" size={16} />
            Thông tin thanh toán được bảo mật và mã hóa
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Đang xử lý...' : `Thanh toán ${formatPrice(lesson.price)}`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default PaymentModal;