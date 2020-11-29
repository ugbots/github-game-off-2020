import * as Phaser from 'phaser';
import { CannonBase } from '../model/cannon/cannon_base';
import { CannonTurret } from '../model/cannon/cannon_turret';
import { DirtParticles } from '../model/cannon/dirt_particles';
import { FireParticles } from '../model/cannon/fire_particles';
import { FuelIndicator } from '../model/cannon/fuel_indicator';
import { Planet } from '../model/cannon/planet';
import {
  getInitialSceneConfig,
  CannonSceneConfig,
  updateSceneConfig,
  SceneState,
} from '../model/cannon/cannon_scene_config';
import { Ship } from '../model/cannon/ship';
import { Star } from '../model/cannon/star';
import { GameState } from '../model/game/game_state';
import { keys } from '../util/keys';
import { CannonMoonIndicator } from '../model/cannon/cannon_moon_indicator';
import { generateArray } from '../util/arrays';
import { TutorialOverlay } from '../ui/tutorial_overlay';
import { localStorage } from '../util/local_storage';
import { SCREEN_DIMENSIONS } from '../util/screen';
import { MenuButton } from '../ui/menu-button';

export class CannonScene extends Phaser.Scene {
  private sceneConfig: CannonSceneConfig;
  private gameState: GameState;

  private planet: Planet;
  private cannonBase: CannonBase;
  private cannonTurret: CannonTurret;
  private stars: readonly Star[];
  private dirtParticles: DirtParticles;
  private fireParticles: FireParticles;
  private ship: Ship;
  private fuelIndicator: FuelIndicator;
  private moonIndicator?: CannonMoonIndicator;
  private tutorialOverlay?: TutorialOverlay;
  private backToShopButton: MenuButton;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.cannon,
    });
  }

  /* override */
  init(gs: GameState): void {
    const gameState = {
      ...gs,
      currentScene: keys.scenes.shop,
    };
    localStorage.setGameState(gameState);
    this.gameState = gameState;
  }

  /* override */
  create(): void {
    this.sceneConfig = getInitialSceneConfig(this, this.gameState, () => {
      setTimeout(() => {
        this.destroy();
      }, 1);
    });

    this.stars = generateArray(this.sceneConfig.starCount, () =>
      new Star().create(this, this.sceneConfig),
    );

    // Change the renedering order here.
    this.planet = new Planet().create(this, this.sceneConfig, () => {
      // Anything rendering on the planet goes in this block.
      this.ship = new Ship().create(this, this.sceneConfig);
      this.fireParticles = new FireParticles().create(this, this.sceneConfig);
      this.cannonTurret = new CannonTurret().create(this, this.sceneConfig);
      this.cannonBase = new CannonBase().create(this, this.sceneConfig);
      this.dirtParticles = new DirtParticles().create(this, this.sceneConfig);
    });

    this.fuelIndicator = new FuelIndicator().create(this, this.sceneConfig);
    this.moonIndicator = new CannonMoonIndicator().create(this.sceneConfig);

    this.backToShopButton = new MenuButton(
      this,
      10,
      SCREEN_DIMENSIONS.y - 60,
      'Go to shop',
      () => {
        this.scene.start(keys.scenes.shop, this.sceneConfig.gameState);
        this.sceneConfig.onDestroy();
      },
    );

    if (!localStorage.wasTutorialRead(keys.scenes.cannon)) {
      this.tutorialOverlay = new TutorialOverlay().create(
        this,
        CANNON_SCENE_TUTORIAL,
        () => {
          this.sceneConfig.sceneState = SceneState.ROTATE_CANNON;
          localStorage.markTutorialRead(keys.scenes.cannon);
        },
      );
      this.sceneConfig.sceneState = SceneState.TUTORIAL;
      this.tutorialOverlay.show(this);
    }
  }

  destroy(): void {
    this.planet.destroy();
    this.cannonBase.destroy();
    this.cannonTurret.destroy();
    this.stars.forEach((s) => {
      s.destroy();
    });
    this.dirtParticles.destroy();
    this.fireParticles.destroy();
    this.ship.destroy();
    this.fuelIndicator.destroy();
    this.moonIndicator?.destroy();
    this.tutorialOverlay?.destroy();
    this.backToShopButton.destroy();
  }

  /* override */
  update(time: number, dt: number): void {
    updateSceneConfig(time, dt, this.sceneConfig);
    this.ship.update(time, dt, this.sceneConfig);
    this.planet.update(time, dt, this.sceneConfig);
    this.cannonBase.update(time, dt, this.sceneConfig);
    this.cannonTurret.update(time, dt, this.sceneConfig);
    this.dirtParticles.update(time, dt, this.sceneConfig);
    this.fireParticles.update(time, dt, this.sceneConfig);
    this.fuelIndicator.update(time, dt, this.sceneConfig);
    this.stars.forEach((s) => {
      s.update(time, dt, this.sceneConfig);
    });
    this.moonIndicator?.update(time, this.sceneConfig);
  }
}

const CANNON_SCENE_TUTORIAL: readonly string[] = [
  [
    'Ratkind needs your help!',
    '',
    'Scientists at Splinter Labs have recently discovered that',
    'the moon which orbits our rat planet is made of none other',
    'than...',
  ].join('\n'),
  [
    'Ratkind needs your help!',
    '',
    'Scientists at Splinter Labs have recently discovered that',
    'the moon which orbits our rat planet is made of none other',
    'than...',
    '',
    'DELICIOUS CHEESE!',
  ].join('\n'),
  [
    'As the head of the Splinter Labs space program, you will',
    'need to head to the moon to get some of that cheese at once.',
    '',
    'Splinter Labs has set you up with our state-of-the-art',
    'launchable ship cannon, but the rest is up to you.',
  ].join('\n'),
  [
    "You'll need to launch your ship out of the cannon to",
    "reach the moon. You can only reach the moon if you're",
    "aiming for it, but it's hard to see without the proper",
    'equipment.',
    '',
    'Controls:',
    '  Up / Down: Add / Remove propellant',
    '  Left / Right: Aim cannon',
    '  Space: Launch cannon',
  ].join('\n'),
];
