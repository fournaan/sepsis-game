import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ANTIBIOTICS, LEVELS } from './gameData';

const STORAGE_KEY = '@sepsis_game_save';

const initialState = {
  antibodies: 0,
  wbcMax: 5,
  immunodeficiencyMode: false,
  levelsUnlocked: [1],
  antibioticsUnlocked: [],
  hintsUnlocked: [],
  enemyCardsUnlocked: [],
  mcsReportsUnlocked: [],
  coverageChartPieces: [],
  highScores: {},
  totalAntibodiesEarned: 0,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'LOAD_SAVE':
      return { ...state, ...action.payload };

    case 'EARN_ANTIBODIES':
      return {
        ...state,
        antibodies: state.antibodies + action.amount,
        totalAntibodiesEarned: state.totalAntibodiesEarned + action.amount,
      };

    case 'SPEND_ANTIBODIES':
      if (state.antibodies < action.amount) return state;
      return { ...state, antibodies: state.antibodies - action.amount };

    case 'UNLOCK_ANTIBIOTIC':
      if (state.antibioticsUnlocked.includes(action.id)) return state;
      return {
        ...state,
        antibioticsUnlocked: [...state.antibioticsUnlocked, action.id],
        coverageChartPieces: [...state.coverageChartPieces, action.id],
      };

    case 'UNLOCK_LEVEL':
      if (state.levelsUnlocked.includes(action.level)) return state;
      return { ...state, levelsUnlocked: [...state.levelsUnlocked, action.level] };

    case 'UNLOCK_HINT':
      if (state.hintsUnlocked.includes(action.id)) return state;
      return { ...state, hintsUnlocked: [...state.hintsUnlocked, action.id] };

    case 'UNLOCK_ENEMY_CARD':
      if (state.enemyCardsUnlocked.includes(action.id)) return state;
      return { ...state, enemyCardsUnlocked: [...state.enemyCardsUnlocked, action.id] };

    case 'UNLOCK_MCS_REPORT':
      if (state.mcsReportsUnlocked.includes(action.id)) return state;
      return { ...state, mcsReportsUnlocked: [...state.mcsReportsUnlocked, action.id] };

    case 'SET_HIGH_SCORE':
      const existing = state.highScores[action.levelId] || 0;
      if (action.score <= existing) return state;
      return { ...state, highScores: { ...state.highScores, [action.levelId]: action.score } };

    case 'TOGGLE_IMMUNODEFICIENCY':
      return { ...state, immunodeficiencyMode: !state.immunodeficiencyMode };

    case 'RESET_SAVE':
      return initialState;

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(json => {
        if (json) dispatch({ type: 'LOAD_SAVE', payload: JSON.parse(json) });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
