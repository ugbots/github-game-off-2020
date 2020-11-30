import { peek } from '../../util/arrays';
import { keys } from '../../util/keys';
import { FlightSceneConfig, FlightSceneState } from './flight_scene_config';

export class Asteroid {
  private sprite: Phaser.GameObjects.Sprite;

  private suckedIntoAsteroidSound: Phaser.Sound.BaseSound;
  private playedSound = false;

  create(sc: FlightSceneConfig): Asteroid {
    this.sprite = sc.scene.add.sprite(0, 0, keys.sprites.asteroid);

    this.suckedIntoAsteroidSound = sc.scene.sound.add(
      keys.sounds.suckedIntoAsteroid,
    );

    return this;
  }

  destroy(): void {
    this.sprite.destroy();
    this.suckedIntoAsteroidSound.destroy();
  }

  update(time: number, dt: number, sc: FlightSceneConfig): void {
    const asteroid = peek(sc.asteroidPositions);
    if (asteroid === undefined) {
      this.sprite.setVisible(false);
      return;
    }

    this.sprite.x = asteroid.x;
    this.sprite.y = asteroid.y;

    if (sc.sceneState === FlightSceneState.ASTEROID_COLLISION) {
      if (!this.playedSound) {
        this.suckedIntoAsteroidSound.play();
        this.playedSound = true;
      }

      this.sprite.scale += 0.004 * dt;
    }
  }
}
