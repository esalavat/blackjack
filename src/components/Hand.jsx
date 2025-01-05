export default function Hand({ cards }) {
    return (
        <ul>
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