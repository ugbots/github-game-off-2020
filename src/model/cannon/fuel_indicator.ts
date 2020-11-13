import { Scene } from 'phaser';
import { Rectangle } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { CannonSceneConfig } from './cannon_scene_config';


export class FuelIndicator {
  private border: Rectangle;
  private label: Phaser.GameObjects.Text;
  private fuelBarBg: Rectangle;
  private fuelBarFg: Rectangle;

  create(scene: Scene, sc: CannonSceneConfig): FuelIndicator {
    const borderWidth = SCREEN_DIMENSIONS.x / 3;
    const borderHeight = SCREEN_DIMENSIONS.y / 7;
    const borderX = SCREEN_DIMENSIONS.x / 2;
    const borderY = 6 * borderHeight;
    this.border = scene.add.rectangle(
      borderX,
      borderY,
      borderWidth,
      borderHeight,
      0,
      0.7,
    );

    this.label = scene.add
      .text(borderX - 70, borderY + 30, `Propellant: ${sc.loadedFuel}%`)
      .setFontFamily('"Press Start 2P", monospace')
      .setFontSize(12)
      .setColor('#00ff00')
      .setAlign('center');

    this.fuelBarBg = scene.add.rectangle(
      borderX,
      borderY + 10,
      borderWidth - 40,
      16,
      0
    );

    this.fuelBarFg = scene.add.rectangle(
      borderX,
      borderY + 10,
      borderWidth - 40,
      16,
      0x00ff00,
    );
    this.updateFuelBar(sc.loadedFuel);

    return this;
  }

  update(time: number, dt: number, sc: CannonSceneConfig): FuelIndicator {
    this.label.text = `Propellant: ${sc.loadedFuel}%`;
    this.updateFuelBar(sc.loadedFuel);
    return this;
  }

  private updateFuelBar(fuel: number): void {
    const newWidth = (fuel / 100) * this.fuelBarBg.width;

    this.fuelBarFg.width = newWidth;
  }
}
