import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import { FlightSceneConfig, FlightSceneState } from './flight_scene_config';

export class Asteroid {
  private sprite: Sprite;

  create(sc: FlightSceneConfig): Asteroid {
    this.sprite = sc.scene.physics.add.sprite(0, 0, keys.sprites.planetBg);

    return this;
  }

  update(time: number, dt: number, sc: FlightSceneConfig): void {
    this.sprite.x = sc.asteroidPosition.x;
    this.sprite.y = sc.asteroidPosition.y;

    if (sc.sceneState === FlightSceneState.ASTEROID_COLLISION) {
      this.sprite.scale += 0.004 * dt;
    }
  }
}