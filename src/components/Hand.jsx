export default function Hand({ cards }) {
    return (
        <ul className="hand-list">
            {cards.map((card, index) => (
                <li key={index} className={`card ${card.faceUp ? card.suit : ""}`}>
                    {card.faceUp
                        ? <>{card.rank} of {card.suit}</>
                        : <>Card</>
                    }
                </li>
            ))}
        </ul>
    );
}