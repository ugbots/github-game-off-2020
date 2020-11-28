import { GameState } from '../model/game/game_state';

export const localStorage = {
  wasTutorialRead: (sceneKey: string): boolean => {
    return window.localStorage.getItem(getTutorialReadKey(sceneKey)) !== null;
  },
  markTutorialRead: (sceneKey: string): void => {
    window.localStorage.setItem(getTutorialReadKey(sceneKey), 'true');
  },
  getGameState: (): GameState | undefined => {
    const stringified = window.localStorage.getItem(GAME_STATE_KEY);
    if (stringified !== null) {
      return JSON.parse(stringified) as GameState;
    }
    return undefined;
  },
  setGameState: (gs: GameState): void => {
    window.localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gs));
  },
  /** Clears all local storage, effectively starting a new game. */
  reset(): void {
    window.localStorage.clear();
  },
};

const GAME_STATE_KEY = 'gameState';

const getTutorialReadKey = (sceneKey: string): string =>
  `${sceneKey}TutorialRead`;
