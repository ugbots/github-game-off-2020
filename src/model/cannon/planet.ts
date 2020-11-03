import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { SceneConfig } from './scene_config';

export class Planet {
  private sprite: Sprite;

  create(scene: Phaser.Scene, sc: SceneConfig): Planet {
    this.sprite = scene.physics.add.sprite(
      sc.planetPivot.x,
      sc.planetPivot.y,
      'planet',
    );

    this.sprite.scaleX = 16;
    this.sprite.scaleY = 16;

    return this;
  }

  update(time: number, dt: number, sc: SceneConfig): Planet {
    this.sprite.rotation = sc.rotation;
    return this;
  }
}
