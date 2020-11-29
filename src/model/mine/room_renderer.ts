import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import {
  MineSceneConfig,
  shipCoords,
  ShipState,
  shipTile,
} from './mine_scene_config';
import { Room, TILE_SIZE } from './room';
import {
  isMineable,
  MineableTile,
  textureForTile,
  TileType,
  tileUnderneath,
} from './tile';

export class RoomRenderer {
  private room: Room;
  private sprites: readonly Phaser.GameObjects.Sprite[][][] = [];

  private showingFoolsGold = false;

  create(sc: MineSceneConfig): RoomRenderer {
    this.room = sc.currentRoom;
    this.sprites = this.generateSprites(sc.currentRoom, sc);
    return this;
  }

  destroy(): void {
    this.destroySprites();
  }

  update(sc: MineSceneConfig): void {
    if (this.room !== sc.currentRoom) {
      this.refreshSprites(sc.currentRoom);
      this.room = sc.currentRoom;
    }

    if (
      !this.showingFoolsGold &&
      sc.shipConfig.foolsGoldRadarEasing.getValue() === 1
    ) {
      this.showingFoolsGold = true;
      this.setFoolsGoldVisible(sc.currentRoom, true);
    }
    if (
      this.showingFoolsGold &&
      sc.shipConfig.foolsGoldRadarEasing.getValue() !== 1
    ) {
      this.showingFoolsGold = false;
      this.setFoolsGoldVisible(sc.currentRoom, false);
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

  private generateSprites(
    room: Room,
    sc: MineSceneConfig,
  ): readonly Phaser.GameObjects.Sprite[][][] {
    return room.tiles.map((xs, x) =>
      xs.map((tile, y) => {
        const underSprite = sc.scene.add.sprite(
          (x + 0.5) * TILE_SIZE.x,
          (y + 0.5) * TILE_SIZE.y,
          keys.atlas.asteroidTiles.key,
          textureForTile(tileUnderneath(tile.type)),
        );

        const sprite = sc.scene.add.sprite(
          (x + 0.5) * TILE_SIZE.x,
          (y + 0.5) * TILE_SIZE.y,
          keys.atlas.asteroidTiles.key,
          textureForTile(tile.type),
        );

        const sprites = [underSprite, sprite];

        sprites.forEach((sprite) => {
          sprite.setOrigin(0.5);
          sprite.setScale(TILE_SIZE.x / 32);
        });

        return sprites;
      }),
    );
  }

  private refreshSprites(room: Room): void {
    room.tiles.forEach((xs, x) =>
      xs.forEach((tile, y) => {
        const underTexture = textureForTile(tileUnderneath(tile.type));
        const spriteTexture = textureForTile(tile.type);

        this.sprites[x][y][0].setFrame(underTexture);
        this.sprites[x][y][1].setFrame(spriteTexture);

        /*
        if (isMineable(tile)) {
          this.sprites[x][y][1].setScale(
            (tile.resourceLeft / tile.resourceMax) * (TILE_SIZE.x / 32),
          );
        }
        */

        this.sprites[x][y].forEach((sprite) => {
          sprite.setOrigin(0.5);
        });
      }),
    );
  }

  private setFoolsGoldVisible(room: Room, visible: boolean): void {
    room.tiles.forEach((xs, x) =>
      xs.forEach((tile, y) => {
        if (tile.type === TileType.FOOLS_GOLD) {
          const texture = visible
            ? keys.atlas.asteroidTiles.textures.foolsGold
            : keys.atlas.asteroidTiles.textures.gold;
          this.sprites[x][y][1].setFrame(texture);
          this.sprites[x][y][1].setOrigin(0.5);
        }
      }),
    );
  }
}
