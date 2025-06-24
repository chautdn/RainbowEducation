// TODO: PAYMENT GATEWAY INTEGRATION SERVICES
// This file contains templates and examples for integrating various payment gateways

/*
===========================================
INSTALLATION REQUIREMENTS:
===========================================

npm install crypto axios moment dotenv

For specific gateways:
- VNPay: No official SDK, use direct API calls
- MoMo: npm install @momoapi/crypto
- ZaloPay: No official SDK, use direct API calls  
- Stripe: npm install stripe
- PayPal: npm install @paypal/checkout-server-sdk

===========================================
ENVIRONMENT VARIABLES NEEDED:
===========================================

# VNPay
VNPAY_TMN_CODE=your_terminal_id
VNPAY_SECRET_KEY=your_secret_key
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment/vnpay/return
VNPAY_IPN_URL=http://localhost:5000/api/payment/vnpay/ipn

# MoMo
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=http://localhost:3000/payment/momo/return
MOMO_IPN_URL=http://localhost:5000/api/payment/momo/ipn

# ZaloPay
ZALOPAY_APP_ID=your_app_id
ZALOPAY_KEY1=your_key1
ZALOPAY_KEY2=your_key2
ZALOPAY_ENDPOINT=https://sb-openapi.zalopay.vn/v2/create
ZALOPAY_CALLBACK_URL=http://localhost:5000/api/payment/zalopay/callback

# Stripe (International)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

*/

const crypto = require('crypto');
const axios = require('axios');
const moment = require('moment');

// ===========================================
// VNPAY INTEGRATION EXAMPLE
// ===========================================
class VNPayService {
  static async createPayment({ amount, orderInfo, returnUrl, ipAddr, lessonType, lessonId, userId }) {
    /*
    const vnp_TmnCode = process.env.VNPAY_TMN_CODE;
    const vnp_HashSecret = process.env.VNPAY_SECRET_KEY;
    const vnp_Url = process.env.VNPAY_URL;
    
    const vnp_TxnRef = `${Date.now()}_${userId}_${lessonType}_${lessonId}`;
    const vnp_OrderInfo = orderInfo;
    const vnp_OrderType = 'other';
    const vnp_Amount = amount * 100; // VNPay uses VND * 100
    const vnp_Locale = 'vn';
    const vnp_BankCode = '';
    const vnp_CreateDate = moment().format('YYYYMMDDHHmmss');
    
    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode,
      vnp_Locale,
      vnp_CurrCode: 'VND',
      vnp_TxnRef,
      vnp_OrderInfo,
      vnp_OrderType,
      vnp_Amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate
    };
    
    if (vnp_BankCode) {
      vnp_Params.vnp_BankCode = vnp_BankCode;
    }
    
    // Sort parameters
    const sortedParams = Object.keys(vnp_Params).sort();
    let signData = '';
    let querystring = '';
    
    for (let key of sortedParams) {
      if (signData) {
        signData += '&';
        querystring += '&';
      }
      signData += `${key}=${vnp_Params[key]}`;
      querystring += `${key}=${encodeURIComponent(vnp_Params[key])}`;
    }
    
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const vnp_SecureHash = hmac.update(signData, 'utf-8').digest('hex');
    
    const paymentUrl = `${vnp_Url}?${querystring}&vnp_SecureHash=${vnp_SecureHash}`;
    
    return {
      success: true,
      paymentUrl,
      transactionId: vnp_TxnRef
    };
    */
    
    // CURRENT: Return mock data
    return {
      success: true,
      paymentUrl: 'https://mock-vnpay-url.com',
      transactionId: `mock_${Date.now()}`
    };
  }
  
  static verifyReturnUrl(query) {
    /*
    const vnp_SecureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;
    
    const sortedParams = Object.keys(query).sort();
    let signData = '';
    
    for (let key of sortedParams) {
      if (signData) signData += '&';
      signData += `${key}=${query[key]}`;
    }
    
    const hmac = crypto.createHmac('sha512', process.env.VNPAY_SECRET_KEY);
    const checkSum = hmac.update(signData, 'utf-8').digest('hex');
    
    return {
      isValid: checkSum === vnp_SecureHash,
      responseCode: query.vnp_ResponseCode,
      transactionId: query.vnp_TxnRef,
      amount: query.vnp_Amount / 100
    };
    */
    
    return { isValid: true, responseCode: '00' };
  }
}

// ===========================================
// MOMO INTEGRATION EXAMPLE  
// ===========================================
class MoMoService {
  static async createPayment({ amount, orderInfo, redirectUrl, ipnUrl, lessonType, lessonId, userId }) {
    /*
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretkey = process.env.MOMO_SECRET_KEY;
    const endpoint = process.env.MOMO_ENDPOINT;
    
    const orderId = `${partnerCode}_${Date.now()}_${userId}`;
    const requestId = orderId;
    const extraData = JSON.stringify({ lessonType, lessonId, userId });
    const requestType = 'captureWallet';
    
    const rawData = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = crypto
      .createHmac('sha256', secretkey)
      .update(rawData)
      .digest('hex');
    
    const requestBody = {
      partnerCode,
      partnerName: 'Rainbow Education',
      storeId: 'MomoTestStore',
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: 'vi',
      extraData,
      requestType,
      signature
    };
    
    const response = await axios.post(endpoint, requestBody);
    
    return {
      success: response.data.resultCode === 0,
      payUrl: response.data.payUrl,
      transactionId: orderId,
      message: response.data.message
    };
    */
    
    // CURRENT: Return mock data
    return {
      success: true,
      payUrl: 'https://mock-momo-url.com',
      transactionId: `mock_momo_${Date.now()}`
    };
  }
  
  static verifyIPN(body) {
    /*
    const signature = body.signature;
    delete body.signature;
    
    const rawData = Object.keys(body)
      .sort()
      .map(key => `${key}=${body[key]}`)
      .join('&');
    
    const checkSignature = crypto
      .createHmac('sha256', process.env.MOMO_SECRET_KEY)
      .update(rawData)
      .digest('hex');
    
    return {
      isValid: checkSignature === signature,
      resultCode: body.resultCode,
      orderId: body.orderId,
      amount: body.amount
    };
    */
    
    return { isValid: true, resultCode: 0 };
  }
}

// ===========================================
// ZALOPAY INTEGRATION EXAMPLE
// ===========================================
class ZaloPayService {
  static async createOrder({ amount, description, lessonType, lessonId, userId }) {
    /*
    const appid = process.env.ZALOPAY_APP_ID;
    const key1 = process.env.ZALOPAY_KEY1;
    const endpoint = process.env.ZALOPAY_ENDPOINT;
    
    const appTransId = `${moment().format('YYMMDD')}_${Date.now()}`;
    const embedData = JSON.stringify({ lessonType, lessonId, userId });
    
    const orderData = {
      app_id: appid,
      app_trans_id: appTransId,
      app_user: `user_${userId}`,
      app_time: Date.now(),
      amount: amount,
      description: description,
      bank_code: '',
      item: JSON.stringify([{
        itemid: `${lessonType}_${lessonId}`,
        itemname: description,
        itemprice: amount,
        itemquantity: 1
      }]),
      embed_data: embedData,
      callback_url: process.env.ZALOPAY_CALLBACK_URL
    };
    
    const data = `${appid}|${orderData.app_trans_id}|${orderData.app_user}|${orderData.amount}|${orderData.app_time}|${orderData.embed_data}|${orderData.item}`;
    orderData.mac = crypto.createHmac('sha256', key1).update(data).digest('hex');
    
    const response = await axios.post(endpoint, orderData);
    
    return {
      success: response.data.return_code === 1,
      order_url: response.data.order_url,
      transactionId: appTransId,
      zp_trans_token: response.data.zp_trans_token
    };
    */
    
    // CURRENT: Return mock data
    return {
      success: true,
      order_url: 'https://mock-zalopay-url.com',
      transactionId: `mock_zalo_${Date.now()}`
    };
  }
  
  static verifyCallback(body) {
    /*
    const key2 = process.env.ZALOPAY_KEY2;
    const dataStr = body.data;
    const reqMac = body.mac;
    
    const mac = crypto.createHmac('sha256', key2).update(dataStr).digest('hex');
    
    if (reqMac !== mac) {
      return { isValid: false };
    }
    
    const dataJson = JSON.parse(dataStr);
    
    return {
      isValid: true,
      appTransId: dataJson.app_trans_id,
      amount: dataJson.amount,
      embedData: JSON.parse(dataJson.embed_data)
    };
    */
    
    return { isValid: true };
  }
}

// ===========================================
// STRIPE INTEGRATION EXAMPLE (INTERNATIONAL)
// ===========================================
class StripeService {
  static async createPaymentIntent({ amount, currency = 'usd', metadata }) {
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: currency,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id
    };
    */
    
    // CURRENT: Return mock data
    return {
      success: true,
      clientSecret: 'mock_stripe_client_secret',
      transactionId: `mock_stripe_${Date.now()}`
    };
  }
}

module.exports = {
  VNPayService,
  MoMoService,
  ZaloPayService,
  StripeService
};

/*
===========================================
USAGE EXAMPLE IN CONTROLLER:
===========================================

const { VNPayService, MoMoService, ZaloPayService } = require('../services/paymentServices');

// In purchaseLesson controller:
switch(paymentMethod) {
  case 'vnpay':
    const vnpayResult = await VNPayService.createPayment({
      amount: price,
      orderInfo: `Payment for ${lessonType} lesson ${lessonId}`,
      returnUrl: `${process.env.CLIENT_URL}/payment/vnpay/return`,
      ipAddr: req.ip,
      lessonType,
      lessonId,
      userId: user._id
    });
    
    if (vnpayResult.success) {
      // Redirect user to payment URL
      return res.status(200).json({
        status: 'redirect',
        paymentUrl: vnpayResult.paymentUrl,
        transactionId: vnpayResult.transactionId
      });
    }
    break;
    
  case 'momo':
    const momoResult = await MoMoService.createPayment({
      amount: price,
      orderInfo: `Rainbow Education - ${lessonType} lesson`,
      redirectUrl: `${process.env.CLIENT_URL}/payment/momo/return`,
      ipnUrl: `${process.env.SERVER_URL}/api/payment/momo/ipn`,
      lessonType,
      lessonId,
      userId: user._id
    });
    
    if (momoResult.success) {
      return res.status(200).json({
        status: 'redirect',
        paymentUrl: momoResult.payUrl,
        transactionId: momoResult.transactionId
      });
    }
    break;
}

===========================================
WEBHOOK/CALLBACK ROUTES NEEDED:
===========================================

// routes/paymentRoutes.js
router.get('/vnpay/return', handleVNPayReturn);
router.post('/vnpay/ipn', handleVNPayIPN);
router.post('/momo/ipn', handleMoMoIPN);
router.post('/zalopay/callback', handleZaloPayCallback);

*/ 