const express = require('express');
const router = express.Router();

// In-memory shapes data
const shapes = [
  {
    id: 1,
    name: 'Hình vuông',
    description: 'A shape with four equal sides and four right angles.',
    color: 'red',
    x: 100,
    y: 100
  },
  {
    id: 2,
    name: 'Hình tròn',
    description: 'A round shape with no sides or angles.',
    color: 'blue',
    x: 100,
    y: 220
  },
  {
    id: 3,
    name: 'Hình tam giác',
    description: 'A shape with three sides and three angles.',
    color: 'green',
    x: 100,
    y: 340
  },
  {
    id: 4,
    name: 'Hình chữ nhật',
    description: 'A shape with two pairs of equal sides and four right angles.',
    color: 'yellow',
    x: 100,
    y: 460
  }
];

// GET /api/shapes - return all shapes
router.get('/shapes', (req, res) => {
  res.json(shapes);
});

// POST /api/check-match - check if label matches shape
router.post('/check-match', (req, res) => {
  const { shapeId, labelName } = req.body;
  const shape = shapes.find(s => s.id === shapeId);
  if (!shape) {
    return res.status(400).json({ error: 'Invalid shape ID.' });
  }
  if (typeof labelName !== 'string') {
    return res.status(400).json({ error: 'Label name must be a string.' });
  }
  const correct = shape.name === labelName;
  res.json({
    correct,
    description: shape.description
  });
});

module.exports = router; 