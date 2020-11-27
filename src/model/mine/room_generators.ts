import { normalizeGenFileSuffix } from '@angular/compiler/src/aot/util';
import { choose } from '../../util/random';
import { Cost } from '../game/cost';
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
  const emeraldsAround = x > 1 / 3 && x < 2 / 3;
  if (emeraldsAround && Math.random() < 0.2) {
    return TileType.EMERALD;
  }

  const rubiesAround = x > 2 / 3;
  if (rubiesAround && Math.random() < 0.2) {
    return TileType.RUBY;
  }

  return TileType.GOLD;
};
