import { keys } from '../../util/keys';
import { FlightSceneConfig, FlightSceneState } from './flight_scene_config';

export class Moon {
  private sprite: Phaser.GameObjects.Sprite;

  private fanfare: Phaser.Sound.BaseSound;
  private playedSound = false;

  create(sc: FlightSceneConfig): Moon {
    this.sprite = sc.scene.add.sprite(
      sc.moonPosition.x,
      sc.moonPosition.y,
      keys.sprites.moon,
    );

    this.sprite.setScale(5);
    this.sprite.setVisible(sc.aimedAtMoon);

    this.fanfare = sc.scene.sound.add(keys.sounds.fanfare);

    return this;
  }

  destroy(): void {
    this.sprite.destroy();
    this.fanfare.destroy();
  }

  update(sc: FlightSceneConfig): void {
    this.sprite.y = sc.moonPosition.y;

    if (
      sc.sceneState === FlightSceneState.MOON_COLLISION &&
      !this.playedSound
    ) {
      this.fanfare.play();
      this.playedSound = true;
    }
  }
}
