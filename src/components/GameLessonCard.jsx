import React from 'react';
import { Link } from 'react-router-dom';

const GameLessonCard = (props) => {
    const { title, description, link, gameLessonId, gamesCount } = props.game
    console.log({ props })
    return (
        <div className="text-center bg-gradient-to-r from-blue-200 via-yellow-100 to-pink-200">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <div>
                <h2 className="text-lg font-bold mb-2">Total Games : {gamesCount}</h2>
            </div>
            <p className="mb-4">{description}</p>
            {/* Use the Link component and pass the gameLessonId in the URL */}
            <Link to={`${link}/${gameLessonId}`} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded ">
                🎮 View Games
            </Link>
        </div>
    );
};

export default GameLessonCard;
