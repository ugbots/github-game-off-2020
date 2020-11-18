export type EasingFunction = (x: number) => number;

export interface EasingButtonConfig {
  readonly fn: EasingFunction;
  readonly speed: number;
  readonly scale: number;
  readonly friction: number;
  readonly canGoNegative: boolean;
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

  update(dt: number, direction: EasingDirection): void {
    if (direction == EasingDirection.INCREASE) {
      this.value = Math.min(1, this.value + this.config.speed * dt);
    }
    if (direction == EasingDirection.DECREASE) {
      this.value = Math.max(
        this.config.canGoNegative ? -1 : 0,
        this.value - this.config.speed * dt,
      );
    }
    if (direction == EasingDirection.NONE) {
      this.value *= this.config.friction;
    }
  }

  getInternalValue(): number {
    return this.value;
  }

  getValue(): number {
    const multiplier = this.value < 0 ? -1 : 1;
    return (
      this.config.fn(multiplier * this.value) * multiplier * this.config.scale
    );
  }
}

export const easeInOut = (x: number): number =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

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
