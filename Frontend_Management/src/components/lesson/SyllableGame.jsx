"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { API_URL } from "../utils/Constant"

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
        <span className="text-2xl">🏅</span>
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

function SyllableCard({ syllable }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "SYLLABLE",
      item: { syllable },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [syllable],
  )
  return (
    <div
      ref={drag}
      className={`cursor-grab select-none text-2xl font-bold rounded-2xl px-6 py-4 mb-4 shadow-xl bg-gradient-to-br from-yellow-300 to-orange-400 border-3 border-orange-500 text-white transition-all duration-300 transform hover:scale-105 ${isDragging ? "opacity-40 rotate-3" : "opacity-100"}`}
      style={{ fontSize: "2rem", letterSpacing: "2px" }}
      tabIndex={0}
      aria-label={`Kéo vần ${syllable}`}
    >
      {syllable}
    </div>
  )
}

function WordDropZone({ word, image, onDrop, isMatched, disabled, showImage, matchedImage }) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "SYLLABLE",
      drop: (item) => onDrop(item.syllable, word),
      canDrop: () => !isMatched && !disabled,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [isMatched, disabled, word],
  )

  return (
    <div
      ref={drop}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-3 px-6 py-6 min-h-[120px] shadow-lg transition-all duration-300 transform hover:scale-102
    ${isMatched
          ? "border-green-500 bg-gradient-to-br from-green-100 to-green-200 shadow-green-200"
          : isOver && canDrop
            ? "border-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 shadow-blue-200 scale-105"
            : "border-purple-300 bg-gradient-to-br from-white to-purple-50 hover:shadow-purple-200"
        }
    ${disabled ? "opacity-60" : ""}
  `}
      tabIndex={0}
      aria-label={`Thả vần vào từ ${word}`}
    >
      <span className="text-xl font-bold text-gray-800 mb-3">{word}</span>
      {showImage && (matchedImage || image) && (
        <img src={matchedImage || image} alt={word} className="w-20 h-20 object-contain fade-in rounded-xl shadow-md" />
      )}
    </div>
  )
}

function ProgressBar({ value, max }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-6 mb-6 shadow-inner">
      <div
        className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 h-6 rounded-full flex items-center justify-end pr-3 transition-all duration-500 shadow-lg"
        style={{ width: `${(value / max) * 100}%` }}
      >
        <span className="text-sm font-bold text-white drop-shadow-lg">
          🌟 {value}/{max}
        </span>
      </div>
    </div>
  )
}

export default function SyllableGame() {
  const navigate = useNavigate()
  const [syllables, setSyllables] = useState([])
  const [currentSyllable, setCurrentSyllable] = useState(null)
  const [matched, setMatched] = useState({})
  const [feedback, setFeedback] = useState("")
  const [progress, setProgress] = useState(0) // Khởi tạo từ 0, không đọc từ storage
  const [showBadge, setShowBadge] = useState(false)
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/syllables`)
      .then((res) => res.json())
      .then((data) => {
        setSyllables(data)
        setCurrentSyllable(data[0]?.syllable || null)
      })
  }, [])

  useEffect(() => {
    // Lưu vào sessionStorage thay vì localStorage
    sessionStorage.setItem("syllable-progress", progress)
    if (progress > 0 && progress % 5 === 0) {
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
      sessionStorage.removeItem("syllable-progress")
    }
  }, [])

  const handleDrop = (syllable, word) => {
    setDisabled(true)

    // Debug: Log dữ liệu gửi
    console.log('Sending to API:', { syllable, word })

    // Kiểm tra xem đã ghép đúng chưa
    if (matched[`${syllable}-${word}`]) {
      setFeedback("Bạn đã ghép đúng từ này rồi! Hãy thử từ khác nhé! 🎯")
      setTimeout(() => {
        setFeedback("")
        setDisabled(false)
      }, 1500)
      return
    }

    fetch(`${API_URL}/check-word`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ syllable, word }),
    })
      .then((res) => {
        console.log('API Response status:', res.status)
        return res.json()
      })
      .then((data) => {
        console.log('API Response data:', data)
        if (data.correct) {
          setMatched((prev) => ({
            ...prev,
            [`${syllable}-${word}`]: data.image,
          }))

          // Phản hồi đa dạng cho đúng
          const successMessages = [
            "Tuyệt vời! Bạn đã ghép đúng! 🌟",
            "Chính xác! Rất giỏi! 🎉",
            "Hoàn hảo! Tiếp tục nào! ⭐",
            "Đúng rồi! Bạn thật thông minh! 🏆",
            "Xuất sắc! Ghép từ rất hay! 💫",
          ]
          const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)]
          setFeedback(randomMessage)

          setProgress((p) => p + 1)

          // Phát âm thanh thành công - tạm thời tắt để tránh lỗi
          // const audio = document.getElementById("success-audio")
          // if (audio) audio.play()
        } else {
          // Phản hồi đa dạng cho sai
          const errorMessages = [
            "Chưa đúng rồi! Hãy thử lại nhé! 💪",
            "Gần đúng rồi! Cố gắng thêm chút nữa! 🔍",
            "Chưa phải! Hãy suy nghĩ kỹ hơn! 🤔",
            "Thử lại nào! Bạn sẽ làm được! 💪",
            "Chưa đúng! Nhưng không sao, hãy thử lại! 🌈",
          ]
          const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)]
          setFeedback(randomError)
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
        }, 1500),
      )
  }

  const handleNextSyllable = () => {
    const idx = syllables.findIndex((s) => s.syllable === currentSyllable)
    if (idx < syllables.length - 1) {
      setCurrentSyllable(syllables[idx + 1].syllable)
    } else {
      setCurrentSyllable(syllables[0].syllable)
    }
  }

  const current = syllables.find((s) => s.syllable === currentSyllable)

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

      <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center w-full border border-purple-200">
        {/* Sidebar vần */}
        <div className="flex flex-col items-center md:w-1/4 w-full bg-gradient-to-b from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-purple-700 mb-6 flex items-center gap-2">✨ Kéo vần ✨</h2>
          {syllables.map((s) => (
            <SyllableCard key={s.syllable} syllable={s.syllable} />
          ))}
        </div>
        {/* Khu vực ghép từ */}
        <div className="flex-1 w-full">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4 text-center">
            🎯 Khám Phá Vần – Ghép Từ Vui Vẻ 🎯
          </h1>
          <ProgressBar value={progress} max={20} />
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-blue-700">
              Bài: <span className="uppercase">{currentSyllable}</span>
            </span>
            <button
              onClick={handleNextSyllable}
              className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              🔄 Vần tiếp →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {current?.words.map(({ word, image }) => {
              // Tìm vần đã ghép đúng với từ này
              const matchedSyllable = Object.keys(matched).find((key) => key.endsWith(`-${word}`))
              const isMatched = !!matchedSyllable
              const matchedImage = matched[matchedSyllable]

              return (
                <WordDropZone
                  key={word}
                  word={word}
                  image={image}
                  onDrop={handleDrop}
                  isMatched={isMatched}
                  showImage={isMatched}
                  disabled={disabled}
                  matchedImage={matchedImage}
                />
              )
            })}
          </div>
          {/* Phản hồi */}
          {feedback && (
            <div
              className={`mt-8 text-center text-2xl font-bold p-4 rounded-2xl shadow-lg fade-in ${feedback.includes("Tuyệt vời") ||
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
        </div>
        {/* Toast thông báo */}
        {showBadge && (
          <Toast 
            message="Nhà Ghép Từ Giỏi! Bạn đã ghép đúng 5 từ liên tiếp! Tiếp tục phát huy nhé!" 
            type="success" 
            onClose={() => setShowBadge(false)} 
          />
        )}
      </div>
    </DndProvider>
  )
}
