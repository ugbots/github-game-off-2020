import { SCREEN_DIMENSIONS } from '../../util/screen';
import { titleCase } from '../../util/strings';
import { MineSceneConfig, ShipState, shipTile } from './mine_scene_config';
import { isMineable, TileResource } from './tile';

export class MiningIndicator {
  private miningText: Phaser.GameObjects.Text;

  create(sc: MineSceneConfig): MiningIndicator {
    const center = {
      x: SCREEN_DIMENSIONS.x / 2,
      y: SCREEN_DIMENSIONS.y * (11 / 12),
    };

    this.miningText = sc.scene.add.text(
      center.x - 80,
      center.y - 80,
      this.generateMiningText(sc),
      {
        fontFamily: 'monospace',
        color: '#ff0',
      },
    );

    return this;
  }

  destroy(): void {
    this.miningText.destroy();
  }

  update(sc: MineSceneConfig): void {
    this.miningText.text = this.generateMiningText(sc);
  }

  private generateMiningText(sc: MineSceneConfig): string {
    if (sc.shipConfig.shipState !== ShipState.MINING) {
      return '';
    }

    const tile = shipTile(sc);
    if (!isMineable(tile)) {
      return '';
    }

    const resource = titleCase(TileResource[tile.resource]);
    const drills = sc.shipConfig.drillPower;
    const left = Math.floor(tile.resourceLeft);

    return `Mining ${resource} (+${drills}): ${left}`;
  }
}
