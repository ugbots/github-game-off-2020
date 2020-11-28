import { Scene } from 'phaser';
import { Rectangle } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { shipStatTotal } from '../game/game_state';
import { CannonSceneConfig } from './cannon_scene_config';

export class FuelIndicator {
  private border: Rectangle;
  private label: Phaser.GameObjects.Text;
  private remainingLabel: Phaser.GameObjects.Text;
  private fuelBarBg: Rectangle;
  private fuelBarFg: Rectangle;
  private fuelBarTop: Rectangle;

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

    this.remainingLabel = scene.add
      .text(
        borderX - 70,
        borderY - 20,
        `Remaining fuel: ${Math.floor(sc.gameState.earthInventory.fuel)}`,
      )
      .setFontFamily('"Press Start 2P", monospace')
      .setFontSize(12)
      .setColor('#00ff00');

    const loadedFuel = sc.loadedFuelEasing.getValue();

    this.label = scene.add
      .text(borderX - 50, borderY + 30, `Propellant: ${loadedFuel}%`)
      .setFontFamily('"Press Start 2P", monospace')
      .setFontSize(12)
      .setColor('#00ff00');

    this.fuelBarBg = scene.add.rectangle(
      borderX,
      borderY + 10,
      borderWidth - 40,
      16,
      0,
    );

    this.fuelBarFg = scene.add.rectangle(
      borderX,
      borderY + 10,
      borderWidth - 40,
      16,
      0x00ff00,
    );

    this.fuelBarTop = scene.add.rectangle(
      borderX,
      borderY + 10,
      borderWidth - 40,
      16,
      0x555555,
    );

    this.setupFuelBarTop(sc);
    this.updateFuelBar(loadedFuel);

    return this;
  }

  destroy(): void {
    this.border.destroy();
    this.label.destroy();
    this.remainingLabel.destroy();
    this.fuelBarBg.destroy();
    this.fuelBarFg.destroy();
    this.fuelBarTop.destroy();
  }

  update(time: number, dt: number, sc: CannonSceneConfig): FuelIndicator {
    this.updateFuelBar(sc.loadedFuelEasing.getValue());
    return this;
  }

  private updateFuelBar(loadedFuel: number): void {
    const fuel = Math.floor(loadedFuel);

    this.label.text = `Propellant: ${fuel}%`;
    const newWidth = (fuel / 100) * this.fuelBarBg.width;

    this.fuelBarFg.width = newWidth;
  }

  private setupFuelBarTop(sc: CannonSceneConfig): void {
    const maxFuel = shipStatTotal(sc.gameState, (x) => x.maxCannonPower);

    const percentage = 1 - maxFuel / 100.0;

    this.fuelBarTop.width = this.fuelBarBg.width * percentage;
    this.fuelBarTop.x =
      this.fuelBarBg.x + this.fuelBarBg.width - this.fuelBarTop.width;
  }
}
