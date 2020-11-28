import { Scene } from 'phaser';
import { MineSceneBatteryIndicator } from '../model/mine/mine_scene_battery_indicator';
import {
  getInitialMineSceneConfig,
  MineSceneConfig,
  MineSceneState,
  updateMineSceneConfig,
} from '../model/mine/mine_scene_config';
import { MineSceneInput } from '../model/mine/mine_scene_input';
import { MineShip } from '../model/mine/mine_ship';
import { MiningDirt } from '../model/mine/mining_dirt';
import { MiningIndicator } from '../model/mine/mining_indicator';
import { RoomRenderer } from '../model/mine/room_renderer';
import { TutorialOverlay } from '../ui/tutorial_overlay';
import { keys } from '../util/keys';
import { localStorage } from '../util/local_storage';

export class MineScene extends Scene {
  private mineSceneInput: MineSceneInput;
  private sceneConfig: MineSceneConfig;

  private ship: MineShip;
  private roomRenderer: RoomRenderer;
  private batteryIndicator: MineSceneBatteryIndicator;
  private miningIndicator: MiningIndicator;
  private miningDirt: MiningDirt;
  private tutorialOverlay: TutorialOverlay;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.mine,
    });
  }

  /* override */
  init(input: MineSceneInput): void {
    this.mineSceneInput = {
      ...input,
      gameState: {
        ...input.gameState,
        currentScene: keys.scenes.flight,
      },
    };

    localStorage.setGameState(this.mineSceneInput.gameState);
  }

  /* override */
  create(): void {
    this.sceneConfig = getInitialMineSceneConfig(
      this,
      this.mineSceneInput,
      () => {
        setTimeout(() => {
          this.destroy();
        }, 10);
      },
    );
    this.roomRenderer = new RoomRenderer().create(this.sceneConfig);
    this.miningDirt = new MiningDirt().create(this.sceneConfig);
    this.ship = new MineShip().create(this.sceneConfig);
    this.batteryIndicator = new MineSceneBatteryIndicator().create(
      this.sceneConfig,
    );
    this.miningIndicator = new MiningIndicator().create(this.sceneConfig);
    this.tutorialOverlay = new TutorialOverlay().create(
      this,
      MINE_SCENE_TUTORIAL,
      () => {
        this.sceneConfig.sceneState = MineSceneState.ROAMING;
        this.sceneConfig.shipConfig.batteryEasing.resetSpeed();
        localStorage.markTutorialRead(keys.scenes.mine);
      },
    );
    if (!localStorage.wasTutorialRead(keys.scenes.mine)) {
      this.sceneConfig.sceneState = MineSceneState.TUTORIAL;
      this.tutorialOverlay.show();
    }
  }

  destroy(): void {
    this.ship.destroy();
    this.roomRenderer.destroy();
    this.miningDirt.destroy();
    this.batteryIndicator.destroy();
    this.miningIndicator.destroy();
    this.tutorialOverlay.destroy();
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

const MINE_SCENE_TUTORIAL: string = [
  "Now that you're on an asteroid, you can mine it for",
  'resources. Watch out though, mining asteroids can be',
  'dangerous!',
  '',
  'Controls:',
  '  Up / Down / Left / Right: Move ship',
  '  Space: Activate drill',
  '  Z: Use item (if equipped)',
].join('\n');
