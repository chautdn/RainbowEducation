import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stage, Layer, Rect, Circle, RegularPolygon, Text } from 'react-konva';
import axiosInstance from '../utils/AxiosInstance';
import { API_URL } from '../utils/Constant';

const canvasWidth = 400;
const canvasHeight = 300;
const answerAreaWidth = 300;
const answerAreaHeight = 300;

const labelColors = [
  '#fbbf24', // yellow
  '#60a5fa', // blue
  '#34d399', // green
  '#f472b6', // pink
];

const ShapeMatcher = () => {
  const [shapes, setShapes] = useState([]);
  const [labels, setLabels] = useState([]);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const [isOverShape, setIsOverShape] = useState(false);
  const shapeStageRef = useRef();
  const answerStageRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`${API_URL}/shapes`).then(res => {
      setShapes(res.data);
      setLabels(res.data.map((shape, idx) => ({
        id: shape.id,
        name: shape.name,
        x: 20,
        y: 30 + idx * 60,
        originalX: 20,
        originalY: 30 + idx * 60,
        color: labelColors[idx % labelColors.length],
        isDragging: false
      })));
      setCurrentShapeIndex(0);
      setShowBadge(false);
      setFeedback('');
    });
  }, []);

  // Effect to reset labels when shape changes
  useEffect(() => {
    setLabels(prevLabels => prevLabels.map(l => ({
      ...l,
      x: l.originalX,
      y: l.originalY,
      isDragging: false
    })));
  }, [currentShapeIndex]);

  const handleDragStart = (id) => {
    setLabels(labels => labels.map(l => l.id === id ? { ...l, isDragging: true } : l));
    setFeedback('');
  };

  const handleDragMove = (e, label) => {
    const { x, y } = e.target.position();
    setLabels(labels =>
      labels.map(l =>
        l.id === label.id ? { ...l, x, y } : l
      )
    );
    setIsOverShape(true);
  };

  const handleDragEnd = (e, label) => {
    const shape = shapes[currentShapeIndex];
    const isCorrectMatch = label.name === shape.name;

    if (isCorrectMatch) {
      setFeedback(`Giỏi lắm! ${label.name} - ${shape.description}`);
      setTimeout(() => {
        if (currentShapeIndex === shapes.length - 1) {
          setShowBadge(true);
        } else {
          setCurrentShapeIndex(idx => idx + 1);
          setFeedback('');
        }
      }, 1500);
    } else {
      setFeedback('Thử lại nhé! Kéo tên hình đúng vào hình tương ứng.');
    }

    setLabels(prevLabels =>
      prevLabels.map(l => ({
        ...l,
        x: l.originalX,
        y: l.originalY,
        isDragging: false
      }))
    );
    setIsOverShape(false);
  };

  const handleReset = () => {
    setLabels(labels => labels.map((l) => ({
      ...l,
      x: l.originalX,
      y: l.originalY,
      isDragging: false
    })));
    setCurrentShapeIndex(0);
    setShowBadge(false);
    setFeedback('');
  };

  const currentShape = shapes[currentShapeIndex];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 py-6">
      {/* Back button */}
      <div className="w-full max-w-6xl flex justify-start mb-4">
        <button
          onClick={() => navigate('/game-lessons/games/1')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          <span className="text-xl">←</span>
          <span>Quay lại danh sách game</span>
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl w-full">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-8 text-center">
          🎯 Trò Chơi Ghép Hình 🎯
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Shape Display Area */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Vùng Hình Ảnh</h2>
            <div className="border-4 border-purple-300 rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-purple-50">
              <Stage
                width={canvasWidth}
                height={canvasHeight}
                ref={shapeStageRef}
                className="rounded-xl"
              >
                <Layer>
                  {currentShape && (() => {
                    let shapeNode = null;
                    const glow = isOverShape;

                    if (currentShape.name === 'Hình vuông') {
                      const size = 120;
                      shapeNode = (
                        <Rect
                          x={canvasWidth / 2 - size / 2}
                          y={canvasHeight / 2 - size / 2}
                          width={size}
                          height={size}
                          fill={currentShape.color}
                          cornerRadius={15}
                          shadowBlur={glow ? 20 : 10}
                          shadowColor={glow ? '#facc15' : '#a78bfa'}
                          stroke={glow ? '#facc15' : '#8b5cf6'}
                          strokeWidth={glow ? 4 : 2}
                        />
                      );
                    } else if (currentShape.name === 'Hình tròn') {
                      shapeNode = (
                        <Circle
                          x={canvasWidth / 2}
                          y={canvasHeight / 2}
                          radius={70}
                          fill={currentShape.color}
                          shadowBlur={glow ? 20 : 10}
                          shadowColor={glow ? '#facc15' : '#a78bfa'}
                          stroke={glow ? '#facc15' : '#8b5cf6'}
                          strokeWidth={glow ? 4 : 2}
                        />
                      );
                    } else if (currentShape.name === 'Hình tam giác') {
                      shapeNode = (
                        <RegularPolygon
                          x={canvasWidth / 2}
                          y={canvasHeight / 2}
                          sides={3}
                          radius={80}
                          fill={currentShape.color}
                          rotation={0}
                          shadowBlur={glow ? 20 : 10}
                          shadowColor={glow ? '#facc15' : '#a78bfa'}
                          stroke={glow ? '#facc15' : '#8b5cf6'}
                          strokeWidth={glow ? 4 : 2}
                        />
                      );
                    } else if (currentShape.name === 'Hình chữ nhật') {
                      const w = 160, h = 80;
                      shapeNode = (
                        <Rect
                          x={canvasWidth / 2 - w / 2}
                          y={canvasHeight / 2 - h / 2}
                          width={w}
                          height={h}
                          fill={currentShape.color}
                          cornerRadius={15}
                          shadowBlur={glow ? 20 : 10}
                          shadowColor={glow ? '#facc15' : '#a78bfa'}
                          stroke={glow ? '#facc15' : '#8b5cf6'}
                          strokeWidth={glow ? 4 : 2}
                        />
                      );
                    }
                    return shapeNode;
                  })()}
                </Layer>
              </Stage>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-gray-700">
                Hình số {currentShapeIndex + 1} / {shapes.length}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center lg:py-20">
            <div className="text-6xl animate-pulse">⬅️</div>
          </div>

          {/* Answer Area */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Vùng Đáp Án</h2>
            <div className="border-4 border-green-300 rounded-2xl p-4 bg-gradient-to-br from-green-50 to-yellow-50">
              <Stage
                width={answerAreaWidth}
                height={answerAreaHeight}
                ref={answerStageRef}
                className="rounded-xl"
              >
                <Layer>
                  {labels.map((label) => (
                    <Text
                      key={label.id}
                      text={label.name}
                      x={label.x}
                      y={label.y}
                      fontSize={24}
                      fontStyle="bold"
                      fill={label.color}
                      draggable
                      onDragStart={() => handleDragStart(label.id)}
                      onDragMove={e => handleDragMove(e, label)}
                      onDragEnd={e => handleDragEnd(e, label)}
                      shadowBlur={label.isDragging ? 15 : 5}
                      shadowColor={label.isDragging ? '#facc15' : '#666'}
                      width={260}
                      align="center"
                      perfectDrawEnabled={false}
                      opacity={label.isDragging ? 0.8 : 1}
                      fontFamily="Arial, sans-serif"
                      padding={10}
                      cornerRadius={10}
                      stroke={label.isDragging ? '#facc15' : 'transparent'}
                      strokeWidth={2}
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Kéo tên hình vào hình tương ứng!</p>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-8 flex flex-col items-center">
          {feedback && (
            <div className={`text-center text-xl font-bold p-4 rounded-2xl shadow-lg transition-all duration-300 max-w-2xl ${feedback.startsWith('Giỏi')
                ? 'text-green-700 bg-green-100 border-2 border-green-300'
                : 'text-red-600 bg-red-100 border-2 border-red-300'
              }`}>
              {feedback}
            </div>
          )}

          <button
            className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white text-xl rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={handleReset}
          >
            🔄 Chơi lại
          </button>
        </div>
      </div>

      {/* Success Badge */}
      {showBadge && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-12 flex flex-col items-center shadow-2xl border-4 border-yellow-300 max-w-md mx-4">
            <div className="text-6xl mb-6 animate-bounce">🏆</div>
            <div className="text-3xl font-bold text-blue-700 mb-4 text-center">Xuất sắc!</div>
            <div className="text-lg text-gray-700 mb-6 text-center">
              Bạn đã ghép đúng tất cả {shapes.length} hình!
            </div>
            <button
              className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white text-xl rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={handleReset}
            >
              🎮 Chơi lại
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ShapeMatcher;