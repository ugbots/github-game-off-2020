import { Scene } from 'phaser';
import {
  getInitialSceneConfig,
  FlightSceneConfig,
  updateSceneConfig,
  FlightSceneState,
  MOON_HEIGHT,
} from '../model/flight/flight_scene_config';
import { Star } from '../model/flight/star';
import { Ship } from '../model/flight/ship';
import { keys } from '../util/keys';
import { FlightSceneInput } from '../model/flight/flight_scene_input';
import { Altimiter } from '../model/flight/altimiter';
import { Asteroid } from '../model/flight/asteroid';
import { Moon } from '../model/flight/moon';
import { generateArray } from '../util/arrays';
import { TutorialOverlay } from '../ui/tutorial_overlay';
import { localStorage } from '../util/local_storage';
import { AsteroidIndicator } from '../model/flight/asteroid_indicator';
import { shipHasItem } from '../model/game/game_state';
import { FlightGround } from '../model/flight/flight_ground';

export class FlightScene extends Scene {
  private sceneConfig: FlightSceneConfig;
  private flightSceneInput: FlightSceneInput;

  private stars: readonly Star[];
  private asteroid: Asteroid;
  private moon: Moon;
  private ship: Ship;
  private flightGround: FlightGround;
  private asteroidIndicator?: AsteroidIndicator;
  private altimiter: Altimiter;
  private tutorialOverlay?: TutorialOverlay;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.flight,
    });
  }

  /* override */
  init(input: FlightSceneInput): void {
    this.flightSceneInput = input;
  }

  /* override */
  create(): void {
    this.sceneConfig = getInitialSceneConfig(
      this,
      this.flightSceneInput,
      () => {
        setTimeout(() => {
          this.destroy();
        }, 10);
      },
    );

    this.stars = generateArray(50, () => new Star().create(this.sceneConfig));
    this.asteroid = new Asteroid().create(this.sceneConfig);
    this.moon = new Moon().create(this.sceneConfig);
    this.ship = new Ship().create(this.sceneConfig);
    this.flightGround = new FlightGround().create(this.sceneConfig);

    if (shipHasItem(this.sceneConfig.gameState, (x) => x.asteroidRadar)) {
      this.asteroidIndicator = new AsteroidIndicator().create(this.sceneConfig);
    }

    this.altimiter = new Altimiter().create(this.sceneConfig);

    if (!localStorage.wasTutorialRead(keys.scenes.flight)) {
      this.tutorialOverlay = new TutorialOverlay().create(
        this,
        FLIGHT_SCENE_TUTORIAL,
        () => {
          this.sceneConfig.sceneState = FlightSceneState.INTRO;
          localStorage.markTutorialRead(keys.scenes.flight);
        },
      );
      this.sceneConfig.sceneState = FlightSceneState.TUTORIAL;
      this.tutorialOverlay.show(this);
    }
  }

  destroy(): void {
    this.stars.forEach((s) => {
      s.destroy();
    });
    this.asteroid.destroy();
    this.moon.destroy();
    this.ship.destroy();
    this.flightGround.destroy();
    this.asteroidIndicator?.destroy();
    this.altimiter.destroy();
    this.tutorialOverlay?.destroy();
  }

  /* override */
  update(time: number, dt: number): void {
    updateSceneConfig(time, dt, this.sceneConfig);
    this.ship.update(time, dt, this.sceneConfig);
    this.flightGround.update(this.sceneConfig);
    this.asteroidIndicator?.update(time, this.sceneConfig);
    this.stars.forEach((star) => {
      star.update(time, dt, this.sceneConfig);
    });
    this.altimiter.update(time, dt, this.sceneConfig);
    this.asteroid.update(time, dt, this.sceneConfig);
    this.moon.update(this.sceneConfig);
  }
}

const FLIGHT_SCENE_TUTORIAL: string = [
  "Now that you're flying through space, you can try to",
  'reach the moon. Modern rat science shows that the moon',
  `is nearly ${MOON_HEIGHT} feet away, so you may need to`,
  'upgrade your equipment.',
  'The ratsteroid belt orbiting our planet may have some',
  'useful resources to help you buy some upgrades. ',
  '',
  'Controls:',
  '  Left / Right: Rotate ship',
  '  Up: Boost',
].join('\n');
