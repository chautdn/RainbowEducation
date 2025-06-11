import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { gameLessons } from '../../utils/gameLessons';
import GameCard from '../../components/GameCard';
import FallingShapes from "../../components/shapes/FallingShapes";
import ShapesAnimation from "../../components/sharedComponents/ShapesAnimation";


const AllGames = () => {
    const { id: param_id } = useParams();
    const selectedLesson = gameLessons.find(lesson => lesson.gameLessonId === Number(param_id));
    const games = selectedLesson?.games || [];

    return (
        <div className="relative py-4 bg-gradient-to-r from-green-200 via-yellow-100 to-blue-200 min-h-screen overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <FallingShapes />
                <span className="text-7xl orbiting-icon2">
                    🚀
                </span>
                {/* Fun Animated Title */}
                <h2 className="text-4xl font-bold text-center mb-2 text-purple-700 drop-shadow-lg animate-bounce">
                    {selectedLesson ? `${selectedLesson.title}` : 'Choose a Game'}
                </h2>
                <ShapesAnimation />

                {/* Button to navigate to the specific lesson */}
                <div className="text-center mb-4">
                    {selectedLesson && (
                        <Link to={`${selectedLesson.lessonSummaryLink}/${selectedLesson.gameLessonId}`}>
                            <button className=" bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-full text-lg transition-all">
                                📘 {selectedLesson.lessonLearning}
                            </button>
                        </Link>
                    )}
                </div>

                {/* Game Cards Grid */}
                {games.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {games.map((game) => (
                            <div
                                key={game.gameId}
                                className="relative p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300"
                            >
                                {/* Background shapes for decoration */}
                                <div className="absolute z-[-4] top-0 right-0 w-24 h-24 bg-red-200 rounded-full opacity-50 animate-ping"></div>
                                <div className="absolute z-[-4] bottom-0 left-0 w-20 h-20 bg-yellow-200 rounded-[10px] opacity-50 animate-spin"></div>

                                {/* GameLessonCard with props */}
                                <GameCard
                                    title={game.title}
                                    description={game.description}
                                    link={game.link}
                                    gameId={game.gameId}
                                    imgUrl={game.imgUrl}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-lg text-gray-500">
                        No games available for this lesson.
                    </p>
                )}

                {/* Add Kid-Friendly Animated Shapes */}
                <div className="absolute z-[-4] top-0 left-0 w-32 h-32 bg-pink-300 rounded-full opacity-50 animate-bounce"></div>
                <div className="absolute z-[-4] bottom-20 right-10 w-28 h-28 bg-orange-300 rounded-full opacity-75 animate-ping"></div>
            </div>
        </div>
    );
};

export default AllGames;
