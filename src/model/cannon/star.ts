import { cartesianFromPolar, Polar2 } from '../../math/polar';
import { Sprite, Vector2 } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { SceneConfig } from './scene_config';

export class Star {
  private initialPolar: Polar2;

  private polar: Polar2;
  private cartesian: Vector2 = new Vector2();

  private angle = 0;
  private alphaT = 0;
  private alphaTime = 0;
  private sprite: Sprite;

  create(scene: Phaser.Scene, sc: SceneConfig): Star {
    this.initialPolar = {
      r: 1024 + Math.random() * (maxStarDistance(sc) - 1024),
      θ: Math.random() * Phaser.Math.PI2,
    };
    this.polar = {...this.initialPolar};

    this.alphaTime = 1 + Math.random() * 2;
    this.alphaT = Math.random() * Phaser.Math.PI2;

    this.angle = this.initialPolar.θ;

    cartesianFromPolar(this.cartesian, this.initialPolar);

    const scale = 3 + Math.random() * 15;

    this.sprite = scene.physics.add.sprite(
      this.cartesian.x,
      this.cartesian.y,
      'white',
    );
    this.sprite.scaleX = scale;
    this.sprite.scaleY = scale;

    this.sprite.rotation = Math.random() * Phaser.Math.PI2;

    return this;
  }

  update(time: number, dt: number, sc: SceneConfig): Star {
    this.polar.θ = this.initialPolar.θ + sc.rotation;

    cartesianFromPolar(this.cartesian, this.polar);

    this.cartesian.add(sc.planetPivot);

    this.sprite.setPosition(this.cartesian.x, this.cartesian.y);

    this.sprite.alpha = .6 + .4 * Math.sin(
      time * 0.003 * this.alphaTime + this.alphaT);

    return this;
  }
}

const maxStarDistance = (sc: SceneConfig): number =>
  sc.planetPivot.length();
