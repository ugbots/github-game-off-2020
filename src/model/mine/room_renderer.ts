import { keys } from '../../util/keys';
import { MineSceneConfig } from './mine_scene_config';
import { Room } from './room';

const SPRITE_SIZE = {
  x: 16,
  y: 16,
};

const SPRITE_SCALE = 2;

export class RoomRenderer {
  private sprites: ReadonlyArray<ReadonlyArray<Phaser.GameObjects.Sprite>>;
  private room: Room;

  create(sc: MineSceneConfig): RoomRenderer {
    this.sprites = this.refreshSprites(sc.currentRoom, sc);
    return this;
  }

  update(time: number, dt: number, sc: MineSceneConfig): void {
    if (this.room !== sc.currentRoom) {
      this.room = sc.currentRoom;
      this.sprites = this.refreshSprites(sc.currentRoom, sc);
    }
  }

  private refreshSprites(
    room: Room,
    sc: MineSceneConfig,
  ): ReadonlyArray<ReadonlyArray<Phaser.GameObjects.Sprite>> {
    return room.tiles.map((xs, x) =>
      xs.map((_, y) => {
        const xSize = SPRITE_SIZE.x * SPRITE_SCALE;
        const ySize = SPRITE_SIZE.y * SPRITE_SCALE;

        const sprite = sc.scene.add.sprite(
          x * xSize - xSize / 2,
          y * ySize - ySize / 2,
          keys.atlas.asteroidTiles.textures.dirt1,
        );

        // sprite.scale = SPRITE_SCALE;

        return sprite;
      }),
    );
  }
}
