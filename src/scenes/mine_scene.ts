import { Scene } from 'phaser';
import { MineSceneBatteryIndicator } from '../model/mine/mine_scene_battery_indicator';
import {
  getInitialMineSceneConfig,
  MineSceneConfig,
  MineShipConfig,
  updateMineSceneConfig,
} from '../model/mine/mine_scene_config';
import { MineSceneInput } from '../model/mine/mine_scene_input';
import { MineShip } from '../model/mine/mine_ship';
import { MiningDirt } from '../model/mine/mining_dirt';
import { MiningIndicator } from '../model/mine/mining_indicator';
import { RoomRenderer } from '../model/mine/room_renderer';
import { keys } from '../util/keys';

export class MineScene extends Scene {
  private mineSceneInput: MineSceneInput;
  private sceneConfig: MineSceneConfig;

  private ship: MineShip;
  private roomRenderer: RoomRenderer;
  private batteryIndicator: MineSceneBatteryIndicator;
  private miningIndicator: MiningIndicator;
  private miningDirt: MiningDirt;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.mine,
    });
  }

  /* override */
  init(input: MineSceneInput): void {
    this.mineSceneInput = input;
  }

  /* override */
  create(): void {
    this.sceneConfig = getInitialMineSceneConfig(
      this,
      this.mineSceneInput,
      () => {
        this.destroy();
      },
    );
    this.roomRenderer = new RoomRenderer().create(this.sceneConfig);
    this.miningDirt = new MiningDirt().create(this.sceneConfig);
    this.ship = new MineShip().create(this.sceneConfig);
    this.batteryIndicator = new MineSceneBatteryIndicator().create(
      this.sceneConfig,
    );
    this.miningIndicator = new MiningIndicator().create(this.sceneConfig);
  }

  destroy(): void {
    this.ship.destroy();
    this.roomRenderer.destroy();
    this.miningDirt.destroy();
    this.batteryIndicator.destroy();
    this.miningIndicator.destroy();
  }

  /* override */
  update(time: number, dt: number): void {
    updateMineSceneConfig(time, dt, this.sceneConfig);
    this.ship.update(this.sceneConfig);
    this.roomRenderer.update(this.sceneConfig);
    this.batteryIndicator.update(this.sceneConfig);
    this.miningIndicator.update(this.sceneConfig);
    this.miningDirt.update(this.sceneConfig);
  }
}
