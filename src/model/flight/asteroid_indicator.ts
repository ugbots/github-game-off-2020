import { clamp } from '../../math/math';
import { peek } from '../../util/arrays';
import { Vector2 } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { shipHasItem } from '../game/game_state';
import { FlightSceneConfig } from './flight_scene_config';

export class AsteroidIndicator {
  private upText: Phaser.GameObjects.Text;
  private downText: Phaser.GameObjects.Text;
  private leftText: Phaser.GameObjects.Text;
  private rightText: Phaser.GameObjects.Text;

  private texts: readonly Phaser.GameObjects.Text[];

  create(sc: FlightSceneConfig): AsteroidIndicator {
    const style = {
      color: '#880',
      fontFamily: 'monospace',
      fontSize: '5rem',
    };

    this.upText = sc.scene.add.text(0, 0, '^', style);
    this.downText = sc.scene.add.text(0, SCREEN_DIMENSIONS.y - 80, 'v', style);
    this.leftText = sc.scene.add.text(0, 20, '<', style);
    this.rightText = sc.scene.add.text(
      SCREEN_DIMENSIONS.x - 80,
      20,
      '>',
      style,
    );

    this.texts = [this.upText, this.downText, this.leftText, this.rightText];
    return this;
  }

  destroy(): void {
    this.texts.forEach((t) => {
      t.destroy();
    });
  }

  update(time: number, sc: FlightSceneConfig): void {
    const opacity = 0.7 + 0.4 * Math.sin(time * 0.01);

    this.texts.forEach((t) => {
      t.setAlpha(opacity);
    });

    this.updateHorizontalIndicator(this.upText, sc);
    this.updateHorizontalIndicator(this.downText, sc);

    this.updateVerticalIndicator(this.leftText, sc);
    this.updateVerticalIndicator(this.rightText, sc);
  }

  private updateHorizontalIndicator(
    ind: Phaser.GameObjects.Text,
    sc: FlightSceneConfig,
  ): void {
    const asteroid = peek(sc.asteroidPositions);
    if (asteroid === undefined) {
      return;
    }
    ind.setText(asteroid.y > ind.y ? 'v' : '^');

    ind.setX(clamp(0, asteroid.x, SCREEN_DIMENSIONS.x - 80));
  }

  private updateVerticalIndicator(
    ind: Phaser.GameObjects.Text,
    sc: FlightSceneConfig,
  ): void {
    const asteroid = peek(sc.asteroidPositions);
    if (asteroid === undefined) {
      return;
    }
    ind.setText(asteroid.x > ind.x ? '>' : '<');

    ind.setY(clamp(0, asteroid.y, SCREEN_DIMENSIONS.y - 80));
  }
}
