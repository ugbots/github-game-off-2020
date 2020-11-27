import { GameState } from '../game/game_state';

export interface LootSceneInput {
  readonly gameState: GameState;
  readonly wasShipDestroyed: boolean;
}
