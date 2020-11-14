export const sortBy = <T>(
  xs: readonly T[],
  f: (t: T) => string | number,
): readonly T[] =>
  [...xs].sort((a, b) => {
    const fa = f(a);
    const fb = f(b);
    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
