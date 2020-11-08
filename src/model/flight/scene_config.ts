import { Scene } from "phaser";
import { GameState } from "../game/game_state";

export interface SceneConfig {
  readonly gameState: GameState,
  readonly scene: Scene,
}

export const getInitialSceneConfig = (scene: Scene, gameState: GameState) => ({
  gameState,
  scene,
});