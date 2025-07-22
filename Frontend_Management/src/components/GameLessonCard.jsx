import React from 'react';
import { Link } from 'react-router-dom';

const GameLessonCard = (props) => {
    const { title, description, link, gameLessonId, gamesCount } = props.game;
    
    // Điều hướng đặc biệt cho SyllableGame, SentenceBuilder, StoryReader và BodyParts
    const isSyllableGame = link === '/games/syllable';
    const isSentenceBuilder = link === '/games/sentence-builder';
    const isStoryReader = link === '/games/story-reader';
    const isBodyParts = link === '/games/body-parts';
    const isSpecialGame = link.startsWith('/games/');
    const to = isSpecialGame ? link : `${link}/${gameLessonId}`;

    return (
        <div className="text-center bg-gradient-to-r from-blue-200 via-yellow-100 to-pink-200 min-h-[220px] max-h-[220px] flex flex-col justify-center items-center">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <div>
                <h2 className="text-lg font-bold mb-2">Số trò chơi : {gamesCount}</h2>
            </div>
            <p className="mb-4 line-clamp-3">{description}</p>
            {/* Use the Link component and pass the gameLessonId in the URL */}
            <Link to={to} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded ">
                🎮 Xem trò chơi
            </Link>
        </div>
    );
};

export default GameLessonCard;
