import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import SingleCard from './singleCard/SingleCard';
import BackgroundStars from '../../BackgroundStars';

const cardsImages = [
    { "src": "/img/shuffelImg/cat.png", matched: false },
    { "src": "/img/shuffelImg/tiger.png", matched: false },
    { "src": "/img/shuffelImg/dog.jpg", matched: false },
    { "src": "/img/shuffelImg/pen.jpg", matched: false },
    { "src": "/img/shuffelImg/family.jpg", matched: false },
    { "src": "/img/shuffelImg/fishs.jpg", matched: false }
];

function ShuffleCard() {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [turn, setTurn] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [matches, setMatches] = useState(0);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //shuffle cards
    const shuffleCards = () => {
        const shuffledCards = [...cardsImages, ...cardsImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        setChoiceOne(null);
        setChoiceTwo(null);
        setCards(shuffledCards);
        setTurn(0);
        setMatches(0);
    }

    //handle choice
    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }

    //compare 2 cards
    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);
            if (choiceOne.src === choiceTwo.src) {
                setMatches(prev => prev + 1);
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if (card.src === choiceOne.src) {
                            return { ...card, matched: true };
                        } else {
                            return card;
                        }
                    });
                });
                resetTurn();
            }
            else {
                setTimeout(() => {
                    resetTurn();
                }, 1000);
            }
        }
    }, [choiceOne, choiceTwo]);

    //reset turn & increase turn 
    const resetTurn = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurn(prevTurn => prevTurn + 1);
        setDisabled(false);
    }

    //start new game automatically
    useEffect(() => {
        shuffleCards();
    }, []);

    return (
        <div>
            {matches === cardsImages.length && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.3}
                />
            )}
            <BackgroundStars />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-800 mb-6">Memory Match Game</h1>

                    <div className="flex justify-center gap-8 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-3 w-32">
                            <p className="text-gray-500 text-sm">Turns</p>
                            <p className="text-2xl font-bold text-purple-700">{turn}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-3 w-32">
                            <p className="text-gray-500 text-sm">Matches</p>
                            <p className="text-2xl font-bold text-purple-700">{matches}/{cardsImages.length}</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={shuffleCards}
                            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105"
                        >
                            New Game
                        </button>
                        <button
                            onClick={() => navigate('/game-zone')}
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105"
                        >
                            Return to Game Zone
                        </button>
                    </div>
                </div>

                {/* card Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
                    {cards.map(card => (
                        <SingleCard
                            key={card.id}
                            card={card}
                            handleChoice={handleChoice}
                            flipped={card === choiceOne || card === choiceTwo || card.matched}
                            disabled={disabled}
                        />
                    ))}
                </div>

                {matches === cardsImages.length && (
                    <div className="mt-8 text-center">
                        <p className="text-xl font-bold text-green-600">Congratulations! You won in {turn} turns!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShuffleCard;