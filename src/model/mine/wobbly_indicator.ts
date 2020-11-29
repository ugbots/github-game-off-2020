import { SCREEN_DIMENSIONS } from '../../util/screen';
import { MineSceneConfig } from './mine_scene_config';

export class FoolsGoldRadarIndicator {
  private bgRect: Phaser.GameObjects.Rectangle;
  private fgRect: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  create(sc: MineSceneConfig): FoolsGoldRadarIndicator {
    const centerY = SCREEN_DIMENSIONS.y * (9 / 10);
    const width = SCREEN_DIMENSIONS.x * (3 / 4);
    this.bgRect = sc.scene.add.rectangle(
      SCREEN_DIMENSIONS.x / 2,
      centerY,
      width,
      16,
      0x202020,
    );

    this.fgRect = sc.scene.add.rectangle(
      SCREEN_DIMENSIONS.x / 2,
      centerY,
      width,
      16,
      0x0066ff,
    );

    this.text = sc.scene.add.text(
      SCREEN_DIMENSIONS.x / 2 - 80,
      centerY - 30,
      '',
      {
        color: '#06f',
      },
    );

    this.setVisible(false);

    return this;
  }

  destroy(): void {
    this.bgRect.destroy();
    this.fgRect.destroy();
    this.text.destroy();
  }

  private setVisible(visible: boolean): void {
    this.bgRect.setVisible(visible);
    this.fgRect.setVisible(visible);
    this.text.setVisible(visible);
  }

  update(sc: MineSceneConfig): void {
    const radarStrength = sc.shipConfig.foolsGoldRadarEasing.getValue();
    if (radarStrength <= 0) {
      this.setVisible(false);
      return;
    }

    this.setVisible(true);

    this.fgRect.width = radarStrength * this.bgRect.width;
    this.text.setText(`Fool's Gold radar: ${Math.floor(radarStrength * 100)}%`);
  }
}
