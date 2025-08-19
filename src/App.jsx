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
    if (betInput > playerMoney) return;
    dispatch(placeBet(betInput));
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
    setTimeout(() => {
      if (total(playerHand.concat([{ ...deck[0], faceUp: true }])) > 21) {
        dispatch(revealDealerCards());
        dispatch(setGameState(GameState.ENDED));
      }
    }, 10);
  };

  const stand = () => {
    dispatch(setGameState(GameState.DEALER));
    dispatch(dealerDrawDownThunk());
  };

  React.useEffect(() => {
    if (gameState === GameState.ENDED) {
      const result = getResult();
      dispatch(resolveBet(result));
      setTimeout(() => {
        dispatch(setGameState(GameState.NOTDEALT));
      }, 1200);
    }
    // eslint-disable-next-line
  }, [gameState]);

  const handleBetChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    if (value > playerMoney) value = playerMoney;
    setBetInput(value);
    dispatch(setBet(value));
  };

  return (
    <div className="app-outer">
      <div className="main-area">
        <div className="dealer-area">
          <h1 className="label">Dealer: {total(dealerHand.filter(card => card.faceUp))}</h1>
          <div className="hand-wrapper">
            <Hand cards={dealerHand} />
          </div>
        </div>
        <div className="player-area">
          <h1 className="label">
            Player: {total(playerHand)}
            {gameState === GameState.ENDED && total(playerHand) > 21 && (
              <span className="bust">Bust!</span>
            )}
            {gameState === GameState.ENDED && getResult() === 'win' && (
              <span className="win">Win!</span>
            )}
          </h1>
          <div className="hand-wrapper">
            <Hand cards={playerHand} />
          </div>
          {/* money and bet moved to bottom */}
        </div>
      </div>
      <div className="bottom-bar">
        <div className="money-row">
          <strong>Money: ${playerMoney}</strong>
          <span className="bet-row">
            {gameState === GameState.NOTDEALT ? (
              <label>
                Bet: $
                <input
                  type="number"
                  min={1}
                  max={playerMoney}
                  value={betInput}
                  onChange={handleBetChange}
                  className="bet-input"
                  disabled={playerMoney < 1}
                />
              </label>
            ) : (
              <span className="bet-amount">Bet: ${bet}</span>
            )}
          </span>
        </div>
        <div className="action-bar">
          {gameState === GameState.NOTDEALT ? (
            <button className="action-btn" onClick={deal} disabled={playerMoney < 1}>Deal</button>
          ) : null}
          {gameState === GameState.PLAYERS && (
            <>
              <button className="action-btn" onClick={hit}>Hit</button>
              <button className="action-btn" onClick={stand}>Stand</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
