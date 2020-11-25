import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import { Direction } from './direction';
import {
  MineSceneConfig,
  MineShipConfig,
  ShipState,
} from './mine_scene_config';

export class MineShip {
  private sprite: Sprite;

  create(sc: MineSceneConfig): MineShip {
    this.sprite = sc.scene.physics.add.sprite(
      sc.shipConfig.position.x,
      sc.shipConfig.position.y,
      keys.sprites.drillShip,
    );

    return this;
  }

  destroy(): void {
    this.sprite.destroy();
  }

  update(sc: MineSceneConfig): void {
    this.sprite.rotation = this.generateRotation(sc.shipConfig);

    const shakeMul = sc.shipConfig.shipState === ShipState.MINING ? 2.5 : 0;

    this.sprite.x =
      sc.shipConfig.position.x + (2 * Math.random() - 1) * shakeMul;
    this.sprite.y =
      sc.shipConfig.position.y + (2 * Math.random() - 1) * shakeMul;
  }

  private generateRotation(sc: MineShipConfig): number {
    switch (sc.direction) {
      case Direction.NORTH:
        return 0;
      case Direction.EAST:
        return Math.PI / 2;
      case Direction.SOUTH:
        return Math.PI;
      case Direction.WEST:
        return Math.PI * (3 / 2);
    }
  }
}
