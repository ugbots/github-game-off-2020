import { Rectangle } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { shipStatTotal } from '../game/game_state';
import { MineSceneConfig } from './mine_scene_config';

const MAX_WIDTH = SCREEN_DIMENSIONS.x * (3 / 4);

export class MineSceneBatteryIndicator {
  private bgRect: Rectangle;
  private fgRect: Rectangle;
  private text: Phaser.GameObjects.Text;

  create(sc: MineSceneConfig): MineSceneBatteryIndicator {
    const center = {
      x: SCREEN_DIMENSIONS.x / 2,
      y: SCREEN_DIMENSIONS.y * (11 / 12),
    };

    this.bgRect = sc.scene.add.rectangle(
      center.x,
      center.y,
      MAX_WIDTH,
      16,
      0xffffff,
    );

    this.fgRect = sc.scene.add.rectangle(
      center.x,
      center.y,
      MAX_WIDTH,
      16,
      0x00ff00,
    );

    this.text = sc.scene.add.text(
      center.x - 80,
      center.y + 20,
      this.generateText(sc),
      {
        fontFamily: 'monospace',
        color: '#0f0',
      },
    );

    return this;
  }

  destroy(): void {
    this.bgRect.destroy();
    this.fgRect.destroy();
    this.text.destroy();
  }

  update(sc: MineSceneConfig): void {
    const radar = sc.shipConfig.foolsGoldRadarEasing.getValue();
    this.fgRect.fillColor = radar > 0 ? 0xff0000 : 0x00ff00;
    this.text.style.setColor(radar > 0 ? '#f00' : '#0f0');

    this.fgRect.width =
      (this.bgRect.width * sc.shipConfig.batteryEasing.getValue()) / 100;

    this.text.text = this.generateText(sc);
  }

  private generateText(sc: MineSceneConfig): string {
    const batteries = shipStatTotal(sc.gameState, (x) => x.batteries);
    const percent = Math.floor(sc.shipConfig.batteryEasing.getValue());

    return `Battery (+${batteries}): ${percent}%`;
  }
}
