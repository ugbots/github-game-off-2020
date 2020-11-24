import { keys } from '../../util/keys';

export enum Tile {
  GROUND,
  WALL,
}

const textures = keys.atlas.asteroidTiles.textures;

export const textureForTile = (tile?: Tile): string => {
  if (tile === undefined) {
    return textures.unknown;
  }

  switch (tile) {
    case Tile.GROUND:
      return textures.ground;
    case Tile.WALL:
      return textures.wall;
  }
};

export const getVerticalTexture = (bottom?: Tile, top?: Tile): string => {
  if (bottom === undefined || top === undefined) {
    return textureForTile(bottom ?? top);
  }
  if (bottom === Tile.GROUND && top === Tile.GROUND) {
    return textures.ground;
  }
  if (bottom === Tile.WALL && top === Tile.WALL) {
    return textures.wall;
  }
  if (bottom === Tile.GROUND && top === Tile.WALL) {
    return textures.wall_u_ground;
  }
  return textures.wall_d_ground;
};

export const getHorizontalTexture = (left?: Tile, right?: Tile): string => {
  if (left === undefined || right === undefined) {
    return textureForTile(left ?? right);
  }
  if (left === Tile.GROUND && right === Tile.GROUND) {
    return textures.ground;
  }
  if (left === Tile.WALL && right === Tile.WALL) {
    return textures.wall;
  }
  if (left === Tile.WALL && right === Tile.GROUND) {
    return textures.wall_l_ground;
  }
  return textures.wall_r_ground;
};
