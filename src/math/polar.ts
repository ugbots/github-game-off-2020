import { Vector2 } from '../util/phaser_types';

export interface Polar2 {
  r: number;
  θ: number;
}

export const cartesianFromPolar = (c: Vector2, polar: Polar2) => {
  c.x = polar.r * Math.cos(polar.θ);
  c.y = polar.r * Math.sin(polar.θ);
};
