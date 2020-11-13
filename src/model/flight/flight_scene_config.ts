import { Scene } from 'phaser';
import { GameState } from '../game/game_state';
import { CursorKeys } from '../../util/phaser_types';

export enum SceneState {
  SHIP_X,
}

export interface FlightSceneConfig {
  readonly gameState: GameState;
  readonly scene: Scene;
  readonly cursorKeys: CursorKeys;
}

export const getInitialSceneConfig = (
  scene: Scene,
  gameState: GameState,
): FlightSceneConfig => ({
  gameState,
  scene,
  cursorKeys: scene.input.keyboard.createCursorKeys(),
});

export const updateSceneConfig = (
  time: number,
  dt: number,
  config: FlightSceneConfig,
): FlightSceneConfig => {
  return config;
};
