import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { SceneConfig } from './scene_config';

export class Star {
  private alphaT = 1;
  private alphaTime = 1;

  private sprite: Sprite;

  create(sc: SceneConfig): Star {
    this.sprite = sc.scene.physics.add.sprite(
      SCREEN_DIMENSIONS.x * Math.random(),
      SCREEN_DIMENSIONS.y * Math.random(),
      'white',
    );
    this.alphaTime = 1 + Math.random() * 2;
    this.alphaT = Math.random() * Phaser.Math.PI2;
    this.sprite.scale = 3 + 20 * Math.random();

    return this;
  }
  update(time: number, dt: number, sc: SceneConfig): void {
    this.sprite.alpha =
      0.6 + 0.4 * Math.sin(time * 0.003 * this.alphaTime + this.alphaT);
  }
}