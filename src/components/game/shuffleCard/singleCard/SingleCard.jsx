import PropTypes from 'prop-types';
import './CardStyles.css';
export default function SingleCard({ card, handleChoice, flipped, disabled }) {
    const handleClick = () => {
        if (!disabled) {
            handleChoice(card);
        }
    }
    return (
        <div className="relative w-47 h-47 m-2">
            <div className={`w-full h-full transition-all duration-500 ${flipped ? "rotate-y-180" : ""} preserve-3d`}>
                <img
                    className={`absolute w-full h-full rounded-md border-2 border-white shadow-md object-cover ${flipped ? "rotate-y-180 backface-hidden" : "hidden"}`}
                    alt="card front"
                    src={card.src}
                />
                <div
                    className={`absolute w-full h-full rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ${flipped ? "hidden" : "backface-hidden"}`}
                    onClick={handleClick}
                >
                    <img
                        className="w-16 h-16 opacity-50"
                        alt="card back"
                        src="/images/card-back.png"
                    />
                </div>
            </div>
        </div>
    )
}

SingleCard.propTypes = {
    card: PropTypes.shape({
        src: PropTypes.string.isRequired
    }).isRequired,
    handleChoice: PropTypes.func.isRequired,
    flipped: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired
};

// You'll need to add these CSS classes to your global CSS for the card flip effect:
// .preserve-3d {
//   transform-style: preserve-3d;
// }
// .backface-hidden {
//   backface-visibility: hidden;
// }
// .rotate-y-180 {
//   transform: rotateY(180deg);
// }