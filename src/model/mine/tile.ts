import { keys } from '../../util/keys';

export enum TileType {
  GROUND,
  WALL,
  GOLD,
  EMERALD,
  RUBY,
}

/** The types of resources available on asteroids. */
export enum TileResource {
  /** Most common resource, available on all asteroids to some degree. */
  GOLD,
  EMERALD,
  SAPPHIRE,
  RUBY,
}

export interface Tile {
  readonly type: TileType;
}

export interface MineableTile extends Tile {
  readonly type: TileType.GOLD | TileType.RUBY | TileType.EMERALD;
  readonly resource: TileResource;
  readonly resourceMax: number;
  resourceLeft: number;
}

export const buildTile = (type: TileType): Tile => {
  switch (type) {
    case TileType.GROUND: // fall through
    case TileType.WALL:
      return { type };
    case TileType.GOLD: // fall through
    case TileType.RUBY: // fall through
    case TileType.EMERALD:
      const mineableTile: MineableTile = {
        type,
        resource: resourceForTileType(type),
        resourceMax: 100,
        resourceLeft: 100,
      };
      return mineableTile;
  }
};

const resourceForTileType = (type: TileType): TileResource => {
  switch (type) {
    case TileType.GOLD:
      return TileResource.GOLD;
    case TileType.RUBY:
      return TileResource.RUBY;
    case TileType.EMERALD:
      return TileResource.EMERALD;
    case TileType.GROUND: // fall through
    case TileType.WALL:
      throw new Error('TileType not a resource!');
  }
};

const textures = keys.atlas.asteroidTiles.textures;

export const textureForTile = (tile?: TileType): string => {
  if (tile === undefined) {
    return textures.transparent;
  }

  switch (tile) {
    case TileType.GROUND:
      return textures.ground;
    case TileType.WALL:
      return textures.wall;
    case TileType.GOLD:
      return textures.gold;
    case TileType.RUBY:
      return textures.ruby;
    case TileType.EMERALD:
      return textures.emerald;
  }
};

/**
 * If a tile should have another tile rendered underneath it, returns that
 * tile.
 */
export const tileUnderneath = (tile?: TileType): TileType | undefined => {
  switch (tile) {
    case TileType.GOLD: // fall through
    case TileType.RUBY: // fall through
    case TileType.GROUND: // fall through
    case TileType.EMERALD:
      return TileType.GROUND;
    case TileType.WALL:
    case undefined:
      return undefined;
  }
};

export const isWalkable = (tile: Tile): boolean => {
  switch (tile.type) {
    case TileType.GROUND: // fall through
    case TileType.GOLD: // fall through
    case TileType.RUBY: // fall through
    case TileType.EMERALD: // fall through
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
    case TileType.RUBY: // fall through
    case TileType.EMERALD: // fall through
      return (tile as MineableTile).resourceLeft > 0;
  }
};
