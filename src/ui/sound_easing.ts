import { Scene } from 'phaser';
import { EasingButton, EasingDirection } from '../math/easing';

export interface SoundEasingConfig {
  readonly fn: (x: number) => number;
  readonly speed: number;
  readonly friction?: number;
  readonly minVolume?: number;
}

export class SoundEasing {
  private easing: EasingButton;
  private sound: Phaser.Sound.HTML5AudioSound;
  private minVolume = 0;

  create(
    scene: Scene,
    key: string,
    easingConfig: SoundEasingConfig,
    soundConfig: Phaser.Types.Sound.SoundConfig,
  ): SoundEasing {
    this.easing = new EasingButton({
      friction: 1,
      canGoNegative: false,
      scale: 1,
      ...easingConfig,
    });

    this.minVolume = easingConfig.minVolume ?? 0;

    this.sound = scene.sound.add(
      key,
      soundConfig,
    ) as Phaser.Sound.HTML5AudioSound;

    return this;
  }

  destroy(): void {
    this.sound.destroy();
  }

  update(dt: number, dir: EasingDirection): void {
    this.easing.update(dt, dir);
    const volume = Math.max(this.minVolume, this.easing.getValue());

    this.sound.setVolume(volume);

    if (volume > 0 && !this.sound.isPlaying) {
      this.sound.play();
    }
    if (volume <= 0 && this.sound.isPlaying) {
      this.sound.stop();
    }
  }
}
