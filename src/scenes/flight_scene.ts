import { Scene } from 'phaser';
import { SceneConfig } from '../model/flight/scene_config';
import { getInitialSceneConfig } from '../model/flight/scene_config';
import { GameState } from '../model/game/game_state';

export class FlightScene extends Scene {
  private sceneConfig: SceneConfig;

  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Flight',
    });
  }

  /* override */
  init(gameState: GameState): void {
    this.sceneConfig = getInitialSceneConfig(this, gameState);
  }

  /* override */
  create(): void {}

  /* override */
  update(time: number, dt: number): void {}
}
