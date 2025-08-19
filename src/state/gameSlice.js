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
  playerMoney: 100, // Starting money
  bet: 1, // Default bet
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameState(state, action) {
      state.gameState = action.payload;
    },
    clearHands(state) {
      state.playerHand = [];
      state.dealerHand = [];
    },
    setBet(state, action) {
      const bet = action.payload;
      if (bet >= 1 && bet <= state.playerMoney) {
        state.bet = bet;
      }
    },
    subtractBet(state) {
      state.playerMoney -= state.bet;
    },
    resolveBet(state, action) {
      // action.payload: 'win' | 'lose' | 'push'
      if (action.payload === 'win') {
        state.playerMoney += state.bet * 2;
      } else if (action.payload === 'push') {
        state.playerMoney += state.bet;
      }
      // lose: do nothing (bet already subtracted)
    },
    resetMoney(state) {
      state.playerMoney = 100;
    },
    playerDraw(state, action) {
      const faceUp = action.payload ?? true;
      if (state.deck.length === 0) {
        // No more cards in the deck; do nothing
        return;
      }
      const newCard = { ...state.deck[0], faceUp };
      state.deck = state.deck.slice(1);
      state.playerHand.push(newCard);
    },
    dealerDraw(state, action) {
      const faceUp = action.payload ?? true;
      if (state.deck.length === 0) {
        // No more cards in the deck; do nothing
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
  setBet,
  subtractBet,
  resolveBet,
  resetMoney,
} = gameSlice.actions;

export default gameSlice.reducer;