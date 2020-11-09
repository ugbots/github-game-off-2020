import { Scene } from 'phaser';
import { GameState } from '../game/game_state';
import { CursorKeys, Vector2 } from '../../util/phaser_types';

export enum SceneState {
  SHIP_X,
}

export interface SceneConfig {
  readonly gameState: GameState;
  readonly scene: Scene;
  readonly cursorKeys: CursorKeys;
}

export const getInitialSceneConfig = (
  scene: Scene,
  gameState: GameState,
): SceneConfig => ({
  gameState,
  scene,
  cursorKeys: scene.input.keyboard.createCursorKeys(),
});

export const updateSceneConfig = (
  time: number,
  dt: number,
  config: SceneConfig,
): SceneConfig => {
  return config;
};
