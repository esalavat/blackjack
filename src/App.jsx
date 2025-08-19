import { useSelector, useDispatch } from 'react-redux';
import { GameState } from './models/GameState';
import { total, delay } from './utils/utils';
import {
  setGameState,
  playerDraw,
  dealerDraw,
  revealDealerCards,
  dealerDrawDownThunk,
} from './state/gameSlice';
import Hand from './components/Hand';
import './App.css';

function App() {
  const { deck, playerHand, dealerHand, gameState } = useSelector((state) => state.game);
  const dispatch = useDispatch();
  
  const deal = async () => {
    dispatch(setGameState(GameState.DEALING));
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
  };

  const stand = () => {
    dispatch(setGameState(GameState.DEALER));
    dispatch(dealerDrawDownThunk());
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
              : <><button onClick={hit}>Hit</button><button onClick={stand}>Stand</button></>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
