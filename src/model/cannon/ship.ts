import { Scene } from 'phaser';
import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import { CannonSceneConfig, SceneState } from './cannon_scene_config';

export class Ship {
  private sprite: Sprite;

  private alreadyFired = false;
  private rotation = 0;

  create(scene: Scene, sc: CannonSceneConfig): Ship {
    this.sprite = scene.physics.add.sprite(
      sc.cannonPivot.x,
      sc.cannonPivot.y,
      keys.sprites.drillShip,
    );

    this.sprite.setVisible(false);

    return this;
  }

  update(time: number, dt: number, sc: CannonSceneConfig): Ship {
    if (sc.sceneState === SceneState.LAUNCH_SHIP && !this.alreadyFired) {
      this.alreadyFired = true;
      this.sprite.setVisible(true);
      this.sprite.setVelocityY(-700);
    }

    if (sc.sceneState === SceneState.LAUNCH_SHIP) {
      this.sprite.setRotation((this.rotation += dt * 0.03));
    }

    return this;
  }
}
