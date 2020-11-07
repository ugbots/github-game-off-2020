import * as Phaser from 'phaser';
import { CannonBase } from '../model/cannon/cannon_base';
import { CannonTurret } from '../model/cannon/cannon_turret';
import { DirtParticles } from '../model/cannon/dirt_particles';
import { FireParticles } from '../model/cannon/fire_particles';
import { FuelIndicator } from '../model/cannon/fuel_indicator';
import { Planet } from '../model/cannon/planet';
import {
  getInitialSceneConfig,
  SceneConfig,
  updateSceneConfig,
} from '../model/cannon/scene_config';
import { Ship } from '../model/cannon/ship';
import { Star } from '../model/cannon/star';

const settingsConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Cannon',
};

export class CannonScene extends Phaser.Scene {
  private planet: Planet;
  private cannonBase: CannonBase;
  private cannonTurret: CannonTurret;
  private stars: readonly Star[];
  private dirtParticles: DirtParticles;
  private fireParticles: FireParticles;
  private ship: Ship;
  private fuelIndicator: FuelIndicator;

  private sceneConfig: SceneConfig;

  constructor() {
    super(settingsConfig);
  }

  /* override */
  create(): void {
    this.sceneConfig = {
      ...getInitialSceneConfig(),
      cursorKeys: this.input.keyboard.createCursorKeys(),
    };

    this.stars = Array(this.sceneConfig.starCount)
      .fill(0)
      .map(() => new Star().create(this, this.sceneConfig));

    this.ship = new Ship().create(this, this.sceneConfig);
    this.fireParticles = new FireParticles().create(this, this.sceneConfig);
    this.cannonBase = new CannonBase().create(this, this.sceneConfig);
    this.cannonTurret = new CannonTurret().create(this, this.sceneConfig);
    this.dirtParticles = new DirtParticles().create(this, this.sceneConfig);
    this.planet = new Planet().create(this, this.sceneConfig);
    this.fuelIndicator = new FuelIndicator().create(this, this.sceneConfig);
  }

  /* override */
  update(time: number, dt: number): void {
    updateSceneConfig(this.sceneConfig, dt);
    this.ship.update(time, dt, this.sceneConfig);
    this.planet.update(time, dt, this.sceneConfig);
    this.cannonBase.update(time, dt, this.sceneConfig);
    this.cannonTurret.update(time, dt, this.sceneConfig);
    this.dirtParticles.update(time, dt, this.sceneConfig);
    this.fireParticles.update(time, dt, this.sceneConfig);
    this.fuelIndicator.update(time, dt, this.sceneConfig);
    this.stars.forEach(s => {
      s.update(time, dt, this.sceneConfig);
    })
  }
}
