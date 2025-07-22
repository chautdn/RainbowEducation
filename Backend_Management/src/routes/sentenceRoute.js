const express = require('express');
const router = express.Router();

// Dữ liệu mẫu cho từ và câu
const sentenceData = [
  {
    word: "Bạn bè",
    sentences: [
      {
        sentence: "Bạn bè chơi vui ở sân",
        audio: null,
        phrases: ["chơi vui", "ở sân"]
      },
      {
        sentence: "Bạn bè giúp nhau học bài",
        audio: null,
        phrases: ["giúp nhau", "học bài"]
      },
      {
        sentence: "Bạn bè cùng đi chơi công viên",
        audio: null,
        phrases: ["cùng đi", "chơi công viên"]
      }
    ]
  },
  {
    word: "Trường học",
    sentences: [
      {
        sentence: "Trường học của em rất đẹp",
        audio: null,
        phrases: ["của em", "rất đẹp"]
      },
      {
        sentence: "Trường học có nhiều cây xanh",
        audio: null,
        phrases: ["có nhiều", "cây xanh"]
      },
      {
        sentence: "Trường học là nơi học tập tốt",
        audio: null,
        phrases: ["là nơi", "học tập tốt"]
      }
    ]
  },
  {
    word: "Trái cây",
    sentences: [
      {
        sentence: "Em thích ăn trái cây ngọt",
        audio: null,
        phrases: ["thích ăn", "ngọt"]
      },
      {
        sentence: "Trái cây có nhiều vitamin",
        audio: null,
        phrases: ["có nhiều", "vitamin"]
      },
      {
        sentence: "Trái cây tươi rất ngon",
        audio: null,
        phrases: ["tươi", "rất ngon"]
      }
    ]
  },
  {
    word: "Gia đình",
    sentences: [
      {
        sentence: "Gia đình em rất hạnh phúc",
        audio: null,
        phrases: ["em", "rất hạnh phúc"]
      },
      {
        sentence: "Gia đình cùng ăn cơm tối",
        audio: null,
        phrases: ["cùng", "ăn cơm tối"]
      }
    ]
  },
  {
    word: "Con vật",
    sentences: [
      {
        sentence: "Con vật trong rừng rất đẹp",
        audio: null,
        phrases: ["trong rừng", "rất đẹp"]
      },
      {
        sentence: "Con vật thích chạy nhảy",
        audio: null,
        phrases: ["thích", "chạy nhảy"]
      }
    ]
  }
];


// GET /api/sentences - Lấy danh sách từ và câu mẫu
router.get('/sentences', (req, res) => {
  try {
    res.json(sentenceData);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// POST /api/check-sentence - Kiểm tra câu đúng
router.post('/check-sentence', (req, res) => {
  try {
    const { word, sentence } = req.body;
    
    if (!word || !sentence) {
      return res.status(400).json({ 
        correct: false, 
        message: 'Thiếu từ hoặc câu' 
      });
    }

    // Tìm từ trong dữ liệu
    const wordData = sentenceData.find(item => item.word === word);
    if (!wordData) {
      return res.status(400).json({ 
        correct: false, 
        message: 'Không tìm thấy từ' 
      });
    }

    // Kiểm tra xem câu có chứa từ gợi ý không
    if (!sentence.toLowerCase().includes(word.toLowerCase())) {
      return res.json({ 
        correct: false, 
        message: 'Câu phải chứa từ gợi ý',
        audio: null
      });
    }

    // Kiểm tra xem câu có đúng cú pháp cơ bản không (có ít nhất 3 từ)
    const words = sentence.trim().split(/\s+/);
    if (words.length < 3) {
      return res.json({ 
        correct: false, 
        message: 'Câu quá ngắn, hãy viết câu dài hơn',
        audio: null
      });
    }

    // Tìm câu mẫu phù hợp
    const matchingSentence = wordData.sentences.find(item => 
      item.sentence.toLowerCase() === sentence.toLowerCase()
    );

    if (matchingSentence) {
      return res.json({ 
        correct: true, 
        message: 'Câu hoàn hảo!',
        audio: matchingSentence.audio || null
      });
    } else {
      // Nếu không khớp chính xác, nhưng câu hợp lệ
      return res.json({ 
        correct: true, 
        message: 'Câu hay lắm!',
        audio: wordData.sentences[0].audio || null // Sử dụng audio mẫu
      });
    }

  } catch (error) {
    res.status(500).json({ 
      correct: false, 
      message: 'Lỗi server',
      audio: null
    });
  }
});

module.exports = router; 