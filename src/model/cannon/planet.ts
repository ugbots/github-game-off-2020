import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { SceneConfig } from './scene_config';

export class Planet {
  private background: Sprite;
  private foreground: Sprite;

  create(scene: Phaser.Scene, sc: SceneConfig): Planet {
    this.background = scene.physics.add.sprite(
      sc.planetPivot.x,
      sc.planetPivot.y,
      'planet',
    );

    this.background.scaleX = 16;
    this.background.scaleY = 16;

    this.foreground = scene.physics.add.sprite(
      sc.planetPivot.x,
      sc.planetPivot.y,
      'planet',
    );

    this.foreground.scaleX = 16;
    this.foreground.scaleY = 16;

    return this;
  }

  update(time: number, dt: number, sc: SceneConfig): Planet {
    this.background.rotation = sc.rotation;
    this.foreground.rotation = sc.rotation;
    return this;
  }
}
