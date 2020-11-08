import { Scene } from 'phaser';
import { SceneConfig } from '../model/flight/scene_config';
import { getInitialSceneConfig } from '../model/flight/scene_config';
import { Star } from '../model/flight/star';
import { GameState } from '../model/game/game_state';

export class FlightScene extends Scene {
  private sceneConfig: SceneConfig;

  private stars: readonly Star[];

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
  create(): void {
    this.stars = Array(50)
      .fill(0)
      .map(() => {
        return new Star().create(this.sceneConfig);
      });
  }

  /* override */
  update(time: number, dt: number): void {
    this.stars.forEach((star) => {
      star.update(time, dt, this.sceneConfig);
    });
  }
}
