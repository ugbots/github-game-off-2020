export const clamp = (min: number, value: number, max: number):number =>
  Math.min(max, Math.max(min, value));