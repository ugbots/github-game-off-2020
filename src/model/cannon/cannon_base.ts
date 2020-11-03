import { Sprite } from '../../util/phaser_types';
import { SceneConfig } from './scene_config';

export class CannonBase {
  private sprite: Sprite;

  create(scene: Phaser.Scene, sc: SceneConfig): CannonBase {
    this.sprite = scene.physics.add.sprite(
      sc.cannonPivot.x,
      sc.cannonPivot.y,
      'cannon_base',
    );
    return this;
  }

  update(time: number, dt: number, sc: SceneConfig): CannonBase {
    this.sprite.setPosition(sc.cannonPivot.x, sc.cannonPivot.y);
    return this;
  }
}
