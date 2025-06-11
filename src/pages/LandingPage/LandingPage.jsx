import { Rocket, Star, Zap } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ageGroups = [3, 4, 5, 6, 7]

export const LandingPage = () => {
  const [selectedAge, setSelectedAge] = useState(3)
  const [activeTab, setActiveTab] = useState("game")
  const [language, setLanguage] = useState("vi")
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Animated stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <Star size={Math.random() * 8 + 4} fill="white" className="text-white opacity-70" />
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Floating planets */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-bounce opacity-80"></div>
          <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-pulse opacity-80"></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce delay-300 opacity-80"></div>
          <div className="absolute bottom-20 right-10 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse delay-500 opacity-80"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full px-6 py-3 mb-6">
                <p className="text-lg font-bold">🚀 Khám phá vũ trụ học tập | ⭐ Chuẩn bị cho cuộc phiêu lưu</p>
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  RAINBOW
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
                  SPACE
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
                  ADVENTURE
                </span>
              </h1>

              <p className="text-2xl mb-12 text-cyan-200 font-bold max-w-3xl mx-auto">
                🌌 Cùng con bạn khám phá vũ trụ kiến thức qua những cuộc phiêu lưu không gian thú vị!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button 
                onClick={() => navigate('/login')}
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-5 rounded-full font-black text-xl hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-110 shadow-2xl">
                <Rocket className="inline-block mr-3 group-hover:animate-bounce" size={24} />🚀 Bắt đầu phiêu lưu
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="group relative border-4 border-cyan-400 text-cyan-400 px-10 py-5 rounded-full font-black text-xl hover:bg-cyan-400 hover:text-black transition-all transform hover:scale-110">
                <Star className="inline-block mr-3 group-hover:animate-spin" size={24} />
                👨‍🚀 Dành cho giáo viên
              </button>
            </div>

            {/* Spaceship illustration */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749483077/vecteezy_astronaut-kid-standing-on-saturn-planet-in-space-scene__yhlth0.jpg?height=400&width=600"
                  alt="Space adventure with children"
                  className="w-full rounded-3xl shadow-2xl border-4 border-cyan-400"
                />
                <div className="absolute -top-8 -left-8 text-6xl animate-bounce">🚀</div>
                <div className="absolute -top-8 -right-8 text-6xl animate-pulse">🛸</div>
                <div className="absolute -bottom-8 -left-8 text-6xl animate-bounce delay-300">🌟</div>
                <div className="absolute -bottom-8 -right-8 text-6xl animate-pulse delay-500">🪐</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Age Selector - Space Station Theme */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                🛸 Chọn Trạm Không Gian
              </span>
            </h2>
            <p className="text-xl text-cyan-200">Mỗi độ tuổi là một hành tinh khác nhau để khám phá!</p>
          </div>

          {/* Age Selector */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            {ageGroups.map((age, index) => {
              const planets = ["🪐", "🌍", "🌙", "⭐", "🌟"]
              return (
                <button
                  key={age}
                  onClick={() => setSelectedAge(age)}
                  className={`group relative transition-all transform hover:scale-125 ${selectedAge === age ? "scale-125" : ""
                    }`}
                >
                  <div
                    className={`w-20 h-20 rounded-full border-4 font-black text-2xl transition-all flex items-center justify-center ${selectedAge === age
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 text-black shadow-2xl"
                        : "border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
                      }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{planets[index]}</div>
                      <div className="text-sm">{age}</div>
                    </div>
                  </div>
                  {selectedAge === age && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 animate-pulse"></div>
                  )}
                </button>
              )
            })}

            <div className="border-l-4 border-cyan-400 h-16 mx-8"></div>

            {/* Language Toggle - Space Theme */}
            <div className="flex border-4 border-cyan-400 rounded-full overflow-hidden bg-black/50 backdrop-blur-sm">
              <button
                onClick={() => setLanguage("vi")}
                className={`px-6 py-4 font-bold transition-all ${language === "vi"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "text-cyan-400 hover:bg-cyan-400/20"
                  }`}
              >
                🇻🇳 Trái Đất
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-6 py-4 font-bold transition-all ${language === "en"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "text-cyan-400 hover:bg-cyan-400/20"
                  }`}
              >
                🇺🇸 Mars
              </button>
            </div>
          </div>

          {/* Mission Type Selector */}
          <div className="flex justify-center mb-12">
            <div className="flex border-4 border-purple-400 rounded-full overflow-hidden bg-black/50 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab("game")}
                className={`px-8 py-4 font-black text-lg transition-all ${activeTab === "game"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "text-purple-400 hover:bg-purple-400/20"
                  }`}
              >
                🎮 Nhiệm vụ Game
              </button>
              <button
                onClick={() => setActiveTab("lesson")}
                className={`px-8 py-4 font-black text-lg transition-all ${activeTab === "lesson"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "text-purple-400 hover:bg-purple-400/20"
                  }`}
              >
                📚 Nhiệm vụ Học
              </button>
            </div>
          </div>

          {/* Space Stations Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[7, 3, 4, 5, 6].map((age, index) => {
              const spaceThemes = [
                { emoji: "🚀", name: "Rocket Station", gradient: "from-red-500 to-orange-600" },
                { emoji: "🛸", name: "UFO Base", gradient: "from-green-500 to-blue-600" },
                { emoji: "🌟", name: "Star Port", gradient: "from-yellow-500 to-pink-600" },
                { emoji: "🪐", name: "Planet Hub", gradient: "from-purple-500 to-indigo-600" },
                { emoji: "🌙", name: "Moon Base", gradient: "from-cyan-500 to-blue-600" },
              ]
              const theme = spaceThemes[index]

              return (
                <div key={index} className="group">
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border-4 border-cyan-400 hover:border-yellow-400 transition-all transform hover:scale-105 hover:rotate-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-400/10"></div>
                    <div className="relative p-6 text-center">
                      <div className="text-6xl mb-4 group-hover:animate-bounce">{theme.emoji}</div>
                      <div className={`inline-block bg-gradient-to-r ${theme.gradient} rounded-full px-4 py-2 mb-4`}>
                        <p className="font-black text-white">{age} tuổi</p>
                      </div>
                      <p className="text-cyan-200 text-sm mb-4 font-bold">{theme.name}</p>
                      <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-110 shadow-lg">
                        🚀 KHỞI HÀNH!
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features - Galaxy Explorer */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dvcpy4kmm/image/upload/v1749483163/4fyy_qyic_210104_ss4mp_generated_buutid.jpg?height=500&width=600"
                  alt="Galaxy exploration"
                  className="rounded-3xl border-4 border-purple-400 shadow-2xl"
                />
                <div className="absolute -top-8 -right-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 animate-spin">
                  <Star size={32} className="text-black" />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-4 animate-bounce">
                  <Rocket size={32} className="text-white" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-4xl md:text-5xl font-black mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  🌌 Khám Phá Thiên Hà Tri Thức
                </span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 mr-6 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🌍</span>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border-2 border-cyan-400/30">
                    <p className="text-lg text-cyan-100 font-medium">
                      Khi phi hành gia nhí khám phá các hành tinh tri thức và gặp gỡ những sinh vật ngoài hành tinh thân
                      thiện, các em học được vô số cách giải quyết vấn đề sáng tạo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-full p-4 mr-6 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border-2 border-green-400/30">
                    <p className="text-lg text-green-100 font-medium">
                      Không gian an toàn không có áp lực thời gian, nơi các phi hành gia nhí có thể tự do khám phá và
                      học hỏi từ mọi trải nghiệm trong vũ trụ.
                    </p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full p-4 mr-6 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border-2 border-yellow-400/30">
                    <p className="text-lg text-yellow-100 font-medium">
                      Mỗi nhiệm vụ không gian đều mang lại kiến thức thực tế và kỹ năng sống quý báu cho hành trình phát
                      triển của trẻ.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 border-4 border-yellow-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10"></div>
                  <div className="relative flex items-center">
                    <Zap size={40} className="text-yellow-400 mr-4 animate-pulse" />
                    <p className="text-xl font-black text-white">
                      🚀 Phi hành gia nhí bay cùng Rainbow-learn hơn 4 lần/tuần đạt tốc độ phát triển 75% chỉ trong 2
                      tháng đầu tiên!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Space Activities */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              🚀 Trạm Hoạt Động Vũ Trụ
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "🎮", title: "Game Vũ Trụ", gradient: "from-blue-500 to-purple-600", planet: "🪐" },
              { icon: "📚", title: "Truyện Thiên Hà", gradient: "from-green-500 to-blue-600", planet: "🌍" },
              { icon: "🎨", title: "Nghệ Thuật Sao", gradient: "from-pink-500 to-red-600", planet: "🌟" },
              { icon: "🧩", title: "Đố Vui Hành Tinh", gradient: "from-yellow-500 to-orange-600", planet: "🌙" },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative">
                  <div
                    className={`bg-gradient-to-br ${item.gradient} w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto shadow-2xl group-hover:scale-110 transition-all border-4 border-white/20 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <span className="relative z-10">{item.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl animate-spin">{item.planet}</div>
                </div>
                <h3 className="font-black text-xl text-cyan-100 mb-2">{item.title}</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button className="group bg-gradient-to-r from-cyan-500 to-purple-600 px-10 py-5 rounded-full font-black text-xl hover:from-cyan-400 hover:to-purple-500 transition-all transform hover:scale-110 shadow-2xl border-4 border-white/20">
              <Rocket className="inline-block mr-3 group-hover:animate-bounce" size={24} />🌌 Bắt đầu khám phá vũ trụ
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-r from-black to-gray-900 border-t-4 border-cyan-400">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              🚀 Rainbow Space Adventure
            </span>
          </h3>
          <p className="text-xl text-cyan-200">Khám phá vũ trụ tri thức cùng con bạn mỗi ngày!</p>
          <div className="flex justify-center space-x-4 mt-6">
            <span className="text-3xl animate-bounce">🌟</span>
            <span className="text-3xl animate-pulse">🚀</span>
            <span className="text-3xl animate-bounce delay-300">🪐</span>
            <span className="text-3xl animate-pulse delay-500">🛸</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
