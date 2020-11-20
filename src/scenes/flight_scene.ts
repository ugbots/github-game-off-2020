import { Scene } from 'phaser';
import {
  getInitialSceneConfig,
  FlightSceneConfig,
  updateSceneConfig,
} from '../model/flight/flight_scene_config';
import { Star } from '../model/flight/star';
import { Ship } from '../model/flight/ship';
import { keys } from '../util/keys';
import { FlightSceneInput } from '../model/flight/flight_scene_input';
import { Altimiter } from '../model/flight/altimiter';

export class FlightScene extends Scene {
  private sceneConfig: FlightSceneConfig;
  private flightSceneInput: FlightSceneInput;
  private stars: readonly Star[];
  private ship: Ship;
  private altimiter: Altimiter;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.flight,
    });
  }

  /* override */
  init(flightSceneInput: FlightSceneInput): void {
    this.flightSceneInput = flightSceneInput;
  }

  /* override */
  create(): void {
    this.sceneConfig = getInitialSceneConfig(this, this.flightSceneInput);

    this.stars = Array(50)
      .fill(0)
      .map(() => {
        return new Star().create(this.sceneConfig);
      });
    this.ship = new Ship().create(this.sceneConfig);

    this.altimiter = new Altimiter().create(this.sceneConfig);
  }

  /* override */
  update(time: number, dt: number): void {
    updateSceneConfig(time, dt, this.sceneConfig);
    this.ship.update(time, dt, this.sceneConfig);
    this.stars.forEach((star) => {
      star.update(time, dt, this.sceneConfig);
    });
    this.altimiter.update(time, dt, this.sceneConfig);
  }
}
