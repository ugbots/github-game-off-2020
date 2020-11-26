import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import {
  MineSceneConfig,
  shipCoords,
  ShipState,
  shipTile,
} from './mine_scene_config';
import { Room, TILE_SIZE } from './room';
import { MineableTile, textureForTile, tileUnderneath } from './tile';

export class RoomRenderer {
  private room: Room;
  private sprites: readonly Phaser.GameObjects.Sprite[][][] = [];

  create(sc: MineSceneConfig): RoomRenderer {
    this.room = sc.currentRoom;
    this.sprites = this.refreshSprites(sc.currentRoom, sc);
    return this;
  }

  destroy(): void {
    this.destroySprites();
  }

  update(sc: MineSceneConfig): void {
    if (this.room !== sc.currentRoom) {
      this.sprites = this.refreshSprites(sc.currentRoom, sc);
      this.room = sc.currentRoom;
    }

    if (sc.shipConfig.shipState === ShipState.MINING) {
      const { x, y } = shipCoords(sc);
      const upperSprite = this.sprites[x][y][1];
      const tile = shipTile(sc) as MineableTile;

      const leftRatio = tile.resourceLeft / tile.resourceMax;
      const scale = Math.pow(leftRatio, 0.25) * (TILE_SIZE.x / 32);
      upperSprite.scale = scale;
    }
  }

  private destroySprites(): void {
    this.sprites.forEach((xs) => {
      xs.forEach((ys) => {
        ys.forEach((sprite) => {
          sprite.destroy();
        });
      });
    });
  }

  private refreshSprites(
    room: Room,
    sc: MineSceneConfig,
  ): readonly Sprite[][][] {
    this.destroySprites();

    return room.tiles.map((xs, x) =>
      xs.map((tile, y) => {
        const underneath = tileUnderneath(tile.type);
        let underSprite: Phaser.GameObjects.Sprite | undefined = undefined;
        if (underneath !== undefined) {
          underSprite = sc.scene.add.sprite(
            (x + 0.5) * TILE_SIZE.x,
            (y + 0.5) * TILE_SIZE.y,
            keys.atlas.asteroidTiles.key,
            textureForTile(underneath),
          );
        }

        const sprite = sc.scene.add.sprite(
          (x + 0.5) * TILE_SIZE.x,
          (y + 0.5) * TILE_SIZE.y,
          keys.atlas.asteroidTiles.key,
          textureForTile(tile.type),
        );

        const sprites = [underSprite, sprite]
          .filter((x) => x !== undefined)
          .map((x) => x as Sprite);

        sprites.forEach((sprite) => {
          sprite.setOrigin(0.5);
          sprite.setScale(TILE_SIZE.x / 32);
        });

        return sprites;
      }),
    );
  }
}
