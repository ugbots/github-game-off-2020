export const titleCase = (s: string): string =>
  s.charAt(0).toLocaleUpperCase() + s.substring(1).toLocaleLowerCase();
