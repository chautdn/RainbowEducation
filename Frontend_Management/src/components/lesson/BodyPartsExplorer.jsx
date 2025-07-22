import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/AxiosInstance';

const BodyPartsExplorer = () => {
  const navigate = useNavigate();
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exploredParts, setExploredParts] = useState(new Set());
  const [hoveredPart, setHoveredPart] = useState(null);
  const [modalTimer, setModalTimer] = useState(3);

  // Lấy dữ liệu từ sessionStorage khi component mount
  useEffect(() => {
    const savedExplored = sessionStorage.getItem('bodyPartsExplored');
    
    if (savedExplored) {
      setExploredParts(new Set(JSON.parse(savedExplored)));
    }
  }, []);

  // Lưu danh sách đã khám phá vào sessionStorage
  useEffect(() => {
    sessionStorage.setItem('bodyPartsExplored', JSON.stringify([...exploredParts]));
  }, [exploredParts]);

  // Fetch body parts data
  useEffect(() => {
    const fetchBodyParts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/body-parts');
        setBodyParts(response.data.data);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại!');
        console.error('Error fetching body parts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBodyParts();
  }, []);

  // Xử lý click vào bộ phận cơ thể
  const handlePartClick = async (part) => {
    try {
      const response = await axiosInstance.post('/api/check-part', {
        part: part.part
      });

      if (response.data.correct) {
        setSelectedPart(part);
        
        // Tự động đóng modal sau 3 giây với đếm ngược
        setModalTimer(3);
        const timer = setInterval(() => {
          setModalTimer(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setSelectedPart(null);
              return 3;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Cập nhật danh sách đã khám phá
        if (!exploredParts.has(part.part)) {
          setExploredParts(prev => new Set([...prev, part.part]));
        }
      }
    } catch (err) {
      console.error('Error checking body part:', err);
      setError('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  // Đóng thông tin bộ phận
  const closePartInfo = () => {
    setSelectedPart(null);
  };

  // Reset danh sách đã khám phá
  const resetExplored = () => {
    setExploredParts(new Set());
    sessionStorage.removeItem('bodyPartsExplored');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            🧠 Khám Phá Cơ Thể
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Biết Tên, Hiểu Chức Năng
          </p>
          
          {/* Action Buttons */}
          <div className="mb-4 flex justify-center space-x-4">
            <button
              onClick={resetExplored}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition-colors shadow-lg"
            >
              🔄 Làm lại tất cả
            </button>
            <button
              onClick={() => navigate('/game-lessons')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold transition-colors shadow-lg"
            >
              ← Quay lại Game Zone
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Interactive Body Image */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              👤 Click vào các bộ phận để khám phá
            </h2>
            
            <div className="relative max-w-md mx-auto">
              {/* Simple Human Body SVG */}
              <svg 
                viewBox="0 0 200 400" 
                className="w-full h-auto"
                style={{ maxHeight: '500px' }}
              >
                {/* Head */}
                <circle
                  cx="100"
                  cy="50"
                  r="30"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Đầu' ? 'fill-yellow-300 stroke-4 stroke-blue-500' :
                    exploredParts.has('Đầu') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-2 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Đầu' })}
                  onMouseEnter={() => setHoveredPart('Đầu')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                
                {/* Eyes */}
                <circle
                  cx="90"
                  cy="45"
                  r="3"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Mắt' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Mắt') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-1 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Mắt' })}
                  onMouseEnter={() => setHoveredPart('Mắt')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                <circle
                  cx="110"
                  cy="45"
                  r="3"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Mắt' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Mắt') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-1 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Mắt' })}
                  onMouseEnter={() => setHoveredPart('Mắt')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                
                {/* Nose */}
                <ellipse
                  cx="100"
                  cy="55"
                  rx="4"
                  ry="2"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Mũi' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Mũi') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-1 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Mũi' })}
                  onMouseEnter={() => setHoveredPart('Mũi')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                
                {/* Mouth */}
                <ellipse
                  cx="100"
                  cy="65"
                  rx="8"
                  ry="3"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Miệng' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Miệng') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-1 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Miệng' })}
                  onMouseEnter={() => setHoveredPart('Miệng')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                
                {/* Ears */}
                <ellipse
                  cx="70"
                  cy="50"
                  rx="3"
                  ry="6"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Tai' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Tai') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-1 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Tai' })}
                  onMouseEnter={() => setHoveredPart('Tai')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                <ellipse
                  cx="130"
                  cy="50"
                  rx="3"
                  ry="6"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Tai' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Tai') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-1 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Tai' })}
                  onMouseEnter={() => setHoveredPart('Tai')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                
                {/* Body */}
                <rect
                  x="80"
                  y="80"
                  width="40"
                  height="80"
                  className="fill-blue-100 stroke-2 stroke-blue-400"
                />
                
                {/* Arms */}
                <rect
                  x="60"
                  y="90"
                  width="20"
                  height="60"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Tay' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Tay') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-2 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Tay' })}
                  onMouseEnter={() => setHoveredPart('Tay')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                <rect
                  x="120"
                  y="90"
                  width="20"
                  height="60"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Tay' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Tay') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-2 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Tay' })}
                  onMouseEnter={() => setHoveredPart('Tay')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                
                {/* Legs */}
                <rect
                  x="85"
                  y="160"
                  width="15"
                  height="80"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Chân' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Chân') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-2 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Chân' })}
                  onMouseEnter={() => setHoveredPart('Chân')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                <rect
                  x="100"
                  y="160"
                  width="15"
                  height="80"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredPart === 'Chân' ? 'fill-yellow-300 stroke-2 stroke-blue-500' :
                    exploredParts.has('Chân') ? 'fill-green-200 stroke-2 stroke-green-500' :
                    'fill-blue-100 stroke-2 stroke-blue-400 hover:fill-blue-200'
                  }`}
                  onClick={() => handlePartClick({ part: 'Chân' })}
                  onMouseEnter={() => setHoveredPart('Chân')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
                
                {/* Labels for hover */}
                {hoveredPart && (
                  <text
                    x="100"
                    y="280"
                    textAnchor="middle"
                    className="text-sm font-bold fill-blue-600"
                  >
                    {hoveredPart}
                  </text>
                )}
              </svg>
            </div>
          </div>

          {/* Body Parts List */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              📋 Danh sách các bộ phận
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {bodyParts.map((part, index) => (
                <div
                  key={index}
                  onClick={() => handlePartClick(part)}
                  className={`
                    relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg border-2
                    ${exploredParts.has(part.part) ? 'border-green-400 bg-green-50' : 'border-blue-200 hover:border-blue-400'}
                    ${selectedPart?.part === part.part ? 'border-blue-500 bg-blue-100' : ''}
                  `}
                >
                  {/* Checkmark for explored parts */}
                  {exploredParts.has(part.part) && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      {getBodyPartIcon(part.part)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {part.part}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Click để khám phá chức năng
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Part Info Modal - Floating on page */}
        {selectedPart && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl border-4 border-blue-200 transform transition-all duration-300 hover:scale-105">
              <div className="text-center relative">
                {/* Close button */}
                <button
                  onClick={closePartInfo}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors shadow-lg"
                >
                  ×
                </button>
                
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-5xl shadow-lg">
                  {getBodyPartIcon(selectedPart.part)}
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {selectedPart.part}
                </h2>
                
                {/* Timer indicator */}
                <div className="text-base text-gray-500 mb-3">
                  Tự động đóng sau: {modalTimer} giây
                </div>
                
                <p className="text-gray-700 mb-8 leading-relaxed text-xl">
                  {selectedPart.function}
                </p>
                
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={closePartInfo}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg text-lg"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      console.log(`Phát âm thanh cho: ${selectedPart.part}`);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg text-lg"
                  >
                    🔊 Nghe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get icons for body parts
const getBodyPartIcon = (partName) => {
  const icons = {
    'Đầu': '🧠',
    'Tay': '✋',
    'Chân': '🦵',
    'Mắt': '👁️',
    'Mũi': '👃',
    'Tai': '👂',
    'Miệng': '👄'
  };
  return icons[partName] || '🤔';
};

export default BodyPartsExplorer; 