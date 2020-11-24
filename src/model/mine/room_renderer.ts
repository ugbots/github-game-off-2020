import { keys } from '../../util/keys';
import { MineSceneConfig } from './mine_scene_config';
import { Room } from './room';
import { textureForTile } from './tile';

const SPRITE_SIZE = {
  x: 32,
  y: 32,
};

export class RoomRenderer {
  private room: Room;
  private sprites: ReadonlyArray<ReadonlyArray<Phaser.GameObjects.Sprite>> = [];

  create(sc: MineSceneConfig): RoomRenderer {
    this.sprites = this.refreshSprites(sc.currentRoom, sc);
    return this;
  }

  update(sc: MineSceneConfig): void {
    if (this.room !== sc.currentRoom) {
      this.sprites = this.refreshSprites(sc.currentRoom, sc);
      this.room = sc.currentRoom;
    }
  }

  private refreshSprites(
    room: Room,
    sc: MineSceneConfig,
  ): ReadonlyArray<ReadonlyArray<Phaser.GameObjects.Sprite>> {
    return room.tiles.map((xs, x) =>
      xs.map((tile, y) =>
        sc.scene.add.sprite(
          x * SPRITE_SIZE.x,
          y * SPRITE_SIZE.y,
          keys.atlas.asteroidTiles.key,
          textureForTile(tile),
        ),
      ),
    );
  }
}
