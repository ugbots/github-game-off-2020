import { generateArray } from '../../util/arrays';
import { keys } from '../../util/keys';
import { Direction } from './direction';
import { MineSceneConfig } from './mine_scene_config';
import { Room, roomAdjacency } from './room';
import {
  getHorizontalTexture,
  getVerticalTexture,
  textureForTile,
} from './tile';

const SPRITE_SIZE = {
  x: 32,
  y: 32,
};

export class RoomRenderer {
  private room: Room;
  private sprites: ReadonlyArray<ReadonlyArray<Phaser.GameObjects.Sprite>>;

  create(sc: MineSceneConfig): RoomRenderer {
    this.sprites = this.refreshSprites(sc.currentRoom, sc);
    return this;
  }

  update(sc: MineSceneConfig): void {
    if (this.room !== sc.currentRoom) {
      this.room = sc.currentRoom;
      this.sprites = this.refreshSprites(sc.currentRoom, sc);
    }
  }

  private refreshSprites(
    room: Room,
    sc: MineSceneConfig,
  ): ReadonlyArray<ReadonlyArray<Phaser.GameObjects.Sprite>> {
    return generateArray(room.tiles.length * 2, (x) =>
      generateArray(room.tiles[0].length * 2, (y) => {
        // If both coords are even, we're exactly on a tile.
        let texture = keys.atlas.asteroidTiles.textures.wall;
        if (x % 2 === 0 && y % 2 === 0) {
          texture = textureForTile(room.tiles[x / 2][y / 2]);
        } else if (x % 2 === 0) {
          // Get vertically blended texture
          const adj = roomAdjacency(room, Math.floor(x / 2), Math.floor(y / 2));
          texture = getVerticalTexture(
            adj.get(Direction.SOUTH),
            adj.get(Direction.NORTH),
          );
        } else if (y % 2 === 0) {
          // Get horizontally blended texture
          const adj = roomAdjacency(room, Math.floor(x / 2), Math.floor(y / 2));
          texture = getHorizontalTexture(
            adj.get(Direction.EAST),
            adj.get(Direction.WEST),
          );
        }

        return sc.scene.add.sprite(
          x * SPRITE_SIZE.x,
          y * SPRITE_SIZE.y,
          keys.atlas.asteroidTiles.key,
          texture,
        );
      }),
    );
  }
}
