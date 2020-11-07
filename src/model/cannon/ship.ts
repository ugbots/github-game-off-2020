import { Scene } from 'phaser';
import { Sprite } from '../../util/phaser_types';
import { SceneConfig, SceneState } from './scene_config';

export class Ship {
  private sprite: Sprite;

  private rotation = 0;
  private alreadyFired = false;

  create(scene: Scene, sc: SceneConfig): Ship {
    this.sprite = scene.physics.add.sprite(
      sc.cannonPivot.x,
      sc.cannonPivot.y,
      'drillship',
    );

    this.sprite.setVisible(false);

    return this;
  }

  update(time: number, dt: number, sc: SceneConfig): Ship {
    if (sc.sceneState === SceneState.LAUNCH_SHIP && !this.alreadyFired) {
      this.alreadyFired = true;
      this.sprite.setVisible(true);
      this.sprite.setVelocityY(-700);
    }

    if (sc.sceneState === SceneState.LAUNCH_SHIP) {
      this.sprite.setRotation(this.rotation += dt * 0.03);
    }

    return this;
  }
}
