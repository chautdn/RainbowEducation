const express = require('express');
const router = express.Router();

// In-memory weather data
const weatherData = [
  {
    id: 1,
    name: 'Nắng',
    description: 'Đội mũ và đeo kính râm để bảo vệ khỏi ánh nắng.',
    image: 'https://cdn.petrotimes.vn/stores/news_dataimages/ductrong/082018/12/21/in_article/thoi-tiet-ngay-138-bac-bo-troi-nang-nong.jpg',
    clothing: ['Sunglasses', 'Hat']
  },
  {
    id: 2,
    name: 'Mưa',
    description: 'Mặc áo mưa và đi ủng để không bị ướt.',
    image: 'https://images.pexels.com/photos/459451/pexels-photo-459451.jpeg',
    clothing: ['Raincoat', 'Boots']
  },
  {
    id: 3,
    name: 'Gió',
    description: 'Mặc áo khoác để giữ ấm khi trời nhiều gió.',
    image: 'https://images.pexels.com/photos/418682/pexels-photo-418682.jpeg',
    clothing: ['Jacket']
  },
  {
    id: 4,
    name: 'Tuyết',
    description: 'Mặc áo ấm và đeo găng tay để giữ ấm khi có tuyết.',
    image: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg',
    clothing: ['Heavy Coat', 'Gloves']
  }
];

// GET /api/weather - return all weather data
router.get('/weather', (req, res) => {
  res.json(weatherData);
});

// POST /api/check-clothing - check if clothing matches weather
router.post('/check-clothing', (req, res) => {
  const { weatherId, clothing } = req.body;
  const weather = weatherData.find(w => w.id === weatherId);
  if (!weather) {
    return res.status(400).json({ error: 'Invalid weather ID.' });
  }
  if (typeof clothing !== 'string') {
    return res.status(400).json({ error: 'Clothing must be a string.' });
  }
  const correct = weather.clothing.includes(clothing);
  res.json({
    correct,
    description: weather.description
  });
});

module.exports = router; 