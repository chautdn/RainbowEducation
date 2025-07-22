"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
        <span className="text-2xl">📚</span>
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

function StorySentence({ sentence, index, onPlayAudio }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayAudio = () => {
    setIsPlaying(true)
    onPlayAudio(sentence.audio, () => setIsPlaying(false))
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border-2 border-blue-200 hover:border-purple-300 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Hình ảnh minh họa */}
        <div className="flex-shrink-0">
          <img 
            src={sentence.image} 
            alt={`Câu ${index + 1}`}
            className="w-20 h-20 object-cover rounded-xl shadow-md"
          />
        </div>
        
        {/* Nội dung câu */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Câu {index + 1}
            </span>
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying || !sentence.audio}
              className={`p-2 rounded-full transition-all duration-200 ${
                isPlaying 
                  ? 'bg-gray-300 text-gray-500' 
                  : 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-110'
              }`}
            >
              {isPlaying ? '🔊' : '🔊'}
            </button>
          </div>
          <p className="text-xl font-semibold text-gray-800 leading-relaxed">
            {sentence.text}
          </p>
        </div>
      </div>
    </div>
  )
}

function QuestionCard({ question, onAnswer, disabled, storyId }) {
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleAnswerSelect = (answer) => {
    if (disabled) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = async () => {
    if (!selectedAnswer) return

    try {
      const requestBody = {
        storyId: storyId,
        question: question.question,
        answer: selectedAnswer
      }
      
      console.log('Sending answer:', requestBody)
      
      const response = await fetch(`${API_URL}/check-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      setIsCorrect(data.correct)
      setShowFeedback(true)

      if (data.correct) {
        onAnswer(true, data.message)
      } else {
        onAnswer(false, data.message, data.correctAnswer)
      }

      // Reset sau 2 giây
      setTimeout(() => {
        setShowFeedback(false)
        setSelectedAnswer("")
      }, 2000)

    } catch (error) {
      console.error("Error checking answer:", error)
    }
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
      <h3 className="text-2xl font-bold text-orange-700 mb-4 text-center">
        {question.question}
      </h3>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={disabled || showFeedback}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
              selectedAnswer === option
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="text-lg font-semibold">{option}</span>
          </button>
        ))}
      </div>

      {selectedAnswer && !showFeedback && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            🎯 Kiểm tra câu trả lời
          </button>
        </div>
      )}

      {showFeedback && (
        <div className={`text-center p-4 rounded-xl ${
          isCorrect 
            ? 'bg-green-100 border-2 border-green-300 text-green-700' 
            : 'bg-red-100 border-2 border-red-300 text-red-700'
        }`}>
          <p className="text-lg font-bold">
            {isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng!'}
          </p>
          {!isCorrect && (
            <p className="text-sm mt-1">
              Đáp án đúng: <span className="font-bold">{question.correct}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function ProgressBar({ value, max }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-6 mb-6 shadow-inner">
      <div
        className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 h-6 rounded-full flex items-center justify-end pr-3 transition-all duration-500 shadow-lg"
        style={{ width: `${(value / max) * 100}%` }}
      >
        <span className="text-sm font-bold text-white drop-shadow-lg">
          📚 {value}/{max}
        </span>
      </div>
    </div>
  )
}

export default function StoryReader() {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [currentStory, setCurrentStory] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    fetch(`${API_URL}/stories`)
      .then((res) => res.json())
      .then((data) => {
        setStories(data)
        setCurrentStory(data[0] || null)
      })
      .catch((error) => {
        console.error("Error fetching stories:", error)
      })
  }, [])

  useEffect(() => {
    // Lưu vào sessionStorage
    sessionStorage.setItem("story-progress", progress)
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
      sessionStorage.removeItem("story-progress")
    }
  }, [])

  const handlePlayAudio = (audioUrl, onComplete) => {
    if (!audioUrl) {
      onComplete?.()
      return
    }

    const audio = new Audio(audioUrl)
    audio.onended = () => onComplete?.()
    audio.onerror = () => onComplete?.()
    audio.play().catch(() => onComplete?.())
  }

  const handleAnswer = (isCorrect, message, correctAnswer) => {
    setFeedback(message)
    setDisabled(true)

    if (isCorrect) {
      setProgress((p) => p + 1)
      setCurrentQuestionIndex((prev) => {
        const nextIndex = prev + 1
        
        // Kiểm tra nếu đã hoàn thành tất cả câu hỏi của truyện hiện tại
        if (nextIndex > currentStory.questions.length) {
          // Bắt đầu đếm ngược 3 giây
          setCountdown(3)
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval)
                handleNextStory()
                return 0
              }
              return prev - 1
            })
          }, 1000)
        }
        
        return nextIndex
      })
    }

    setTimeout(() => {
      setFeedback("")
      setDisabled(false)
    }, 2000)
  }

  const handleNextStory = () => {
    const currentIndex = stories.findIndex(s => s.storyId === currentStory?.storyId)
    const nextIndex = (currentIndex + 1) % stories.length
    setCurrentStory(stories[nextIndex])
    setCurrentQuestionIndex(0)
    setCountdown(0) // Reset countdown
  }

  const currentQuestion = currentStory?.questions[currentQuestionIndex]

  return (
    <>
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

      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-3xl shadow-2xl p-6 md:p-10 w-full border border-orange-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 text-center">
            📚 Hành Trình Đọc Truyện – Khám Phá Câu Chuyện 📚
          </h1>
          
          <ProgressBar value={progress} max={12} />

          {currentStory && (
            <>
              {/* Header truyện */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-orange-700">
                  {currentStory.title}
                </h2>
                <button
                  onClick={handleNextStory}
                  disabled={disabled}
                  className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  📖 Truyện tiếp →
                </button>
              </div>

              {/* Phần đọc truyện */}
              {currentQuestionIndex === 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
                    📖 Hãy đọc truyện thật kỹ nhé!
                  </h3>
                  <div className="space-y-4">
                    {currentStory.sentences.map((sentence, index) => (
                      <StorySentence
                        key={index}
                        sentence={sentence}
                        index={index}
                        onPlayAudio={handlePlayAudio}
                      />
                    ))}
                  </div>
                  
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setCurrentQuestionIndex(1)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 text-xl"
                    >
                      🎯 Bắt đầu trả lời câu hỏi
                    </button>
                  </div>
                </div>
              )}

              {/* Phần câu hỏi */}
              {currentQuestionIndex > 0 && currentQuestion && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
                    ❓ Câu hỏi {currentQuestionIndex}/{currentStory.questions.length}
                  </h3>
                  <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    disabled={disabled}
                    storyId={currentStory.storyId}
                  />
                </div>
              )}

              {/* Hoàn thành tất cả câu hỏi */}
              {currentQuestionIndex > currentStory.questions.length && (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 border-2 border-green-300 animate-pulse">
                    <h3 className="text-3xl font-bold text-green-700 mb-4">
                      🎉 Hoàn thành!
                    </h3>
                    <p className="text-xl text-green-600 mb-4">
                      Bạn đã đọc hiểu truyện "{currentStory.title}" rất giỏi!
                    </p>
                    <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 mb-6">
                      <p className="text-lg font-bold text-yellow-700">
                        ⏰ Tự động chuyển sang truyện tiếp theo sau {countdown} giây...
                      </p>
                      <div className="mt-2">
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" 
                            style={{width: `${(countdown / 3) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentQuestionIndex(0)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 text-xl mr-4"
                    >
                      📖 Đọc truyện khác
                    </button>
                    <button
                      onClick={handleNextStory}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 text-xl"
                    >
                      ⚡ Chuyển ngay
                    </button>
                  </div>
                </div>
              )}

              {/* Phản hồi */}
              {feedback && (
                <div className="mt-6 text-center text-xl font-bold p-4 rounded-2xl shadow-lg fade-in bg-green-100 border-2 border-green-300 text-green-700">
                  {feedback}
                </div>
              )}

              {/* Hướng dẫn */}
              <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-300">
                <h3 className="text-lg font-bold text-orange-700 mb-2">💡 Hướng dẫn:</h3>
                <ul className="text-orange-600 space-y-1">
                  <li>• Đọc truyện thật kỹ từng câu</li>
                  <li>• Nhấn 🔊 để nghe đọc câu</li>
                  <li>• Trả lời câu hỏi "Ai? Ở đâu? Làm gì?"</li>
                  <li>• Chọn đáp án đúng nhất</li>
                </ul>
              </div>
            </>
          )}

          {/* Toast thông báo */}
          {showBadge && (
            <Toast 
              message="Nhà Đọc Hiểu Giỏi! Bạn đã trả lời đúng 3 câu hỏi liên tiếp! Tiếp tục phát huy nhé!" 
              type="success" 
              onClose={() => setShowBadge(false)} 
            />
          )}
        </div>
      </div>
    </>
  )
} 