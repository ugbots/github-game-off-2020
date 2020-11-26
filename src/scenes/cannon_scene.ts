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
} from '../model/cannon/cannon_scene_config';
import { Ship } from '../model/cannon/ship';
import { Star } from '../model/cannon/star';
import { GameState } from '../model/game/game_state';
import { keys } from '../util/keys';
import { CannonMoonIndicator } from '../model/cannon/cannon_moon_indicator';

export class CannonScene extends Phaser.Scene {
  private gameState: GameState;

  private planet: Planet;
  private cannonBase: CannonBase;
  private cannonTurret: CannonTurret;
  private stars: readonly Star[];
  private dirtParticles: DirtParticles;
  private fireParticles: FireParticles;
  private ship: Ship;
  private fuelIndicator: FuelIndicator;
  private moonIndicator: CannonMoonIndicator;

  private sceneConfig: CannonSceneConfig;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.cannon,
    });
  }

  /* override */
  init(gameState: GameState): void {
    this.gameState = gameState;
  }

  /* override */
  create(): void {
    this.sceneConfig = getInitialSceneConfig(this, this.gameState, () => {
      this.destroy();
    });

    this.stars = Array(this.sceneConfig.starCount)
      .fill(0)
      .map(() => new Star().create(this, this.sceneConfig));

    // Change the renedering order here.
    this.planet = new Planet().create(this, this.sceneConfig, () => {
      // Anything rendering on the planet goes in this block.
      this.ship = new Ship().create(this, this.sceneConfig);
      this.fireParticles = new FireParticles().create(this, this.sceneConfig);
      this.cannonBase = new CannonBase().create(this, this.sceneConfig);
      this.cannonTurret = new CannonTurret().create(this, this.sceneConfig);
      this.dirtParticles = new DirtParticles().create(this, this.sceneConfig);
    });

    this.fuelIndicator = new FuelIndicator().create(this, this.sceneConfig);
    this.moonIndicator = new CannonMoonIndicator().create(this.sceneConfig);
  }

  destroy(): void {
    // TODO(sixstring982): Destroy the rest of the scene objects.
    this.stars.forEach((s) => {
      s.destroy();
    });
    this.fuelIndicator.destroy();
    this.moonIndicator.destroy();
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
    this.moonIndicator.update(time, this.sceneConfig);
  }
}
