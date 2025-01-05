import { useState } from 'react';
import { GameState } from './models/GameState';
import { createDeck, shuffleDeck } from './utils/deck';
import total from './utils/total';
import Hand from './components/Hand';
import './App.css';

function App() {
  const [gameState, setGameState] = useState(GameState.NOTDEALT);
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);

  const deal = () => {
    setGameState(GameState.PLAYING);
    drawCard(playerHand, setPlayerHand);
    drawCard(dealerHand, setDealerHand, false);
    drawCard(playerHand, setPlayerHand);
    drawCard(dealerHand, setDealerHand);
  };

  const hit = () => {
    drawCard(playerHand, setPlayerHand);
  }

  const drawCard = (hand, setHand, faceUp=true) => {
    if (deck.length === 0) {
      alert('No more cards in the deck!');
      return;
    }
    const newCard = deck.pop(); // Remove the top card
    newCard.faceUp = faceUp;
    setHand((prev) => [...prev, newCard]);
    setDeck(deck);
  };

  return (
    <div>
      <div>
        <h1>
          Dealer: {total(dealerHand)}
        </h1>
        <div>
          <div>
            <Hand cards={dealerHand}></Hand>
          </div>
        </div>
      </div>
      <div>
        <h1>
          Player: {total(playerHand)}
        </h1>
        <div>
          <div>
            <Hand cards={playerHand}></Hand>
          </div>
          <div>
            {gameState === GameState.NOTDEALT 
              ? <button onClick={deal}>Deal</button>
              : <><button onClick={hit}>Hit</button><button>Stand</button></>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
