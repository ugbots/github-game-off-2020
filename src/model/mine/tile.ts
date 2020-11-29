import { keys } from '../../util/keys';

export enum TileType {
  GROUND,
  WALL,
  GOLD,
  EMERALD,
  SAPPHIRE,
  RUBY,
  FOOLS_GOLD,
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
  readonly type:
    | TileType.GOLD
    | TileType.RUBY
    | TileType.SAPPHIRE
    | TileType.EMERALD;
  readonly resource: TileResource;
  readonly resourceMax: number;
  resourceLeft: number;
}

export const buildTile = (type: TileType): Tile => {
  switch (type) {
    case TileType.GROUND: // fall through
    case TileType.WALL: // fall through
    case TileType.FOOLS_GOLD:
      return { type };
    case TileType.GOLD: // fall through
    case TileType.RUBY: // fall through
    case TileType.SAPPHIRE: // fall through
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
    case TileType.EMERALD:
      return TileResource.EMERALD;
    case TileType.SAPPHIRE:
      return TileResource.SAPPHIRE;
    case TileType.RUBY:
      return TileResource.RUBY;
    case TileType.GROUND: // fall through
    case TileType.WALL: // fall through
    case TileType.FOOLS_GOLD:
      throw new Error('TileType not a resource!');
  }
};

const textures = keys.atlas.asteroidTiles.textures;

export const textureForTile = (tile: TileType): string => {
  if (tile === undefined) {
    return textures.transparent;
  }

  switch (tile) {
    case TileType.GROUND:
      return textures.ground;
    case TileType.WALL:
      return textures.wall;
    case TileType.GOLD: // fall through
    case TileType.FOOLS_GOLD:
      return textures.gold;
    case TileType.RUBY:
      return textures.ruby;
    case TileType.EMERALD:
      return textures.emerald;
    case TileType.SAPPHIRE:
      return textures.sapphire;
  }
};

/**
 * If a tile should have another tile rendered underneath it, returns that
 * tile.
 */
export const tileUnderneath = (tile?: TileType): TileType => {
  switch (tile) {
    case TileType.GOLD: // fall through
    case TileType.RUBY: // fall through
    case TileType.GROUND: // fall through
    case TileType.SAPPHIRE: // fall through
    case TileType.FOOLS_GOLD: // fall through
    case TileType.EMERALD:
      return TileType.GROUND;
    case TileType.WALL:
      return TileType.WALL;
    case undefined:
      return TileType.GOLD;
  }
};

export const isWalkable = (tile: Tile): boolean => {
  switch (tile.type) {
    case TileType.GROUND: // fall through
    case TileType.GOLD: // fall through
    case TileType.RUBY: // fall through
    case TileType.EMERALD: // fall through
    case TileType.SAPPHIRE: // fall through
    case TileType.FOOLS_GOLD: // fall through
      return true;
    case TileType.WALL:
      return false;
  }
};

export const isMineable = (tile: Tile): tile is MineableTile => {
  switch (tile.type) {
    case TileType.GROUND: // fall through
    case TileType.WALL: // fall through
    // Technically not mineable, since it doesn't implement MineableTile.
    case TileType.FOOLS_GOLD:
      return false;
    case TileType.GOLD:
    case TileType.RUBY: // fall through
    case TileType.EMERALD: // fall through
    case TileType.SAPPHIRE: // fall through
      return (tile as MineableTile).resourceLeft > 0;
  }
};
