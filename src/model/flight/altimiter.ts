import { FlightSceneConfig } from './flight_scene_config';
import { SCREEN_DIMENSIONS } from '../../util/screen';

export class Altimiter {
  private text: Phaser.GameObjects.Text;

  create(sc: FlightSceneConfig): Altimiter {
    this.text = sc.scene.add.text(10, SCREEN_DIMENSIONS.y - 20, 'Altitude: 0');
    return this;
  }

  update(time: number, dt: number, sc: FlightSceneConfig): Altimiter {
    this.text.text = 'Altitude: ' + Math.round(sc.verticalPosition) + 'ft';
    return this;
  }
}
