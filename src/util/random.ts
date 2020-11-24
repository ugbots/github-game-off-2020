export const choose = <T>(xs: readonly T[]): T =>
  xs[Math.floor(Math.random() * xs.length)];
