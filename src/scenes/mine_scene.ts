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
import { FoolsGoldRadarIndicator } from '../model/mine/fools_gold_radar_indicator';
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
  private wobblyIndicator: FoolsGoldRadarIndicator;
  private miningDirt: MiningDirt;
  private tutorialOverlay?: TutorialOverlay;

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
    this.wobblyIndicator = new FoolsGoldRadarIndicator().create(
      this.sceneConfig,
    );

    if (!localStorage.wasTutorialRead(keys.scenes.mine)) {
      this.tutorialOverlay = new TutorialOverlay().create(
        this,
        MINE_SCENE_TUTORIAL,
        () => {
          this.sceneConfig.sceneState = MineSceneState.ROAMING;
          this.sceneConfig.shipConfig.batteryEasing.resetSpeed();
          localStorage.markTutorialRead(keys.scenes.mine);
        },
      );
      this.sceneConfig.sceneState = MineSceneState.TUTORIAL;
      this.tutorialOverlay.show(this);
    }

    const foolsGoldAvailable = this.mineSceneInput.normalizedMoonDistance > 0.5;
    if (
      foolsGoldAvailable &&
      !localStorage.wasTutorialRead(keys.tutorials.foolsGold)
    ) {
      this.tutorialOverlay = new TutorialOverlay().create(
        this,
        FOOLS_GOLD_TUTORIAL,
        () => {
          this.sceneConfig.sceneState = MineSceneState.ROAMING;
          this.sceneConfig.shipConfig.batteryEasing.resetSpeed();
          localStorage.markTutorialRead(keys.tutorials.foolsGold);
        },
      );
      this.sceneConfig.sceneState = MineSceneState.TUTORIAL;
      this.tutorialOverlay.show(this);
    }
  }

  destroy(): void {
    this.ship.destroy();
    this.roomRenderer.destroy();
    this.miningDirt.destroy();
    this.batteryIndicator.destroy();
    this.miningIndicator.destroy();
    this.wobblyIndicator.destroy();
    this.tutorialOverlay?.destroy();
  }

  /* override */
  update(time: number, dt: number): void {
    updateMineSceneConfig(time, dt, this.sceneConfig);
    this.ship.update(dt, this.sceneConfig);
    this.roomRenderer.update(this.sceneConfig);
    this.batteryIndicator.update(this.sceneConfig);
    this.wobblyIndicator.update(dt, this.sceneConfig);
    this.miningIndicator.update(this.sceneConfig);
    this.miningDirt.update(this.sceneConfig);
  }
}

const MINE_SCENE_TUTORIAL: readonly string[] = [
  [
    "Now that you're on an asteroid, you can mine it for",
    'resources. Watch out though, mining asteroids can be',
    'dangerous!',
    '',
    'Controls:',
    '  Up / Down / Left / Right: Move ship',
    '  Space: Activate drill',
    '  Z: Use item (if equipped)',
    '  Q: Leave the asteroid',
  ].join('\n'),
];

const FOOLS_GOLD_TUTORIAL: readonly string[] = [
  [
    'The outer reaches of the asteroid belt are dangerous.',
    "A mysterious element known as Fool's Gold is known to",
    'be out here which can destroy your ship instantly!',
    '',
    'Splinter Labs scientists have developed a tool called',
    'the "Quantum Wibbly" to help with this. Make sure you',
    'have one when exploring further!',
  ].join('\n'),
];
