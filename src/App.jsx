import { useState } from 'react';
import { GameState } from './models/GameState';
import { createDeck, shuffleDeck } from './utils/deck';
import { total, delay } from './utils/utils';
import Hand from './components/Hand';
import './App.css';

function App() {
  const [state, setState] = useState({
    deck: shuffleDeck(createDeck()),
    playerHand: [],
    dealerHand: [],
    discard: [],
    gameState: GameState.NOTDEALT
  });

  const setGameState = (gameState) => {
    setState((prev) => { return {...prev, gameState: gameState}});
  }
  
  const deal = async () => {
    setGameState(GameState.DEALING);
    playerDraw();
    await delay(300);
    dealerDraw(false);
    await delay(300);
    playerDraw();
    await delay(300);
    dealerDraw();
    setGameState(GameState.PLAYERS);
  };
  
  const hit = () => {
    playerDraw();
  }
  
  const stand = () => {
    setGameState(GameState.DEALER);
    dealerDrawDown();
  }
  
  const dealerDrawDown = async () => {
    await setState((prev) => {
      console.log("drawDown total: ", total(prev.dealerHand), prev.dealerHand);
      
      let newState = {...prev, dealerHand: prev.dealerHand.map(x => { return { ...x, faceUp: true } })};
      
      if (prev.gameState == GameState.DEALER && total(prev.dealerHand) < 17) {
        const newCard = {...prev.deck[0]};
        newCard.faceUp = true;
      
        newState.deck = prev.deck.slice(1);
        newState.dealerHand = [...newState.dealerHand, newCard];
        
        setTimeout(dealerDrawDown,300);
      } else {
        endHand();
      }

      return newState;
    });
  }

  const endHand = () => {
    setGameState(GameState.ENDED);
    alert("Hand ended.");
  }

  const playerDraw = (faceUp = true) => {
    setState((prev) => {

      if (prev.deck.length === 0) {
        alert('No more cards in the deck!');
        return prev;
      }
      
      const newCard = {...prev.deck[0]}; // Remove the top card
      newCard.faceUp = faceUp;
      
      return {...prev,
        deck: prev.deck.slice(1),
        playerHand: [...prev.playerHand, newCard]
      };
    });
  };
  
  const dealerDraw = (faceUp = true) => {
    setState((prev) => {

      if (prev.deck.length === 0) {
        alert('No more cards in the deck!');
        return prev;
      }
      
      const newCard = {...prev.deck[0]}; // Remove the top card
      newCard.faceUp = faceUp;
      
      return {...prev,
        deck: prev.deck.slice(1),
        dealerHand: [...prev.dealerHand, newCard]
      };
    });
  };

  return (
    <div>
      <div>
        <h1>
          Dealer: {total(state.dealerHand)}
        </h1>
        <div>
          <div>
            <Hand cards={state.dealerHand}></Hand>
          </div>
        </div>
      </div>
      <div>
        <h1>
          Player: {total(state.playerHand)}
        </h1>
        <div>
          <div>
            <Hand cards={state.playerHand}></Hand>
          </div>
          <div>
            {state.gameState === GameState.NOTDEALT
              ? <button onClick={deal}>Deal</button>
              : <><button onClick={hit}>Hit</button><button onClick={stand}>Stand</button></>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
