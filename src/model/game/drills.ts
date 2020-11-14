export interface Drill {
  readonly kind: 'Drill';
  readonly name: string;
  readonly power: number;
}

export const CRAPPY_DRILL: Drill = {
  kind: 'Drill',
  name: 'Crappy drill',
  power: 1,
};

export const BETTER_DRILL: Drill = {
  kind: 'Drill',
  name: 'Better drill',
  power: 3,
};
