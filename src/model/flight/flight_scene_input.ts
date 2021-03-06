import { GameState } from '../game/game_state';

export interface FlightSceneInput {
  readonly gameState: GameState;
  readonly cannonVelocityPercent: number;
  readonly aimedAtMoon: boolean;
}
