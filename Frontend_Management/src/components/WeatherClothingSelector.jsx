import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './utils/AxiosInstance';
import { API_URL } from './utils/Constant';

const clothingImages = {
  'Sunglasses': 'https://cdn-icons-png.flaticon.com/512/168/168726.png',
  'Hat': 'https://cdn-icons-png.flaticon.com/512/1785/1785366.png',
  'Raincoat': 'https://cdn-icons-png.flaticon.com/512/5173/5173732.png',
  'Boots': 'https://cdn-icons-png.flaticon.com/512/924/924166.png',
  'Jacket': 'https://cdn-icons-png.flaticon.com/512/1926/1926322.png',
  'Heavy Coat': 'https://cdn-icons-png.flaticon.com/512/13542/13542572.png',
  'Gloves': 'https://cdn-icons-png.flaticon.com/512/3735/3735621.png',
};

const clothingLabels = {
  'Sunglasses': 'Kính râm',
  'Hat': 'Mũ',
  'Raincoat': 'Áo mưa',
  'Boots': 'Ủng',
  'Jacket': 'Áo khoác',
  'Heavy Coat': 'Áo ấm',
  'Gloves': 'Găng tay',
};

const WeatherClothingSelector = () => {
  const [weatherList, setWeatherList] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [progress, setProgress] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [correctClothing, setCorrectClothing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`${API_URL}/weather`).then(res => {
      setWeatherList(res.data);
      setCurrentIdx(0);
      setSelected(null);
      setFeedback('');
      setProgress(0);
      setShowBadge(false);
      setCorrectClothing([]);
      sessionStorage.removeItem('weather-progress');
    });
  }, []);

  useEffect(() => {
    sessionStorage.setItem('weather-progress', progress);
    if (progress === 4) {
      setTimeout(() => setShowBadge(true), 800);
    }
  }, [progress]);

  if (!weatherList.length) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  const weather = weatherList[currentIdx];
  const allClothing = Array.from(new Set(weatherList.flatMap(w => w.clothing)));

  const handleSelect = (item) => {
    setSelected(item);
    axiosInstance.post(`${API_URL}/check-clothing`, {
      weatherId: weather.id,
      clothing: item
    }).then(res => {
      if (res.data.correct) {
        setFeedback(`Giỏi lắm! ${weather.name}: ${weather.description}`);
        setCorrectClothing(prev => [...prev, item]);
        setProgress(p => p + 1);
        if (currentIdx < weatherList.length - 1) {
          setTimeout(() => {
            setCurrentIdx(idx => idx + 1);
            setSelected(null);
            setFeedback('');
          }, 1000);
        } else {
          setTimeout(() => setShowBadge(true), 1000);
        }
      } else {
        setFeedback('Chưa đúng, hãy thử lại nhé!');
      }
    });
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setFeedback('');
    setProgress(0);
    setShowBadge(false);
    setCorrectClothing([]);
    sessionStorage.removeItem('weather-progress');
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-blue-100 to-yellow-100 py-6">
      {/* Back button */}
      <div className="w-full max-w-4xl flex justify-start mb-4">
        <button
          onClick={() => navigate('/game-lessons/games/9')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          <span className="text-xl">←</span>
          <span>Quay lại danh sách game</span>
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-6xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-700 drop-shadow">Khám Phá Thời Tiết – Chọn Trang Phục Phù Hợp</h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-6">
          {/* Weather image and info */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-[440px] h-[320px] flex items-center justify-center mb-4">
              <img src={weather.image} alt={weather.name} className="w-[320px] h-[260px] object-contain" />
            </div>
            <div className="text-2xl font-bold text-purple-700 mb-2">{weather.name}</div>
            <div className="text-lg text-gray-700 mb-4 text-center">{weather.description}</div>
          </div>
          {/* Clothing options */}
          <div className="flex flex-col items-center w-full">
            <div className="grid grid-cols-3 gap-10">
              {allClothing.map(item => (
                <button
                  key={item}
                  onClick={() => handleSelect(item)}
                  disabled={!!selected && selected !== item}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg border-4 transition-all duration-200 text-lg font-bold
                    ${selected === item && feedback.startsWith('Giỏi') ? 'border-green-400 bg-green-100' :
                      selected === item && feedback ? 'border-red-400 bg-red-100' :
                      'border-blue-200 bg-white hover:border-yellow-400 hover:bg-yellow-50'}
                    ${correctClothing.includes(item) ? 'opacity-60' : ''}`}
                >
                  <img src={clothingImages[item] || 'https://cdn-icons-png.flaticon.com/512/168/168726.png'} alt={item} className="w-20 h-20 mb-2" />
                  {clothingLabels[item] || item}
                </button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Chọn trang phục phù hợp với thời tiết!</p>
            </div>
          </div>
        </div>
        {/* Progress bar and feedback */}
        <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
          <div className="bg-green-400 h-6 rounded-full transition-all duration-500" style={{ width: `${(progress/4)*100}%` }}></div>
        </div>
        <div className="text-center text-lg font-semibold text-green-700 mb-2">{progress}/4 đã chọn đúng</div>
        {feedback && (
          <div className={`text-xl font-bold mb-2 ${feedback.startsWith('Giỏi') ? 'text-green-600' : 'text-red-500'}`}>{feedback}</div>
        )}
        <div className="flex gap-4 mt-4 justify-center">
          <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-xl rounded-full font-bold shadow" onClick={handleReset}>Chơi lại</button>
        </div>
      </div>
      {showBadge && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center shadow-2xl border-4 border-yellow-300">
            <div className="text-4xl mb-4">🏅</div>
            <div className="text-2xl font-bold text-blue-700 mb-2">Nhà Khám Phá Thời Tiết Giỏi!</div>
            <div className="text-lg text-gray-700 mb-4">Bạn đã chọn đúng trang phục cho tất cả các loại thời tiết!</div>
            <button className="px-6 py-2 bg-green-400 hover:bg-green-500 text-xl rounded-full font-bold shadow" onClick={handleReset}>Chơi lại</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherClothingSelector; 