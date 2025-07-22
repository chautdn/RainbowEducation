const express = require('express');
const router = express.Router();

// Dữ liệu mẫu cho truyện ngắn
const storyData = [
  {
    storyId: 1,
    title: "Bé Mai ở Công Viên",
    sentences: [
      {
        text: "Bé Mai đi công viên.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Ở đó, Mai thấy nhiều hoa đẹp.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Mai vui vẻ nhảy múa.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Bạn Tèo cùng chơi với Mai.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Cả hai cười thật to.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      }
    ],
    questions: [
      {
        question: "Ai?",
        options: ["Bé Mai", "Bé Lan", "Cô giáo"],
        correct: "Bé Mai",
        audio: null
      },
      {
        question: "Ở đâu?",
        options: ["Công viên", "Nhà", "Trường học"],
        correct: "Công viên",
        audio: null
      },
      {
        question: "Làm gì?",
        options: ["Nhảy múa", "Đọc sách", "Ăn cơm"],
        correct: "Nhảy múa",
        audio: null
      }
    ]
  },
  {
    storyId: 2,
    title: "Chú Mèo Con",
    sentences: [
      {
        text: "Chú mèo con ngủ trên ghế.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Mèo có bộ lông màu cam.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Mèo thích uống sữa.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Mèo chạy đuổi theo chuột.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      }
    ],
    questions: [
      {
        question: "Ai?",
        options: ["Chú mèo con", "Chú chó", "Chú gà"],
        correct: "Chú mèo con",
        audio: null
      },
      {
        question: "Ở đâu?",
        options: ["Trên ghế", "Dưới bàn", "Trong bếp"],
        correct: "Trên ghế",
        audio: null
      },
      {
        question: "Làm gì?",
        options: ["Uống sữa", "Ăn cá", "Ngủ"],
        correct: "Uống sữa",
        audio: null
      }
    ]
  },
  {
    storyId: 3,
    title: "Bạn Hoa và Cây Xanh",
    sentences: [
      {
        text: "Bạn Hoa trồng cây trong vườn.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Cây xanh mọc cao lên.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Hoa tưới nước cho cây.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Cây ra hoa đẹp.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      }
    ],
    questions: [
      {
        question: "Ai?",
        options: ["Bạn Hoa", "Bạn Mai", "Bạn Lan"],
        correct: "Bạn Hoa",
        audio: null
      },
      {
        question: "Ở đâu?",
        options: ["Trong vườn", "Trong nhà", "Trên sân thượng"],
        correct: "Trong vườn",
        audio: null
      },
      {
        question: "Làm gì?",
        options: ["Tưới nước", "Đọc sách", "Chơi game"],
        correct: "Tưới nước",
        audio: null
      }
    ]
  },
  {
    storyId: 4,
    title: "Bữa Ăn Gia Đình",
    sentences: [
      {
        text: "Gia đình ngồi ăn cơm tối.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Mẹ nấu món canh ngon.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Bố kể chuyện vui.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      },
      {
        text: "Em bé cười thật to.",
        image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        audio: null
      }
    ],
    questions: [
      {
        question: "Ai?",
        options: ["Gia đình", "Bạn bè", "Hàng xóm"],
        correct: "Gia đình",
        audio: null
      },
      {
        question: "Ở đâu?",
        options: ["Trong nhà", "Ngoài vườn", "Ở trường"],
        correct: "Trong nhà",
        audio: null
      },
      {
        question: "Làm gì?",
        options: ["Ăn cơm", "Xem tivi", "Đọc sách"],
        correct: "Ăn cơm",
        audio: null
      }
    ]
  }
];

// GET /api/stories - Lấy danh sách truyện
router.get('/stories', (req, res) => {
  try {
    res.json(storyData);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/check-answer - Kiểm tra câu trả lời
router.post('/check-answer', (req, res) => {
  try {
    const { storyId, question, answer } = req.body;
    
    if (!storyId || !question || !answer) {
      return res.status(400).json({ 
        correct: false, 
        message: 'Thiếu thông tin câu trả lời' 
      });
    }

    // Tìm truyện
    const story = storyData.find(s => s.storyId === parseInt(storyId));
    if (!story) {
      return res.status(400).json({ 
        correct: false, 
        message: 'Không tìm thấy truyện' 
      });
    }

    // Tìm câu hỏi
    const questionObj = story.questions.find(q => q.question === question);
    if (!questionObj) {
      return res.status(400).json({ 
        correct: false, 
        message: 'Không tìm thấy câu hỏi' 
      });
    }

    // Kiểm tra câu trả lời
    const isCorrect = questionObj.correct.toLowerCase() === answer.toLowerCase();
    
    // Debug logging
    console.log('Answer check:', {
      storyId,
      question: questionObj.question,
      userAnswer: answer,
      correctAnswer: questionObj.correct,
      isCorrect
    });
    
    if (isCorrect) {
      return res.json({ 
        correct: true, 
        message: 'Chính xác! Bạn trả lời rất giỏi!',
        audio: questionObj.audio || null
      });
    } else {
      return res.json({ 
        correct: false, 
        message: 'Chưa đúng rồi! Hãy thử lại nhé!',
        audio: null,
        correctAnswer: questionObj.correct
      });
    }

  } catch (error) {
    console.error('Error in check-answer:', error);
    res.status(500).json({ 
      correct: false, 
      message: 'Lỗi server khi kiểm tra câu trả lời.',
      audio: null
    });
  }
});

module.exports = router; 