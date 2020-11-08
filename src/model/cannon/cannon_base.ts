import { Sprite } from '../../util/phaser_types';
import { SceneConfig, SceneState } from './scene_config';

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

    // Shake based on loaded fuel
    if (sc.sceneState === SceneState.ROTATE_CANNON) {
      this.sprite.scale = 1 + 0.001 * Math.random() * sc.loadedFuel;
      this.sprite.setRotation((0.5 - Math.random()) * 0.001 * sc.loadedFuel);
    }
    return this;
  }
}
