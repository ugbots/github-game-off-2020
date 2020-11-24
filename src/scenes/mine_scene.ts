import { Scene } from 'phaser';
import {
  getInitialMineSceneConfig,
  MineSceneConfig,
} from '../model/mine/mine_scene_config';
import { MineSceneInput } from '../model/mine/mine_scene_input';
import { RoomRenderer } from '../model/mine/room_renderer';
import { keys } from '../util/keys';

export class MineScene extends Scene {
  private mineSceneInput: MineSceneInput;
  private sceneConfig: MineSceneConfig;
  private roomRenderer: RoomRenderer;

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
    this.sceneConfig = getInitialMineSceneConfig(this, this.mineSceneInput);
    this.roomRenderer = new RoomRenderer().create(this.sceneConfig);
  }
}
