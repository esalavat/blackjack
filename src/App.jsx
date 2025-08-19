import { useSelector, useDispatch } from 'react-redux';
import { GameState } from './models/GameState';
import { total, delay } from './utils/utils';
import {
  setGameState,
  playerDraw,
  dealerDraw,
  revealDealerCards,
  dealerDrawDownThunk,
  resolveBet,
  placeBet,
  setBet,
} from './state/gameSlice';
import Hand from './components/Hand';
import './App.css';


import React, { useState } from 'react';

function App() {
  const { deck, playerHand, dealerHand, gameState, playerMoney, bet } = useSelector((state) => state.game);
  const dispatch = useDispatch();
  const [betInput, setBetInput] = useState(bet);

  // Helper to determine winner at end of hand
  const getResult = () => {
    const playerTotal = total(playerHand);
    const dealerTotal = total(dealerHand);
    if (playerTotal > 21) return 'lose';
    if (dealerTotal > 21) return 'win';
    if (playerTotal > dealerTotal) return 'win';
    if (playerTotal < dealerTotal) return 'lose';
    return 'push';
  };

  const deal = async () => {
  // Use betInput as the bet amount
  if (betInput > playerMoney) return;
  // Place the bet atomically (set bet and subtract money)
  dispatch(placeBet(betInput));
  // Clear hands before dealing
  dispatch({ type: 'game/clearHands' });
  dispatch(playerDraw());
  await delay(300);
  dispatch(dealerDraw(false));
  await delay(300);
  dispatch(playerDraw());
  await delay(300);
  dispatch(dealerDraw(true));
  dispatch(setGameState(GameState.PLAYERS));
  };

  const hit = () => {
    dispatch(playerDraw());
    // Check for bust after drawing
    setTimeout(() => {
      if (total(playerHand.concat([{...deck[0], faceUp: true}])) > 21) {
        dispatch(revealDealerCards());
        dispatch(setGameState(GameState.ENDED));
      }
    }, 10);
  };

  const stand = () => {
    dispatch(setGameState(GameState.DEALER));
    dispatch(dealerDrawDownThunk());
  };

  // Handle end of hand: payout or not
  React.useEffect(() => {
    if (gameState === GameState.ENDED) {
      const result = getResult();
      dispatch(resolveBet(result));
      // After a short delay, reset to NOTDEALT for new bet and deal
      setTimeout(() => {
        dispatch(setGameState(GameState.NOTDEALT));
      }, 1200);
    }
    // eslint-disable-next-line
  }, [gameState]);

  // Handle bet input change
  const handleBetChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    if (value > playerMoney) value = playerMoney;
    setBetInput(value);
    dispatch(setBet(value));
  };

  return (
    <div>
      <div>
        <h1>
          Dealer: {total(dealerHand.filter(card => card.faceUp))}
        </h1>
        <div className="hand-wrapper">
          <Hand cards={dealerHand}></Hand>
        </div>
      </div>
      <div>
        <h1>
          Player: {total(playerHand)}
          {gameState === GameState.ENDED && total(playerHand) > 21 && (
            <span style={{ color: 'red', marginLeft: 10 }}>Bust!</span>
          )}
          {gameState === GameState.ENDED && getResult() === 'win' && (
            <span style={{ color: 'green', marginLeft: 10 }}>Win!</span>
          )}
        </h1>
        <div className="hand-wrapper">
          <Hand cards={playerHand}></Hand>
        </div>
        <div style={{ margin: '1em 0' }}>
          <strong>Money: ${playerMoney}</strong>
        </div>
        {gameState === GameState.NOTDEALT && (
          <div style={{ marginBottom: '1em' }}>
            <label>
              Bet: $
              <input
                type="number"
                min={1}
                max={playerMoney}
                value={betInput}
                onChange={handleBetChange}
                style={{ width: 60 }}
                disabled={playerMoney < 1}
              />
            </label>
          </div>
        )}
        <div>
          {gameState === GameState.NOTDEALT ? (
            <button onClick={deal} disabled={playerMoney < 1}>Deal</button>
          ) : null}
          {gameState === GameState.PLAYERS && (
            <>
              <button onClick={hit}>Hit</button>
              <button onClick={stand}>Stand</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
