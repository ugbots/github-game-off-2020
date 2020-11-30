import { easeInOut, EasingDirection } from '../../math/easing';
import { SoundEasing } from '../../ui/sound_easing';
import { keys } from '../../util/keys';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { MineSceneConfig } from './mine_scene_config';

const GREEN = 0x00ff00;
const BLUE = 0x0066ff;

const GREEN_STRING = '#0f0';
const BLUE_STRING = '#06f';

export class FoolsGoldRadarIndicator {
  private bgRect: Phaser.GameObjects.Rectangle;
  private fgRect: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  private sound: SoundEasing;

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
      BLUE,
    );

    this.text = sc.scene.add.text(
      SCREEN_DIMENSIONS.x / 2 - 80,
      centerY - 30,
      '',
      {
        color: BLUE_STRING,
      },
    );

    this.sound = new SoundEasing().create(
      sc.scene,
      keys.sounds.wibbly,
      {
        fn: easeInOut,
        speed: 0.001,
      },
      {
        loop: true,
      },
    );

    this.setVisible(false);

    return this;
  }

  destroy(): void {
    this.bgRect.destroy();
    this.fgRect.destroy();
    this.text.destroy();
    this.sound.destroy();
  }

  private setVisible(visible: boolean): void {
    this.bgRect.setVisible(visible);
    this.fgRect.setVisible(visible);
    this.text.setVisible(visible);
  }

  update(dt: number, sc: MineSceneConfig): void {
    const radarStrength = sc.shipConfig.foolsGoldRadarEasing.getValue();

    if (sc.zKey.isDown) {
      this.sound.update(dt, EasingDirection.INCREASE);
    } else {
      this.sound.update(dt, EasingDirection.DECREASE);
    }

    if (radarStrength <= 0) {
      this.setVisible(false);
      return;
    }
    this.setVisible(true);

    const radarFull = radarStrength === 1;
    this.fgRect.fillColor = radarFull ? GREEN : BLUE;
    this.text.setColor(radarFull ? GREEN_STRING : BLUE_STRING);

    this.fgRect.width = radarStrength * this.bgRect.width;
    this.text.setText(`Fool's Gold radar: ${Math.floor(radarStrength * 100)}%`);
  }
}
