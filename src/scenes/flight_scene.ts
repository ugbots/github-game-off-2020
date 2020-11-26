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
import { Asteroid } from '../model/flight/asteroid';
import { Moon } from '../model/flight/moon';

export class FlightScene extends Scene {
  private sceneConfig: FlightSceneConfig;
  private flightSceneInput: FlightSceneInput;

  private stars: readonly Star[];
  private asteroid: Asteroid;
  private moon: Moon;
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
    this.sceneConfig = getInitialSceneConfig(
      this,
      this.flightSceneInput,
      () => {
        this.destroy();
      },
    );

    this.stars = Array(50)
      .fill(0)
      .map(() => {
        return new Star().create(this.sceneConfig);
      });
    this.asteroid = new Asteroid().create(this.sceneConfig);
    this.moon = new Moon().create(this.sceneConfig);
    this.ship = new Ship().create(this.sceneConfig);

    this.altimiter = new Altimiter().create(this.sceneConfig);
  }

  destroy(): void {
    this.ship.destroy();
    this.altimiter.destroy();
    this.asteroid.destroy();
    this.moon.destroy();
    this.stars.forEach((s) => {
      s.destroy();
    });
  }

  /* override */
  update(time: number, dt: number): void {
    updateSceneConfig(time, dt, this.sceneConfig);
    this.ship.update(time, dt, this.sceneConfig);
    this.stars.forEach((star) => {
      star.update(time, dt, this.sceneConfig);
    });
    this.altimiter.update(time, dt, this.sceneConfig);
    this.asteroid.update(time, dt, this.sceneConfig);
    this.moon.update(this.sceneConfig);
  }
}
