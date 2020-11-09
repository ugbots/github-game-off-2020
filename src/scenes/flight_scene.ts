import { Scene } from 'phaser';
import {
  getInitialSceneConfig,
  SceneConfig,
  updateSceneConfig,
} from '../model/flight/scene_config';
import { Star } from '../model/flight/star';
import { GameState } from '../model/game/game_state';
import { Ship } from '../model/flight/ship';

export class FlightScene extends Scene {
  private sceneConfig: SceneConfig;
  private gameState: GameState;
  private stars: readonly Star[];
  private ship: Ship;

  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Flight',
    });
  }

  /* override */
  init(gameState: GameState): void {
    this.gameState = gameState;
  }

  /* override */
  create(): void {
    this.sceneConfig = {
      ...getInitialSceneConfig(this, this.gameState),
      cursorKeys: this.input.keyboard.createCursorKeys(),
    };

    this.stars = Array(50)
      .fill(0)
      .map(() => {
        return new Star().create(this.sceneConfig);
      });
    this.ship = new Ship().create(this.sceneConfig);
  }

  /* override */
  update(time: number, dt: number): void {
    updateSceneConfig(time, dt, this.sceneConfig);
    this.ship.update(time, dt, this.sceneConfig);
    this.stars.forEach((star) => {
      star.update(time, dt, this.sceneConfig);
    });
  }
}
