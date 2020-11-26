import { mod } from '../../math/math';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { shipHasItem } from '../game/game_state';
import { CannonSceneConfig, isAimedAtMoon } from './cannon_scene_config';

export class CannonMoonIndicator {
  private leftIndicator: Phaser.GameObjects.Text;
  private rightIndicator: Phaser.GameObjects.Text;
  private middleIndicator: Phaser.GameObjects.Text;

  create(sc: CannonSceneConfig): CannonMoonIndicator {
    if (!this.isMoonIndicatorEnabled(sc)) {
      return this;
    }
    const options = {
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '5rem',
    };

    this.leftIndicator = sc.scene.add.text(20, 20, '<', options);

    this.rightIndicator = sc.scene.add.text(
      SCREEN_DIMENSIONS.x - 40,
      20,
      '>',
      options,
    );

    this.middleIndicator = sc.scene.add.text(
      SCREEN_DIMENSIONS.x / 2,
      20,
      '^',
      options,
    );
    return this;
  }

  destroy(): void {
    if (this.leftIndicator !== undefined) {
      this.leftIndicator.destroy();
    }
    if (this.rightIndicator !== undefined) {
      this.rightIndicator.destroy();
    }
    if (this.middleIndicator !== undefined) {
      this.middleIndicator.destroy();
    }
  }

  update(time: number, sc: CannonSceneConfig): void {
    if (!this.isMoonIndicatorEnabled(sc)) {
      return;
    }

    const angleDiff = mod(sc.rotation - sc.moonAngleRadians, Math.PI * 2);

    const inWindow = isAimedAtMoon(sc);
    const opacitySpeed = inWindow ? 0.02 : 0.01;
    const color = inWindow ? '#f22' : '#fff';
    const opacity = 0.7 + 0.3 * Math.sin(time * opacitySpeed);

    this.leftIndicator.setAlpha(0);
    this.rightIndicator.setAlpha(0);
    this.middleIndicator.setAlpha(0);

    const isRight = angleDiff < Math.PI && angleDiff > Math.PI / 4;
    const isLeft = angleDiff >= Math.PI && angleDiff < (7 * Math.PI) / 4;

    if (isLeft) {
      this.leftIndicator.setAlpha(opacity);
    } else if (isRight) {
      this.rightIndicator.setAlpha(opacity);
    } else {
      const midX = mod(angleDiff + Math.PI / 4, Math.PI * 2) / (Math.PI / 2);
      this.middleIndicator.x = midX * SCREEN_DIMENSIONS.x;
      this.middleIndicator.setAlpha(opacity);
      this.middleIndicator.setColor(color);
    }
  }

  private isMoonIndicatorEnabled(sc: CannonSceneConfig): boolean {
    return shipHasItem(sc.gameState, (x) => x.moonRadar);
  }
}
