import { RoomSpec } from './room_spec';
import { Tile } from './tile';

const tilesFromFn = (
  s: RoomSpec,
  tileFn: (x: number, y: number) => Tile,
): ReadonlyArray<ReadonlyArray<Tile>> => {
  const cols = [];
  for (let x = 0; x < s.width; x++) {
    const row = [];
    for (let y = 0; y < s.height; y++) {
      row.push(tileFn(x, y));
    }
    cols.push(row);
  }
  return cols;
};

const generateEmptyRoom = (s: RoomSpec): ReadonlyArray<ReadonlyArray<Tile>> =>
  tilesFromFn(s, () => Tile.EMPTY);

export const ROOM_GENERATORS: ReadonlyArray<(
  s: RoomSpec,
) => ReadonlyArray<ReadonlyArray<Tile>>> = [generateEmptyRoom];
