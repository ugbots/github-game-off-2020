import { generateArray } from '../../util/arrays';
import { directionOffset, DIRECTIONS, oppositeDirection } from './direction';
import * as MazeGenerator from './maze_generator';
import { RoomSpec } from './room_spec';
import { TileType } from './tile';

const tilesFromFn = (
  s: RoomSpec,
  tileFn: (x: number, y: number) => TileType,
): ReadonlyArray<ReadonlyArray<TileType>> => {
  const cols: TileType[][] = [];
  for (let x = 0; x < s.width; x++) {
    const row: TileType[] = [];
    for (let y = 0; y < s.height; y++) {
      row.push(tileFn(x, y));
    }
    cols.push(row);
  }
  return cols;
};

const generateScatteredResources = (
  s: RoomSpec,
): ReadonlyArray<ReadonlyArray<TileType>> =>
  tilesFromFn(s, (x, y) => {
    if (x === 0 || y === 0 || x === s.width - 1 || y === s.height - 1) {
      return TileType.WALL;
    }
    return resourceOrGround(s.normalizedMoonDistance);
  });

const generateMiddleCross = (
  s: RoomSpec,
): ReadonlyArray<ReadonlyArray<TileType>> =>
  tilesFromFn(s, (x, y) => {
    if (x !== Math.floor(s.width / 2) && y !== Math.floor(s.height / 2)) {
      return TileType.WALL;
    }
    return resourceOrGround(s.normalizedMoonDistance);
  });

const generateMaze = (s: RoomSpec): ReadonlyArray<ReadonlyArray<TileType>> => {
  const maze = MazeGenerator.generate(
    Math.floor((s.width - 1) / 2),
    Math.floor((s.height - 1) / 2),
  );

  const tiles = tilesFromFn(s, () => TileType.WALL) as TileType[][];

  for (let x = 1; x < s.width - 1; x += 2) {
    for (let y = 1; y < s.height - 1; y += 2) {
      tiles[x][y] = resourceOrGround(s.normalizedMoonDistance);
      const node = maze[Math.floor(x / 2)][Math.floor(y / 2)];
      if (node === undefined) {
        continue;
      }
      for (const dir of DIRECTIONS) {
        if (node.exits.has(dir)) {
          const [xx, yy] = directionOffset(dir);
          tiles[x + xx][y + yy] = resourceOrGround(s.normalizedMoonDistance);
        }
      }
    }
  }

  return tiles;
};

export const ROOM_GENERATORS: ReadonlyArray<(
  s: RoomSpec,
) => ReadonlyArray<ReadonlyArray<TileType>>> = [
  generateScatteredResources,
  generateMiddleCross,
  generateMaze,
];

const resourceOrGround = (normalizedMoonDistance: number): TileType => {
  if (Math.random() < 0.1) {
    return resourceForNormalizedMoonDistance(normalizedMoonDistance);
  }
  return TileType.GROUND;
};

const resourceForNormalizedMoonDistance = (x: number): TileType => {
  if (Math.random() > 0.2 || x < 1 / 6) {
    // Fool's gold spawns instead of gold in the second half, increasing up to
    // 20% of the time.
    const foolsGoldSpawnPercentage = Math.max(0, x - 0.5);
    if (Math.random() < foolsGoldSpawnPercentage) {
      return TileType.FOOLS_GOLD;
    }

    return TileType.GOLD;
  }

  if (x < 1 / 3) {
    return TileType.EMERALD;
  }
  if (x < 2 / 3) {
    return TileType.SAPPHIRE;
  }

  return TileType.RUBY;
};
