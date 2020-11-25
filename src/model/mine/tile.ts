import { keys } from '../../util/keys';

export enum TileType {
  GROUND,
  WALL,
  GOLD,
}

export enum TileResource {
  GOLD,
}

export interface Tile {
  readonly type: TileType;
}

export interface MineableTile extends Tile {
  readonly type: TileType.GOLD;
  readonly resource: TileResource;
  resourceLeft: number;
}

export const buildTile = (type: TileType): Tile => {
  switch (type) {
    case TileType.GROUND:
    case TileType.WALL:
      return { type };
    case TileType.GOLD:
      const mineableTile: MineableTile = {
        type,
        resource: TileResource.GOLD,
        resourceLeft: 100,
      };
      return mineableTile;
  }
};

const textures = keys.atlas.asteroidTiles.textures;

export const textureForTile = (tile: TileType): string => {
  if (tile === undefined) {
    return textures.unknown;
  }

  switch (tile) {
    case TileType.GROUND:
      return textures.ground;
    case TileType.WALL:
      return textures.wall;
    case TileType.GOLD:
      return textures.gold;
  }
};

/** If a tile should have another tile rendered underneath it, returns that tile. */
export const tileUnderneath = (tile: TileType): TileType | undefined => {
  switch (tile) {
    case TileType.GOLD:
      return TileType.GROUND;
    case TileType.GROUND:
    case TileType.WALL:
      return undefined;
  }
};

export const isWalkable = (tile: Tile): boolean => {
  switch (tile.type) {
    case TileType.GROUND: // fall through
    case TileType.GOLD: // fall through
      return true;
    case TileType.WALL:
      return false;
  }
};

export const isMineable = (tile: Tile): tile is MineableTile => {
  switch (tile.type) {
    case TileType.GROUND: // fall through
    case TileType.WALL: // fall through
      return false;
    case TileType.GOLD:
      return (tile as MineableTile).resourceLeft > 0;
  }
};
