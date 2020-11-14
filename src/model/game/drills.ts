export interface Drill {
  readonly kind: 'Drill';
  readonly name: string;
}

export const CRAPPY_DRILL: Drill = {
  kind: 'Drill',
  name: 'Crappy drill',
};

export const BETTER_DRILL: Drill = {
  kind: 'Drill',
  name: 'Better drill',
};
