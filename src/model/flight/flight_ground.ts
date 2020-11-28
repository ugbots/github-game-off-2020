import { ThrowStmt } from '@angular/compiler';
import { keys } from '../../util/keys';
import { Rectangle } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { FlightSceneConfig } from './flight_scene_config';

export class FlightGround {
  private sprite: Phaser.GameObjects.Sprite;

  create(sc: FlightSceneConfig): FlightGround {
    this.sprite = sc.scene.add.sprite(
      SCREEN_DIMENSIONS.x / 2,
      0,
      keys.sprites.planetFg,
    );

    this.sprite.setScale(20);

    return this;
  }

  destroy(): void {
    this.sprite.destroy();
  }

  update(sc: FlightSceneConfig): void {
    this.sprite.y = sc.verticalPosition + SCREEN_DIMENSIONS.y * 2.5;
  }
}
