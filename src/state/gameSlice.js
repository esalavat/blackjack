// Thunk for dealer's draw logic
import { total, delay } from '../utils/utils';

export const dealerDrawDownThunk = () => async (dispatch, getState) => {
  dispatch(revealDealerCards());
  await delay(300);
  while (total(getState().game.dealerHand) < 17) {
    dispatch(dealerDraw(true));
    await delay(300);
  }
  dispatch(setGameState(GameState.ENDED));
  alert('Hand ended.');
};
import { createSlice } from '@reduxjs/toolkit';
import { GameState } from '../models/GameState';
import { createDeck, shuffleDeck } from '../utils/deck';

const initialState = {
  deck: shuffleDeck(createDeck()),
  playerHand: [],
  dealerHand: [],
  discard: [],
  gameState: GameState.NOTDEALT,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameState(state, action) {
      state.gameState = action.payload;
    },
    playerDraw(state, action) {
      const faceUp = action.payload ?? true;
      if (state.deck.length === 0) {
        alert('No more cards in the deck!');
        return;
      }
      const newCard = { ...state.deck[0], faceUp };
      state.deck = state.deck.slice(1);
      state.playerHand.push(newCard);
    },
    dealerDraw(state, action) {
      const faceUp = action.payload ?? true;
      if (state.deck.length === 0) {
        alert('No more cards in the deck!');
        return;
      }
      const newCard = { ...state.deck[0], faceUp };
      state.deck = state.deck.slice(1);
      state.dealerHand.push(newCard);
    },
    revealDealerCards(state) {
      state.dealerHand = state.dealerHand.map((card) => ({ ...card, faceUp: true }));
    },
  },
});

export const {
  setGameState,
  playerDraw,
  dealerDraw,
  revealDealerCards,
} = gameSlice.actions;

export default gameSlice.reducer;