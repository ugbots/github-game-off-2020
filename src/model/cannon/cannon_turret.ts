import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { SceneConfig } from './scene_config';

export class CannonTurret {
  private sprite: Sprite;

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
    this.sprite.rotation = r * 20;

    const px = sc.cannonPivot.x + sc.rotationEasing.getValue() * 2000;
    const py = sc.cannonPivot.y - SCREEN_DIMENSIONS.y / 10;

    this.sprite.setPosition(px, py);
    return this;
  }
}
