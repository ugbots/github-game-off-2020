export type EasingFunction = (x: number) => number;

export interface EasingButtonConfig {
  readonly fn: EasingFunction;
  readonly speed: number;
  readonly scale: number;
  readonly friction: number;
}

export enum EasingDirection {
    INCREASE,
    DECREASE,
    NONE,
}

export class EasingButton {
  private config: EasingButtonConfig;

  private value = 0;

  constructor(config: EasingButtonConfig) {
    this.config = config;
  }

  update(dt: number, direction: EasingDirection) {
      if (direction == EasingDirection.INCREASE) {
        this.value = Math.min(1, this.value + this.config.speed * dt);
      }
      if (direction == EasingDirection.DECREASE) {
        this.value = Math.max(-1, this.value - this.config.speed * dt);
      }
      if (direction == EasingDirection.NONE) {
        this.value *= this.config.friction;
      }
  }

  getValue(): number {
    const multiplier = this.value < 0 ? -1 : 1;
    return this.config.fn(multiplier * this.value) * multiplier * this.config.scale;
  }
}

export const easeInOut = (x: number) => 
  (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
