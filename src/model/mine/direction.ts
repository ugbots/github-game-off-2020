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

export const oppositeDirection = (d: Direction): Direction => {
  switch (d) {
    case Direction.NORTH:
      return Direction.SOUTH;
    case Direction.SOUTH:
      return Direction.NORTH;
    case Direction.EAST:
      return Direction.WEST;
    case Direction.WEST:
      return Direction.EAST;
  }
};
