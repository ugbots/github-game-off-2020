import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { FlightSceneConfig, FlightSceneState } from './flight_scene_config';

export class Ship {
  private sprite: Sprite;

  create(sc: FlightSceneConfig): Ship {
    this.sprite = sc.scene.physics.add.sprite(
      SCREEN_DIMENSIONS.x / 2,
      SCREEN_DIMENSIONS.y / 2,
      keys.sprites.drillShip,
    );
    this.sprite.scale = 2;

    return this;
  }

  update(time: number, dt: number, sc: FlightSceneConfig): void {
    this.sprite.rotation = sc.shipRotation;

    if (sc.sceneState === FlightSceneState.INTRO) {
      this.sprite.y = SCREEN_DIMENSIONS.y - sc.shipIntroEasing.getValue() * 100;
    }
  }
}
