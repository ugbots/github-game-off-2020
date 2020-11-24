import { Direction } from './direction';
import { ROOM_GENERATORS } from './room_generators';
import { RoomSpec } from './room_spec';
import { Tile } from './tile';

export interface Room {
  /**
   * All tiles in this room. The outer array is holds columns, so we can index
   * as (x, y).
   */
  readonly tiles: ReadonlyArray<ReadonlyArray<Tile>>;
  readonly exits: ReadonlyMap<Direction, Room>;
}

export const generateRooms = (
  totalRooms: number,
  spec: RoomSpec,
): readonly Room[] => {
  const roomsWithoutExits = Array(totalRooms)
    .fill(0)
    .map(() => {
      return generateRoom(spec);
    });

  return roomsWithoutExits;
};

export const generateRoom = (spec: RoomSpec): Room => {
  const gen =
    ROOM_GENERATORS[Math.floor(Math.random() * ROOM_GENERATORS.length)];

  return {
    tiles: gen(spec),
    exits: new Map(),
  };
};
