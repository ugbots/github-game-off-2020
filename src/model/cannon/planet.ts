import { Vector2, Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';

export class Planet {
  private planet: Sprite;
  private cannonBase: Sprite;
  private cannonTurret: Sprite;

  private acceleration = 0;

  create(scene: Phaser.Scene): Planet {
    const cx = SCREEN_DIMENSIONS.x / 2;
    const pivotY = SCREEN_DIMENSIONS.y / 4;

    const planetY = SCREEN_DIMENSIONS.y * 2.0;

    this.planet = scene.physics.add.sprite(cx, planetY, 'planet');
    this.planet.scaleX = 16;
    this.planet.scaleY = 16;

    return this;
  }

  update(time: number, dt: number): void {
      this.planet.rotation += 0.0001 * dt;
  }
}
