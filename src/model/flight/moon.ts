import { keys } from '../../util/keys';
import { FlightSceneConfig } from './flight_scene_config';

export class Moon {
  private sprite: Phaser.GameObjects.Sprite;

  create(sc: FlightSceneConfig): Moon {
    this.sprite = sc.scene.add.sprite(
      sc.moonPosition.x,
      sc.moonPosition.y,
      keys.sprites.planetFg,
    );

    this.sprite.setScale(5);
    this.sprite.setVisible(sc.aimedAtMoon);

    return this;
  }

  destroy(): void {
    this.sprite.destroy();
  }

  update(sc: FlightSceneConfig): void {
    this.sprite.y = sc.moonPosition.y;
  }
}
