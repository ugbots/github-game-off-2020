import { Scene } from 'phaser';
import { GameState } from '../game/game_state';

export interface ShopSceneConfig {
  readonly scene: Scene;
  readonly gameState: GameState;
}

export const getInitialSceneConfig = (
  scene: Scene,
  gameState: GameState,
): ShopSceneConfig => ({
  scene,
  gameState,
});
