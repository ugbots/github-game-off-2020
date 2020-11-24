export enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

export const DIRECTIONS: readonly Direction[] = [
  Direction.NORTH,
  Direction.EAST,
  Direction.SOUTH,
  Direction.WEST,
];

export const directionOffset = (d: Direction): [number, number] => {
  switch (d) {
    case Direction.NORTH:
      return [0, -1];
    case Direction.EAST:
      return [1, 0];
    case Direction.SOUTH:
      return [0, 1];
    case Direction.WEST:
      return [-1, 0];
  }
};
