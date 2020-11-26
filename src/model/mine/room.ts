import { choose } from '../../util/random';
import {
  Direction,
  directionOffset,
  DIRECTIONS,
  oppositeDirection,
} from './direction';
import { ROOM_GENERATORS } from './room_generators';
import { RoomSpec } from './room_spec';
import { buildTile, Tile, TileType } from './tile';

export const TILE_SIZE = {
  x: 64,
  y: 64,
};

export interface Room {
  /**
   * All tiles in this room. The outer array is holds columns, so we can index
   * as (x, y).
   */
  readonly tiles: ReadonlyArray<ReadonlyArray<Tile>>;
  readonly exits: ReadonlyMap<Direction, Room>;
}

/**
 * Local interface which exposes the exits as mutable, to make it easier to
 * hook up exits.
 */
interface MutableRoom {
  tiles: Tile[][];
  exits: Map<Direction, Room>;
}

export const generateRooms = (
  totalRooms: number,
  spec: RoomSpec,
): readonly Room[] => {
  const rooms = generateAndLinkRooms(
    spec,
    [generateRoom(spec)],
    totalRooms - 1,
  );
  rooms.forEach((r) => {
    carveExits(spec, r);
  });

  return rooms;
};

export const generateRoom = (spec: RoomSpec): MutableRoom => {
  const gen =
    ROOM_GENERATORS[Math.floor(Math.random() * ROOM_GENERATORS.length)];

  return {
    tiles: gen(spec).map((xs) => xs.map(buildTile)),
    exits: new Map(),
  };
};

export const roomAdjacency = (
  room: Room,
  x: number,
  y: number,
): ReadonlyMap<Direction, TileType> => {
  return new Map(
    DIRECTIONS.map((dir) => {
      const [xo, yo] = directionOffset(dir);

      const [xx, yy] = [xo + x, yo + y];

      if (
        xx < 0 ||
        yy < 0 ||
        xx >= room.tiles.length ||
        yy >= room.tiles[xx].length
      ) {
        return undefined;
      }

      return [dir, room.tiles[xx][yy]];
    })
      .filter((x) => x !== undefined)
      .map((x) => x as [Direction, TileType]),
  );
};

const generateAndLinkRooms = (
  spec: RoomSpec,
  rooms: readonly MutableRoom[],
  left: number,
): readonly MutableRoom[] => {
  if (left <= 0) {
    return rooms;
  }

  const newRooms = linkRoom(rooms, generateRoom(spec), 10);

  return generateAndLinkRooms(spec, newRooms, left - 1);
};

const linkRoom = (
  rooms: readonly MutableRoom[],
  room: MutableRoom,
  triesLeft: number,
): readonly MutableRoom[] => {
  if (triesLeft <= 0) {
    throw new Error("Can't generate rooms, out of tries!");
  }
  const candidate = choose(rooms);
  const exit = choose(DIRECTIONS);

  // If there's already an exit here, try again.
  if (candidate.exits.has(exit)) {
    return linkRoom(rooms, room, triesLeft - 1);
  }

  // Otherwise, link it up!
  candidate.exits.set(exit, room);
  room.exits.set(oppositeDirection(exit), candidate);

  return [...rooms, room];
};

const carveExits = (spec: RoomSpec, room: MutableRoom): void => {
  const tiles = room.tiles;

  if (room.exits.has(Direction.NORTH)) {
    for (let x = spec.width * (2 / 5); x < spec.width * (3 / 5); x++) {
      tiles[x][0] = buildTile(TileType.GROUND);
    }
  }
  if (room.exits.has(Direction.SOUTH)) {
    for (let x = spec.width * (2 / 5); x < spec.width * (3 / 5); x++) {
      tiles[x][spec.height - 1] = buildTile(TileType.GROUND);
    }
  }
  if (room.exits.has(Direction.EAST)) {
    for (let y = spec.height * (1 / 3); y < spec.height * (2 / 3); y++) {
      tiles[spec.width - 1][y] = buildTile(TileType.GROUND);
    }
  }
  if (room.exits.has(Direction.WEST)) {
    for (let y = spec.height * (1 / 3); y < spec.height * (2 / 3); y++) {
      tiles[0][y] = buildTile(TileType.GROUND);
    }
  }
};
