import { cartesianFromPolar, Polar2 } from '../../math/polar';
import { keys } from '../../util/keys';
import { Vector2 } from '../../util/phaser_types';
import { CannonSceneConfig } from './cannon_scene_config';

export class Star {
  private initialPolar: Polar2;

  private polar: Polar2;
  private cartesian: Vector2 = new Vector2();

  private alphaT = 0;
  private alphaTime = 0;
  private sprite: Phaser.GameObjects.Sprite;

  create(scene: Phaser.Scene, sc: CannonSceneConfig): Star {
    this.initialPolar = {
      r: 1024 + Math.random() * (maxStarDistance(sc) - 1024),
      θ: Math.random() * Phaser.Math.PI2,
    };
    this.polar = { ...this.initialPolar };

    this.alphaTime = 1 + Math.random() * 2;
    this.alphaT = Math.random() * Phaser.Math.PI2;

    cartesianFromPolar(this.cartesian, this.initialPolar);
    this.cartesian.add(sc.planetPivot);

    const scale = 3 + Math.random() * 15;

    this.sprite = scene.add.sprite(
      this.cartesian.x,
      this.cartesian.y,
      keys.sprites.white,
    );
    this.sprite.scaleX = scale;
    this.sprite.scaleY = scale;

    this.sprite.rotation = Math.random() * Phaser.Math.PI2;

    return this;
  }

  destroy(): void {
    this.sprite.destroy();
  }

  update(time: number, dt: number, sc: CannonSceneConfig): Star {
    this.polar.θ = this.initialPolar.θ + sc.rotation;

    cartesianFromPolar(this.cartesian, this.polar);

    this.cartesian.add(sc.planetPivot);

    this.sprite.setPosition(this.cartesian.x, this.cartesian.y);

    this.sprite.alpha =
      0.6 + 0.4 * Math.sin(time * 0.003 * this.alphaTime + this.alphaT);

    return this;
  }
}

const maxStarDistance = (sc: CannonSceneConfig): number =>
  sc.planetPivot.length();
