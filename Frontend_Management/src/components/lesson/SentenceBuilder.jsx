"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { API_URL } from "../../components/utils/Constant"

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000) // Tự động đóng sau 3 giây

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`px-6 py-4 rounded-lg shadow-lg text-white font-semibold flex items-center gap-3 ${
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
      }`}>
        <span className="text-2xl">🏆</span>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 text-xl"
        >
          ×
        </button>
      </div>
    </div>
  )
}

function PhraseCard({ phrase, onDrop }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "PHRASE",
      item: { phrase },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [phrase],
  )

  return (
    <div
      ref={drag}
      className={`cursor-grab select-none text-lg font-bold rounded-xl px-4 py-3 mb-3 shadow-lg bg-gradient-to-br from-blue-300 to-purple-400 border-2 border-purple-500 text-white transition-all duration-300 transform hover:scale-105 ${isDragging ? "opacity-40 rotate-3" : "opacity-100"}`}
      tabIndex={0}
      aria-label={`Kéo cụm từ ${phrase}`}
    >
      {phrase}
    </div>
  )
}

function SentenceDropZone({ word, onDrop, currentSentence, onInputChange }) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "PHRASE",
      drop: (item) => onDrop(item.phrase),
      canDrop: () => true,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onDrop],
  )

  return (
    <div
      ref={drop}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-3 px-6 py-8 min-h-[120px] shadow-lg transition-all duration-300 transform hover:scale-102
    ${isOver && canDrop
          ? "border-green-500 bg-gradient-to-br from-green-100 to-green-200 shadow-green-200 scale-105"
          : "border-blue-300 bg-gradient-to-br from-white to-blue-50 hover:shadow-blue-200"
        }
  `}
      tabIndex={0}
      aria-label="Khu vực tạo câu"
    >
      <span className="text-xl font-bold text-blue-700 mb-4">Tạo câu với từ: <span className="text-purple-600">{word}</span></span>
      <textarea
        value={currentSentence}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Viết câu của bạn ở đây..."
        className="w-full p-4 text-lg border-2 border-blue-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
        rows={3}
        style={{ minHeight: '100px' }}
      />
    </div>
  )
}

function ProgressBar({ value, max }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-6 mb-6 shadow-inner">
      <div
        className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 h-6 rounded-full flex items-center justify-end pr-3 transition-all duration-500 shadow-lg"
        style={{ width: `${(value / max) * 100}%` }}
      >
        <span className="text-sm font-bold text-white drop-shadow-lg">
          🌟 {value}/{max}
        </span>
      </div>
    </div>
  )
}

function AIResultDisplay({ result }) {
  if (!result) return null;

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600 bg-green-100 border-green-300';
    if (score >= 7) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (score >= 5) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getCreativityColor = (creativity) => {
    if (creativity >= 8) return 'text-purple-600 bg-purple-100 border-purple-300';
    if (creativity >= 6) return 'text-pink-600 bg-pink-100 border-pink-300';
    return 'text-gray-600 bg-gray-100 border-gray-300';
  };

  return (
    <div className="mt-4 p-4 rounded-xl border-2 shadow-lg bg-white/90">
      {/* Score và Creativity */}
      <div className="flex justify-center gap-6 mb-4">
        <div className={`px-4 py-2 rounded-lg border-2 ${getScoreColor(result.score)}`}>
          <div className="text-center">
            <div className="text-2xl font-bold">⭐ {result.score}/10</div>
            <div className="text-sm">Điểm số</div>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-lg border-2 ${getCreativityColor(result.creativity)}`}>
          <div className="text-center">
            <div className="text-2xl font-bold">💫 {result.creativity}/10</div>
            <div className="text-sm">Sáng tạo</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex justify-center gap-2 mb-4">
        {result.isPerfect && (
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            🌟 Hoàn hảo
          </span>
        )}
        {result.isCreative && (
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            💫 Sáng tạo
          </span>
        )}
      </div>

      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-bold text-blue-700 mb-2">💡 Gợi ý cải thiện:</h4>
          <ul className="space-y-1">
            {result.suggestions.map((suggestion, index) => (
              <li key={index} className="text-blue-600 flex items-center gap-2">
                <span className="text-blue-400">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SentenceBuilder() {
  const navigate = useNavigate()
  const [words, setWords] = useState([])
  const [currentWord, setCurrentWord] = useState(null)
  const [currentSentence, setCurrentSentence] = useState("")
  const [feedback, setFeedback] = useState("")
  const [progress, setProgress] = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [audioUrl, setAudioUrl] = useState("")
  const [aiResult, setAiResult] = useState(null) // Thêm state cho AI result

  useEffect(() => {
    fetch(`${API_URL}/sentences`)
      .then((res) => res.json())
      .then((data) => {
        setWords(data)
        setCurrentWord(data[0] || null)
      })
      .catch((error) => {
        console.error("Error fetching sentences:", error)
      })
  }, [])

  useEffect(() => {
    // Lưu vào sessionStorage
    sessionStorage.setItem("sentence-progress", progress)
    if (progress > 0 && progress % 3 === 0) {
      setShowBadge(true)
      // Tự động ẩn toast sau 3 giây
      setTimeout(() => {
        setShowBadge(false)
      }, 3000)
    }
  }, [progress])

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Xóa tiến trình khi rời khỏi game
      sessionStorage.removeItem("sentence-progress")
    }
  }, [])

  const handleDrop = (phrase) => {
    // Thêm cụm từ vào câu hiện tại
    const newSentence = currentSentence ? `${currentSentence} ${phrase}` : phrase
    setCurrentSentence(newSentence)
  }

  const handleInputChange = (value) => {
    setCurrentSentence(value)
  }

  const handleCheckSentence = () => {
    if (!currentWord || !currentSentence.trim()) {
      setFeedback("Hãy viết một câu hoàn chỉnh!")
      setTimeout(() => setFeedback(""), 2000)
      return
    }

    setDisabled(true)
    setAiResult(null) // Reset AI result

    fetch(`${API_URL}/check-sentence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        word: currentWord.word, 
        sentence: currentSentence.trim() 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('AI Response:', data)
        
        if (data.correct) {
          setAiResult(data) // Lưu kết quả AI
          
          // Phản hồi dựa trên score
          let message = data.message
          if (data.isPerfect) {
            message += " 🌟 Hoàn hảo!"
          } else if (data.isCreative) {
            message += " 💫 Rất sáng tạo!"
          }

          setFeedback(message)
          setProgress((p) => p + 1)
          setAudioUrl(data.audio || "")

          // Phát âm thanh thành công - tạm thời tắt để tránh lỗi
          // const audio = document.getElementById("success-audio")
          // if (audio) audio.play()

          // Phát âm thanh câu - tạm thời tắt để tránh lỗi
          // if (data.audio) {
          //   const sentenceAudio = new Audio(data.audio)
          //   sentenceAudio.play()
          // }

          // Reset câu
          setCurrentSentence("")
        } else {
          setAiResult(data) // Lưu kết quả AI ngay cả khi sai
          setFeedback(data.message)
        }
      })
      .catch((error) => {
        console.error("API Error:", error)
        setFeedback("Có lỗi xảy ra! Hãy thử lại! 🔄")
      })
      .finally(() =>
        setTimeout(() => {
          setFeedback("")
          setDisabled(false)
        }, 3000), // Tăng thời gian hiển thị để đọc suggestions
      )
  }

  const handleNextWord = () => {
    const idx = words.findIndex((w) => w.word === currentWord?.word)
    if (idx < words.length - 1) {
      setCurrentWord(words[idx + 1])
    } else {
      setCurrentWord(words[0])
    }
    setCurrentSentence("")
  }

  const current = currentWord

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Tạm thời comment audio để tránh lỗi */}
      {/* <audio id="success-audio" src="https://cdn.pixabay.com/audio/2022/07/26/audio_1b2fa5fae2.mp3" /> */}
      
      {/* Nút quay trở về */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => navigate('/game-lessons')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          <span className="text-xl">←</span>
          <span>Quay lại</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start w-full border border-purple-200">
        {/* Sidebar cụm từ */}
        <div className="flex flex-col items-center md:w-1/3 w-full bg-gradient-to-b from-blue-100 to-purple-100 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">✨ Kéo cụm từ ✨</h2>
          {current?.sentences[0]?.phrases?.map((phrase, index) => (
            <PhraseCard key={index} phrase={phrase} onDrop={handleDrop} />
          ))}
        </div>

        {/* Khu vực tạo câu */}
        <div className="flex-1 w-full">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
            📝 Tạo Câu Vui – Nói Lời Hay 📝
          </h1>
          <ProgressBar value={progress} max={15} />
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-blue-700">
              Từ gợi ý: <span className="text-purple-600 font-bold text-xl">{currentWord?.word}</span>
            </span>
            <button
              onClick={handleNextWord}
              disabled={disabled}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              🔄 Từ tiếp →
            </button>
          </div>

          <SentenceDropZone
            word={currentWord?.word}
            onDrop={handleDrop}
            currentSentence={currentSentence}
            onInputChange={handleInputChange}
          />

          {/* Nút kiểm tra */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCheckSentence}
              disabled={disabled || !currentSentence.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xl"
            >
              🎯 Kiểm tra câu
            </button>
          </div>

          {/* Phản hồi */}
          {feedback && (
            <div
              className={`mt-6 text-center text-xl font-bold p-4 rounded-2xl shadow-lg fade-in ${
                feedback.includes("Tuyệt vời") ||
                feedback.includes("Chính xác") ||
                feedback.includes("Hoàn hảo") ||
                feedback.includes("Đúng rồi") ||
                feedback.includes("Xuất sắc")
                  ? "text-green-600 bg-green-100 border-2 border-green-300"
                  : "text-red-500 bg-red-100 border-2 border-red-300"
              }`}
            >
              {feedback}
            </div>
          )}

          {/* Hướng dẫn */}
          <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-300">
            <h3 className="text-lg font-bold text-orange-700 mb-2">💡 Hướng dẫn:</h3>
            <ul className="text-orange-600 space-y-1">
              <li>• Kéo cụm từ từ bên trái vào câu</li>
              <li>• Hoặc tự viết câu hoàn chỉnh</li>
              <li>• Câu phải chứa từ gợi ý</li>
              <li>• Nhấn "Kiểm tra câu" khi hoàn thành</li>
            </ul>
          </div>
        </div>

        {/* Toast thông báo */}
        {showBadge && (
          <Toast 
            message="Nhà Đặt Câu Giỏi! Bạn đã hoàn thành 3 câu liên tiếp! Tiếp tục phát huy nhé!" 
            type="success" 
            onClose={() => setShowBadge(false)} 
          />
        )}
      </div>
    </DndProvider>
  )
} 