import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { SceneConfig } from './scene_config';

export class Ship {
  private sprite: Sprite;

  create(sc: SceneConfig): Ship {
    this.sprite = sc.scene.physics.add.sprite(
      SCREEN_DIMENSIONS.x / 2,
      SCREEN_DIMENSIONS.y / 2,
      'drillship',
    );
    this.sprite.scale = 2;

    return this;
  }
  update(time: number, dt: number, sc: SceneConfig): void {
    if (this.sprite.x >= SCREEN_DIMENSIONS.x) {
      this.sprite.x = SCREEN_DIMENSIONS.x;
    }
    if (this.sprite.y >= SCREEN_DIMENSIONS.y) {
      this.sprite.y = SCREEN_DIMENSIONS.y;
    }
  }
}
