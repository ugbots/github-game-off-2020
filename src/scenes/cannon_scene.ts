import * as Phaser from 'phaser';
import { CannonBase } from '../model/cannon/cannon_base';
import { CannonTurret } from '../model/cannon/cannon_turret';
import { Planet } from '../model/cannon/planet';
import {
  DEFAULT_SCENE_CONFIG,
  SceneConfig,
  updateSceneConfig,
} from '../model/cannon/scene_config';
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

  private sceneConfig: SceneConfig;

  constructor() {
    super(settingsConfig);
  }

  /* override */
  create(): void {
    this.sceneConfig = {
      ...DEFAULT_SCENE_CONFIG,
      cursorKeys: this.input.keyboard.createCursorKeys(),
    };

    this.stars = Array(this.sceneConfig.starCount)
      .fill(0)
      .map(() => new Star().create(this, this.sceneConfig));

    this.cannonBase = new CannonBase().create(this, this.sceneConfig);
    this.cannonTurret = new CannonTurret().create(this, this.sceneConfig);
    this.planet = new Planet().create(this, this.sceneConfig);
  }

  /* override */
  update(time: number, dt: number): void {
    updateSceneConfig(this.sceneConfig, dt);
    this.planet.update(time, dt, this.sceneConfig);
    this.cannonBase.update(time, dt, this.sceneConfig);
    this.cannonTurret.update(time, dt, this.sceneConfig);
    this.stars.forEach(s => {
      s.update(time, dt, this.sceneConfig);
    })
  }
}
