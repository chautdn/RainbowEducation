import React, { useState, useEffect } from "react";
import "./styles.css";

import race_track from "../../../assets/images/race-track.jpg";
import yellow_car from "../../../assets/images/car-yellow.png";
import white_car from "../../../assets/images/car-white.png";
import { Link } from "react-router-dom";
import SpeechUtils from "../../../utils/SpeechUtils";
import CustomNavbar from "../../../components/navbar/CustomNavbar";
import FallingNumbers from "../../../components/sharedComponents/FallingNumbers";
import FallingShapes from "../../../components/shapes/FallingShapes";
import ShapesAnimation from "../../../components/sharedComponents/ShapesAnimation";

const shapes = [
  { name: "Circle", symbol: "●" },
  { name: "Square", symbol: "■" },
  { name: "Triangle", symbol: "▲" },
  { name: "Rectangle", symbol: "▬" },
  { name: "Pentagon", symbol: "⬟" },
  { name: "Hexagon", symbol: "⬢" },
  { name: "Octagon", symbol: "⯃" },
  { name: "Ellipse", symbol: "⬭" },
  { name: "Parallelogram", symbol: "▰" },
  { name: "Trapezoid", symbol: "⏢" },
];

const FINISH_LINE = 600; // Define finish line position - moved further right

const ShapeRace = () => {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameStatus, setGameStatus] = useState("Player 1's turn!");
  const [player1Position, setPlayer1Position] = useState(100); // Better starting position on track
  const [player2Position, setPlayer2Position] = useState(100); // Same starting position
  const [winnerWindow, setWinnerWindow] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [correctShape, setCorrectShape] = useState("");
  const [isCompact, setIsCompact] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  const getRandomShape = () => {
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex].name.toLowerCase();
  };

  // Initialize game and set first shape
  useEffect(() => {
    const initialShape = getRandomShape();
    setCorrectShape(initialShape);
  }, []);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      SpeechUtils.stop(); // Stop any ongoing speech when component unmounts
    };
  }, []);

  // Speak the shape name when it changes (but only once per turn)
  useEffect(() => {
    if (correctShape && !gameOver && !hasSpoken) {
      const timer = setTimeout(() => {
        SpeechUtils.speak(`Select ${correctShape}`);
        setHasSpoken(true);
      }, 500); // Small delay to prevent immediate speech

      return () => clearTimeout(timer);
    }
  }, [correctShape, gameOver, hasSpoken]);

  const handleShapeSelect = (shape) => {
    if (gameOver) return;

    const isCorrect = shape === correctShape;

    if (currentPlayer === 1) {
      if (isCorrect) {
        const newPosition = player1Position + 80; // Increased movement distance
        setPlayer1Position(newPosition);
        if (newPosition >= FINISH_LINE) {
          setGameStatus("Player 1 wins!");
          setWinner("Player 1");
          setGameOver(true);
          setWinnerWindow(true);
          SpeechUtils.speak("Player 1 wins! Congratulations!");
          return;
        } else {
          setGameStatus("Correct! Player 2's turn!");
          SpeechUtils.speak("Correct!");
        }
      } else {
        setGameStatus("Wrong! Player 2's turn!");
        SpeechUtils.speak("Wrong! ");
      }
      setCurrentPlayer(2);
    } else {
      if (isCorrect) {
        const newPosition = player2Position + 80; // Increased movement distance
        setPlayer2Position(newPosition);
        if (newPosition >= FINISH_LINE) {
          setGameStatus("Player 2 wins!");
          setWinner("Player 2");
          setGameOver(true);
          setWinnerWindow(true);
          SpeechUtils.speak("Player 2 wins! Congratulations!");
          return;
        } else {
          setGameStatus("Correct! Player 1's turn!");
          SpeechUtils.speak("Correct!");
        }
      } else {
        setGameStatus("Wrong! Player 1's turn!");
        SpeechUtils.speak("Wrong! Try again!");
      }
      setCurrentPlayer(1);
    }

    // Generate new shape for next turn
    if (!gameOver) {
      setTimeout(() => {
        const newShape = getRandomShape();
        setCorrectShape(newShape);
        setHasSpoken(false); // Reset to allow speaking new shape
      }, 1500); // Delay before new shape
    }
  };

  // Reset the game state for a new game
  const handlePlayAgain = () => {
    SpeechUtils.stop(); // Stop any ongoing speech
    setCurrentPlayer(1);
    setGameStatus("Player 1's turn!");
    setPlayer1Position(100); // Better starting position on track
    setPlayer2Position(100); // Same starting position for both players
    setGameOver(false);
    setWinnerWindow(false);
    setHasSpoken(false);

    // Set new random shape
    setTimeout(() => {
      const newShape = getRandomShape();
      setCorrectShape(newShape);
    }, 500);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-200 via-yellow-100 to-pink-200 overflow-hidden">
      {/* Animated Background Elements */}
      <FallingNumbers />
      <FallingShapes />
      <ShapesAnimation />

      {/* Orbiting Icons */}
      <span className="text-7xl orbiting-icon2 fixed top-20 right-10 z-0">
        🚀
      </span>
      <span className="text-8xl orbiting-icon fixed bottom-20 left-10 z-0">
        🚀
      </span>

      <main className="relative z-10">
        <div>
          {/* Navbar Section */}
          <div className="sticky top-0 z-50">
            <CustomNavbar isCompact={isCompact} />
            <div className="w-full h-12 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-b-2xl blur-sm"></div>
          </div>

          {/* Main Game Content */}
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              {/* Game Header */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-white/80 to-orange-100/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-6 inline-block">
                  <h1 className="text-4xl font-bold text-orange-700 drop-shadow-lg mb-2">
                    🏁 Shape Race Game 🏁
                  </h1>
                  <p className="text-lg text-orange-600 font-semibold">
                    Race to the finish by selecting the correct shapes!
                  </p>
                </div>
              </div>

              {/* Game Container */}
              <div className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 p-6 mb-8">
                {/* Race Track */}
                <div
                  id="track"
                  className="track w-full h-96 relative rounded-2xl overflow-hidden mb-6 border-2 border-blue-300"
                  style={{
                    backgroundImage: `url(${race_track})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Player 1's car */}
                  <div
                    id="player1"
                    className="character w-24 h-24 absolute transition-all duration-1000 z-10"
                    style={{
                      left: `${player1Position}px`,
                      top: "60px", // Fixed positioning for top lane
                    }}
                  >
                    <img
                      src={white_car}
                      alt="Player 1's car"
                      className="w-full h-full -rotate-90 drop-shadow-lg"
                    />
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-blue-700 px-2 py-1 rounded text-xs font-bold shadow-md">
                      P1
                    </div>
                  </div>

                  {/* Player 2's car */}
                  <div
                    id="player2"
                    className="character w-24 h-24 absolute transition-all duration-1000 z-10"
                    style={{
                      left: `${player2Position}px`,
                      top: "180px", // Fixed positioning for bottom lane
                    }}
                  >
                    <img
                      src={yellow_car}
                      alt="Player 2's car"
                      className="w-full h-full -rotate-90 drop-shadow-lg"
                    />
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-yellow-600 px-2 py-1 rounded text-xs font-bold shadow-md">
                      P2
                    </div>
                  </div>

                  {/* Finish Line */}
                  <div
                    className="absolute top-0 bottom-0 w-4 bg-gradient-to-b from-red-500 to-red-600 opacity-90 shadow-lg border-2 border-white"
                    style={{
                      left: `${FINISH_LINE}px`,
                      transform: "translateX(-50%)", // Center the finish line
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md whitespace-nowrap">
                      🏁 FINISH
                    </div>
                  </div>

                  {/* Remove lane dividers as they might not align with the track image */}
                </div>

                {/* Current Player & Shape Prompt */}
                <div className="mb-6 flex items-center justify-center">
                  <div
                    className={`flex items-center p-4 rounded-2xl border-2 ${
                      currentPlayer === 1
                        ? "bg-blue-100 border-blue-400"
                        : "bg-yellow-100 border-yellow-400"
                    }`}
                  >
                    {currentPlayer === 1 ? (
                      <>
                        <img
                          src={white_car}
                          alt="Player 1's car"
                          className="w-12 h-12 mr-3"
                        />
                        <div className="text-xl font-bold text-blue-700">
                          Player 1: Select{" "}
                          <span className="text-2xl text-red-600">
                            {correctShape}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={yellow_car}
                          alt="Player 2's car"
                          className="w-12 h-12 mr-3"
                        />
                        <div className="text-xl font-bold text-yellow-700">
                          Player 2: Select{" "}
                          <span className="text-2xl text-red-600">
                            {correctShape}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Shape Options */}
                <div className="grid grid-cols-5 gap-4 justify-items-center max-w-4xl mx-auto mb-6">
                  {shapes.map((shape) => (
                    <div
                      key={shape.name}
                      className="shape w-20 h-20 text-3xl bg-white border-2 border-blue-400 rounded-xl flex justify-center items-center cursor-pointer hover:bg-blue-400 hover:text-white transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={() =>
                        handleShapeSelect(shape.name.toLowerCase())
                      }
                      title={shape.name} // Tooltip for accessibility
                    >
                      <span className="flex items-center justify-center w-full h-full">
                        {shape.symbol}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Game Status */}
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 inline-block border-2 border-purple-300">
                    <div className="text-xl font-bold text-purple-700">
                      {gameStatus}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 items-center justify-center">
                  <button
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white py-3 px-6 text-lg rounded-xl cursor-pointer font-bold transform hover:scale-105 transition-all duration-300 shadow-lg"
                    onClick={handlePlayAgain}
                  >
                    🔄 Play Again
                  </button>

                  <Link to={`/game-lessons/games/1`}>
                    <button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white py-3 px-6 text-lg rounded-xl cursor-pointer font-bold transform hover:scale-105 transition-all duration-300 shadow-lg">
                      🔙 Go Back
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Winner Modal */}
      {winnerWindow && (
        <div className="fixed inset-0 bg-blue-500/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-white to-yellow-100 p-8 rounded-3xl text-center shadow-2xl border-4 border-yellow-400 transform scale-105 transition-transform">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-extrabold text-orange-600 mb-4 animate-bounce">
              {winner} Wins! 🎉
            </h2>
            <p className="text-2xl text-blue-700 mb-4">
              Congratulations on your victory!
            </p>
            <p className="text-lg text-gray-600 mb-6">
              You're a superstar racer! Keep racing to become the ultimate
              champion!
            </p>
            <button
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 px-8 text-lg rounded-xl cursor-pointer font-bold transition-all transform hover:scale-110 shadow-xl"
              onClick={handlePlayAgain}
            >
              🚗 Race Again!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShapeRace;
