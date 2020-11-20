import { GameState } from "../game/game_state";

export interface FlightSceneInput {
  readonly gameState: GameState;
  readonly shipRotationVelocity: number;
  readonly cannonVelocityPercent: number;
}
