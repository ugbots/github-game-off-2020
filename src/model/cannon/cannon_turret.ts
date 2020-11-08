import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { SceneConfig, SceneState } from './scene_config';

export class CannonTurret {
  private sprite: Sprite;

  private alreadyFired = false;

  create(scene: Phaser.Scene, sc: SceneConfig): CannonTurret {
    this.sprite = scene.physics.add.sprite(
      sc.cannonPivot.x,
      sc.cannonPivot.y,
      'cannon_turret',
    );
    return this;
  }

  update(time: number, dt: number, sc: SceneConfig): CannonTurret {
    const r = sc.rotationEasing.getValue();
    const t = r * (1 + 0.3 * Math.sin(0.01 * time));

    this.sprite.rotation = t * 20;

    const recoil = sc.cannonFireEasing.getValue();

    const px = sc.cannonPivot.x + t * 1500;
    const py = sc.cannonPivot.y - SCREEN_DIMENSIONS.y / 10 + recoil * 100;

    this.sprite.setPosition(px, py);

    // Shake based on loaded fuel
    if (sc.sceneState === SceneState.ROTATE_CANNON) {
      this.sprite.scale = 1 + 0.001 * Math.random() * sc.loadedFuel;
      this.sprite.rotation += (0.5 - Math.random()) * 0.001 * sc.loadedFuel;
    }
    return this;
  }
}
