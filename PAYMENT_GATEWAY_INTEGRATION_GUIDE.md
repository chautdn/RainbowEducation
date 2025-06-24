# 🏦 Hướng dẫn Tích hợp Payment Gateway - Rainbow Education

## 📋 Tổng quan
File này hướng dẫn chi tiết cách tích hợp các payment gateway thật vào hệ thống thanh toán đã có.

---

## 🇻🇳 VNPay Integration

### 1. Đăng ký tài khoản
1. Truy cập: https://vnpay.vn/
2. Đăng ký tài khoản merchant
3. Lấy thông tin: TMN_CODE, SECRET_KEY

### 2. Environment Variables
```bash
# .env
VNPAY_TMN_CODE=your_terminal_id
VNPAY_SECRET_KEY=your_secret_key
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/return
VNPAY_IPN_URL=http://localhost:5000/api/payment/vnpay/ipn
```

### 3. Backend Implementation
```javascript
// File: Backend_Management/src/controllers/userController.js
// Uncomment VNPay code trong simulatePayment function

// File: Backend_Management/src/services/paymentServices.js  
// Uncomment VNPayService class

// Thêm routes cho callback:
// routes/paymentRoutes.js
router.get('/vnpay/return', handleVNPayReturn);
router.post('/vnpay/ipn', handleVNPayIPN);
```

### 4. Frontend Changes
```javascript
// File: Frontend_Management/src/components/sharedComponents/PaymentModal.jsx
// VNPay option đã có sẵn, chỉ cần uncomment logic xử lý redirect
```

---

## 💰 MoMo Integration

### 1. Đăng ký tài khoản
1. Truy cập: https://business.momo.vn/
2. Đăng ký tài khoản doanh nghiệp
3. Lấy thông tin: PARTNER_CODE, ACCESS_KEY, SECRET_KEY

### 2. Installation
```bash
npm install crypto axios
```

### 3. Environment Variables
```bash
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=http://localhost:3000/payment/momo/return
MOMO_IPN_URL=http://localhost:5000/api/payment/momo/ipn
```

### 4. Implementation
```javascript
// Uncomment MoMoService trong paymentServices.js
// Thêm routes cho IPN callback
```

---

## 🔵 ZaloPay Integration

### 1. Đăng ký
1. Truy cập: https://zalopay.vn/business
2. Đăng ký tài khoản merchant
3. Lấy APP_ID, KEY1, KEY2

### 2. Environment Variables  
```bash
ZALOPAY_APP_ID=your_app_id
ZALOPAY_KEY1=your_key1
ZALOPAY_KEY2=your_key2
ZALOPAY_ENDPOINT=https://sb-openapi.zalopay.vn/v2/create
ZALOPAY_CALLBACK_URL=http://localhost:5000/api/payment/zalopay/callback
```

---

## 💳 International - Stripe Integration

### 1. Setup
```bash
npm install stripe
```

### 2. Environment Variables
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Implementation
```javascript
// Uncomment StripeService trong paymentServices.js
// Frontend cần Stripe Elements cho card form
```

---

## 🔧 Implementation Steps

### Bước 1: Chọn Payment Gateway
Chọn 1 hoặc nhiều gateway từ:
- **VNPay**: Phổ biến nhất VN, hỗ trợ nhiều ngân hàng
- **MoMo**: Ví điện tử phổ biến
- **ZaloPay**: Ví điện tử của Zalo
- **Stripe**: International, hỗ trợ thẻ quốc tế

### Bước 2: Backend Changes
1. Uncomment code trong `paymentServices.js`
2. Cập nhật `userController.js` - uncomment real implementation
3. Thêm routes cho callbacks/webhooks
4. Thêm PaymentTransaction model vào project

### Bước 3: Frontend Changes  
1. Cập nhật `PaymentModal.jsx` - uncomment redirect logic
2. Tạo return/callback pages cho từng gateway
3. Handle payment status updates

### Bước 4: Database Updates
1. Import PaymentTransaction model
2. Chạy migration để tạo bảng mới
3. Update User model methods nếu cần

### Bước 5: Testing
1. Test với sandbox/test environment
2. Verify callbacks/webhooks
3. Test payment flows end-to-end

---

## 📁 Files cần chỉnh sửa

### Backend:
- ✅ `controllers/userController.js` - Uncomment real payment logic
- ✅ `services/paymentServices.js` - Uncomment gateway services  
- ✅ `models/paymentTransaction.js` - Import vào project
- 🔲 `routes/paymentRoutes.js` - Tạo mới cho callbacks
- 🔲 `controllers/paymentController.js` - Tạo mới cho webhook handling

### Frontend:
- ✅ `PaymentModal.jsx` - Uncomment redirect handling
- 🔲 `pages/payment/` - Tạo return pages
- 🔲 `services/paymentService.js` - Update cho gateway methods

---

## 🔒 Security Considerations

### 1. Webhook Verification
- Luôn verify signature từ gateway
- Validate amount và order info
- Check duplicate transactions

### 2. Environment Variables
- Không commit secrets vào git
- Sử dụng different keys cho dev/prod
- Rotate keys định kỳ

### 3. Error Handling
- Log tất cả payment attempts
- Handle network failures gracefully
- Provide clear error messages

### 4. Data Protection
- Không store card details
- Encrypt sensitive payment data
- Comply với PCI DSS nếu handle cards

---

## 🚀 Quick Start Checklist

### VNPay (Recommended for Vietnam):
- [ ] Đăng ký tài khoản VNPay merchant
- [ ] Lấy TMN_CODE và SECRET_KEY  
- [ ] Thêm environment variables
- [ ] Uncomment VNPayService code
- [ ] Tạo return/IPN routes
- [ ] Test với sandbox
- [ ] Deploy và test production

### MoMo:
- [ ] Đăng ký MoMo Business
- [ ] Lấy PARTNER_CODE, ACCESS_KEY, SECRET_KEY
- [ ] Uncomment MoMoService code
- [ ] Setup IPN endpoint
- [ ] Test payment flow

### Testing:
- [ ] Test successful payments
- [ ] Test failed payments  
- [ ] Test network timeouts
- [ ] Test duplicate payments
- [ ] Test refunds (if supported)

---

## 📞 Support Resources

### VNPay:
- Docs: https://sandbox.vnpayment.vn/apis/
- Support: support@vnpay.vn

### MoMo:
- Docs: https://developers.momo.vn/
- Support: developer@momo.vn

### ZaloPay:  
- Docs: https://docs.zalopay.vn/
- Support: developers@zalopay.vn

### Stripe:
- Docs: https://stripe.com/docs
- Support: Stripe Dashboard

---

## 💡 Pro Tips

1. **Start with 1 gateway** - Implement và test thoroughly trước khi add thêm
2. **Use sandbox first** - Always test với test environment
3. **Monitor transactions** - Setup alerts cho failed payments
4. **Handle edge cases** - Network timeouts, duplicate payments, etc.
5. **User experience** - Provide clear payment status updates
6. **Mobile optimization** - Test payment flow trên mobile devices

---

**🎯 Mục tiêu: Có payment gateway production-ready trong 1-2 tuần!** 