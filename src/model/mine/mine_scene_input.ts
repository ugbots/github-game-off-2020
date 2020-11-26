import { GameState } from '../game/game_state';

export interface MineSceneInput {
  readonly gameState: GameState;
  /**
   * The distance that this asteroid is (∈ [0, 1]) from earth to the moon
   * (0 = earth, 1 = moon)
   */
  readonly normalizedMoonDistance: number;
}
