// Dữ liệu mẫu cho các bộ phận cơ thể
const bodyPartsData = [
  {
    part: "Đầu",
    function: "Chứa não, giúp suy nghĩ và điều khiển cơ thể.",
    image: "https://example.com/images/head.png",
    // audio: "https://example.com/audio/head.mp3" // Commented out as requested
  },
  {
    part: "Tay",
    function: "Dùng để cầm nắm, viết, vẽ.",
    image: "https://example.com/images/hand.png",
    // audio: "https://example.com/audio/hand.mp3"
  },
  {
    part: "Chân",
    function: "Giúp đi, chạy, đá bóng.",
    image: "https://example.com/images/leg.png",
    // audio: "https://example.com/audio/leg.mp3"
  },
  {
    part: "Mắt",
    function: "Dùng để nhìn, quan sát xung quanh.",
    image: "https://example.com/images/eye.png",
    // audio: "https://example.com/audio/eye.mp3"
  },
  {
    part: "Mũi",
    function: "Dùng để ngửi mùi và thở.",
    image: "https://example.com/images/nose.png",
    // audio: "https://example.com/audio/nose.mp3"
  },
  {
    part: "Tai",
    function: "Dùng để nghe âm thanh xung quanh.",
    image: "https://example.com/images/ear.png",
    // audio: "https://example.com/audio/ear.mp3"
  },
  {
    part: "Miệng",
    function: "Dùng để ăn, nói và cười.",
    image: "https://example.com/images/mouth.png",
    // audio: "https://example.com/audio/mouth.mp3"
  }
];

// GET /api/body-parts
const getBodyParts = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: bodyPartsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách bộ phận cơ thể",
      error: error.message
    });
  }
};

// POST /api/check-part
const checkBodyPart = (req, res) => {
  try {
    const { part } = req.body;

    if (!part) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp tên bộ phận cơ thể"
      });
    }

    const bodyPart = bodyPartsData.find(bp => bp.part === part);

    if (!bodyPart) {
      return res.status(400).json({
        success: false,
        message: "Bộ phận cơ thể không hợp lệ",
        correct: false
      });
    }

    res.status(200).json({
      success: true,
      correct: true,
      function: bodyPart.function,
      message: "Chính xác! Bạn đã chọn đúng bộ phận."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi kiểm tra bộ phận cơ thể",
      error: error.message
    });
  }
};

module.exports = {
  getBodyParts,
  checkBodyPart
}; 