import { keys } from '../../util/keys';
import { Direction } from './direction';

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
