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

const generateScatteredGold = (
  s: RoomSpec,
): ReadonlyArray<ReadonlyArray<TileType>> =>
  tilesFromFn(s, (x, y) => {
    if (x === 0 || y === 0 || x === s.width - 1 || y === s.height - 1) {
      return TileType.WALL;
    }
    if (Math.random() < 0.1) {
      return resourceForNormalizedMoonDistance(s.normalizedMoonDistance);
    }
    return TileType.GROUND;
  });

export const ROOM_GENERATORS: ReadonlyArray<(
  s: RoomSpec,
) => ReadonlyArray<ReadonlyArray<TileType>>> = [generateScatteredGold];

const resourceForNormalizedMoonDistance = (x: number): TileType => {
  if (Math.random() > 0.2 || x < 1 / 6) {
    // Fool's gold spawns instead of gold in the second half, increasing up to
    // 20% of the time.
    const foolsGoldSpawnPercentage = Math.max(0, x * 0.4 - 0.2);
    if (Math.random() < foolsGoldSpawnPercentage) {
      return TileType.FOOLS_GOLD;
    }

    return TileType.GOLD;
  }

  if (x < 2 / 4) {
    return TileType.EMERALD;
  }
  if (x < 3 / 4) {
    return TileType.SAPPHIRE;
  }

  return TileType.RUBY;
};
