import { Scene } from 'phaser';
import { SceneConfig } from '../model/shop/scene_config';
import { Sprite } from '../util/phaser_types';

export class SpriteButton {
  private sprite: Sprite;
  private onClick: () => void;

  create(
    sc: SceneConfig,
    key: string,
    x: number,
    y: number,
    onClick: () => void,
    configSprite?: (s: Sprite) => Sprite,
  ): SpriteButton {
    this.sprite = sc.scene.physics.add.sprite(x, y, key).setInteractive();

    if (configSprite) {
      this.sprite = configSprite(this.sprite);
    }

    this.onClick = onClick;

    // Clicking
    this.sprite.on('pointerdown', () => {
      this.sprite.setTint(0x404040);
    });

    this.sprite.on('pointerup', () => {
      this.sprite.setTint(0xd0d0d0);
      this.onClick();
    });

    // Hovering
    this.sprite.on('pointerover', () => {
      this.sprite.setTint(0xd0d0d0);
    });

    this.sprite.on('pointerout', () => {
      this.sprite.clearTint();
    });

    return this;
  }

  updateUi(sc: SceneConfig): void {

  }
}
