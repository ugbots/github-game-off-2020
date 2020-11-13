import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { FlightSceneConfig } from './flight_scene_config';

export class Ship {
  private sprite: Sprite;

  create(sc: FlightSceneConfig): Ship {
    this.sprite = sc.scene.physics.add.sprite(
      SCREEN_DIMENSIONS.x / 2,
      SCREEN_DIMENSIONS.y / 2,
      keys.sprites.drillShip,
    );
    this.sprite.scale = 2;

    return this;
  }

  update(time: number, dt: number, sc: FlightSceneConfig): void {
    if (this.sprite.x >= SCREEN_DIMENSIONS.x) {
      this.sprite.x = SCREEN_DIMENSIONS.x;
    }
    if (this.sprite.y >= SCREEN_DIMENSIONS.y) {
      this.sprite.y = SCREEN_DIMENSIONS.y;
    }
  }
}
