export type EasingFunction = (x: number) => number;

export interface EasingButtonConfig {
  readonly fn: EasingFunction;
  readonly speed: number;
  readonly scale: number;
  readonly friction: number;
  readonly canGoNegative: boolean;
  readonly initialValue?: number;
}

export enum EasingDirection {
  INCREASE,
  DECREASE,
  NONE,
}

export class EasingButton {
  private config: EasingButtonConfig;
  private speed = 0;

  private value = 0;

  constructor(config: EasingButtonConfig) {
    if (config.initialValue !== undefined) {
      if (config.initialValue < -1 || config.initialValue > 1) {
        throw new Error('Initial value invalid: ' + config.initialValue);
      }
      this.value = config.initialValue;
    }
    this.config = config;
    this.speed = this.config.speed;
  }

  update(dt: number, direction: EasingDirection): void {
    if (direction == EasingDirection.INCREASE) {
      this.value = Math.min(1, this.value + this.speed * dt);
    }
    if (direction == EasingDirection.DECREASE) {
      this.value = Math.max(
        this.config.canGoNegative ? -1 : 0,
        this.value - this.speed * dt,
      );
    }
    if (direction == EasingDirection.NONE) {
      this.value *= this.config.friction;
    }
  }

  getInternalValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
  }

  setSpeed(speed: number): void {
    this.speed = speed;
  }

  resetSpeed(): void {
    this.speed = this.config.speed;
  }

  getValue(): number {
    const multiplier = this.value < 0 ? -1 : 1;
    return (
      this.config.fn(multiplier * this.value) * multiplier * this.config.scale
    );
  }
}

export const linear = (x: number): number => x;

export const easeInOut = (x: number): number =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

export const easeInQuint = (x: number): number => x * x * x * x * x;

export const recoil = (x: number): number =>
  x < 0.0001 ? 0 : -Math.pow(x - 1, 3);

export const easeOutElastic = (x: number): number => {
  const c4 = (2 * Math.PI) / 3;

  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};
