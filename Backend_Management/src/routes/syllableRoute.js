const express = require('express');
const router = express.Router();
const syllableData = require('../models/syllableSeed');

// GET /api/syllables
router.get('/syllables', (req, res) => {
  res.json(syllableData);
});

// POST /api/check-word
router.post('/check-word', (req, res) => {
  try {
    const { syllable, word } = req.body;
    
    if (!syllable || !word) {
      return res.status(400).json({ 
        correct: false, 
        message: 'Thiếu dữ liệu syllable hoặc word.' 
      });
    }

    const found = syllableData.find(s => s.syllable === syllable);
    if (!found) {
      return res.status(400).json({ 
        correct: false, 
        message: `Vần '${syllable}' không hợp lệ.` 
      });
    }

    // Tìm từ với việc bỏ qua dấu thanh
    const wordObj = found.words.find(w => {
      // Chuẩn hóa từ bằng cách bỏ dấu thanh
      const normalizeWord = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      };
      return normalizeWord(w.word) === normalizeWord(word) || w.word === word;
    });

    if (!wordObj) {
      return res.status(400).json({ 
        correct: false, 
        message: `Từ '${word}' không hợp lệ cho vần '${syllable}'.` 
      });
    }

    res.json({ 
      correct: true, 
      image: wordObj.image,
      message: 'Ghép từ đúng!'
    });
  } catch (error) {
    console.error('Error in check-word:', error);
    res.status(500).json({ 
      correct: false, 
      message: 'Lỗi server khi kiểm tra từ.' 
    });
  }
});

module.exports = router; 