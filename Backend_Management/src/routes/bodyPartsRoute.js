const express = require('express');
const router = express.Router();
const bodyPartsController = require('../controllers/bodyPartsController');

// GET /api/body-parts - Lấy danh sách các bộ phận cơ thể
router.get('/body-parts', bodyPartsController.getBodyParts);

// POST /api/check-part - Kiểm tra bộ phận được chọn
router.post('/check-part', bodyPartsController.checkBodyPart);

module.exports = router; 