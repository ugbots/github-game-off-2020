import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { FlightSceneConfig } from './flight_scene_config';

export class Star {
  private alphaT = 1;
  private alphaTime = 1;

  private sprite: Sprite;

  create(sc: FlightSceneConfig): Star {
    this.sprite = sc.scene.physics.add.sprite(
      SCREEN_DIMENSIONS.x * Math.random(),
      SCREEN_DIMENSIONS.y * Math.random(),
      keys.sprites.white,
    );
    this.alphaTime = 1 + Math.random() * 2;
    this.alphaT = Math.random() * Phaser.Math.PI2;
    this.sprite.scale = 3 + 10 * Math.random();

    return this;
  }

  update(time: number, dt: number, sc: FlightSceneConfig): void {
    this.sprite.alpha =
      0.6 + 0.4 * Math.sin(time * 0.003 * this.alphaTime + this.alphaT);

    const velocityMultiplier = 0.5 * (5 - 12 / this.sprite.scale);
    this.sprite.x += sc.shipVelocity.x * velocityMultiplier;
    this.sprite.y += sc.shipVelocity.y * velocityMultiplier;

    // Sprite goes left
    if (this.sprite.x < -this.sprite.scale) {
      this.sprite.x = SCREEN_DIMENSIONS.x + this.sprite.scale;
    }

    // Sprite goes right
    if (this.sprite.x > SCREEN_DIMENSIONS.x + this.sprite.scale) {
      this.sprite.x = -this.sprite.scale;
    }

    // Sprite goes off the bottom
    if (this.sprite.y > SCREEN_DIMENSIONS.y + this.sprite.scale) {
      this.sprite.y = -this.sprite.scale;
      this.sprite.x = SCREEN_DIMENSIONS.x * Math.random();
    }

    // Sprite goes off the top
    if (this.sprite.y < -this.sprite.scale) {
      this.sprite.y = SCREEN_DIMENSIONS.y + this.sprite.scale;
      this.sprite.x = SCREEN_DIMENSIONS.x * Math.random();
    }
  }
}
