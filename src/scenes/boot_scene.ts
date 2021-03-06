import * as Phaser from 'phaser';
import { getGameWidth, getGameHeight } from '../helpers';
import { FlightSceneInput } from '../model/flight/flight_scene_input';
import { INITIAL_GAME_STATE } from '../model/game/game_state';
import { MineSceneInput } from '../model/mine/mine_scene_input';
import { keys } from '../util/keys';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

/**
 * The initial scene that loads all necessary assets to the game and displays a loading bar.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    const halfWidth = getGameWidth(this) * 0.5;
    const halfHeight = getGameHeight(this) * 0.5;

    const progressBarHeight = 100;
    const progressBarWidth = 400;

    const progressBarContainer = this.add.rectangle(
      halfWidth,
      halfHeight,
      progressBarWidth,
      progressBarHeight,
      0x000000,
    );
    const progressBar = this.add.rectangle(
      halfWidth + 20 - progressBarContainer.width * 0.5,
      halfHeight,
      10,
      progressBarHeight - 20,
      0x888888,
    );

    const loadingText = this.add
      .text(halfWidth - 75, halfHeight - 100, 'Loading...')
      .setFontSize(24);
    const percentText = this.add
      .text(halfWidth - 25, halfHeight, '0%')
      .setFontSize(24);
    const assetText = this.add
      .text(halfWidth - 25, halfHeight + 100, '')
      .setFontSize(24);

    this.load.on('progress', (value) => {
      progressBar.width = (progressBarWidth - 30) * value;

      const percent = value * 100;
      percentText.setText(`${percent}%`);
    });

    this.load.on('fileprogress', (file) => {
      assetText.setText(file.key);
    });

    this.load.on('complete', () => {
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      progressBar.destroy();
      progressBarContainer.destroy();

      this.startScene(keys.scenes.mainMenu);
    });

    this.loadAssets();
  }

  private startScene(sceneKey: string): void {
    switch (sceneKey) {
      case keys.scenes.flight: {
        const input: FlightSceneInput = {
          gameState: INITIAL_GAME_STATE,
          cannonVelocityPercent: 100,
          aimedAtMoon: false,
        };
        this.scene.start(sceneKey, input);
        break;
      }
      case keys.scenes.mine: {
        const input: MineSceneInput = {
          gameState: INITIAL_GAME_STATE,
          normalizedMoonDistance: 0.5,
        };
        this.scene.start(sceneKey, input);
        break;
      }
      default: {
        this.scene.start(sceneKey, INITIAL_GAME_STATE);
        break;
      }
    }
  }

  /**
   * All assets that need to be loaded by the game (sprites, images, animations,
   * tiles, music, etc) should be added to this method. Once loaded in, the
   * loader will keep track of them, indepedent of which scene
   * is currently active, so they can be accessed anywhere.
   */
  private loadAssets(): void {
    // Images
    this.load.image(keys.sprites.cannonBase, 'assets/sprites/cannon_base.png');
    this.load.image(
      keys.sprites.cannonTurret,
      'assets/sprites/cannon_turret.png',
    );
    this.load.image(keys.sprites.drillShip, 'assets/sprites/drillship.png');
    this.load.image(
      keys.sprites.blownUpDrillship,
      'assets/sprites/blown_up_drillship.png',
    );
    this.load.image(keys.sprites.mainMenuBg, 'assets/sprites/main_menu_bg.png');
    this.load.image(keys.sprites.planetFg, 'assets/sprites/frontPlanet.png');
    this.load.image(keys.sprites.planetBg, 'assets/sprites/planetBg.png');
    this.load.image(keys.sprites.asteroid, 'assets/sprites/asteroid.png');
    this.load.image(keys.sprites.white, 'assets/sprites/white.png');
    this.load.image(keys.sprites.moon, 'assets/sprites/moon.png');

    this.load.atlas(
      keys.atlas.asteroidTiles.key,
      'assets/sprites/asteroid_tiles.png',
      'assets/atlas/asteroid_tiles.json',
    );

    // Sounds
    this.load.audio(keys.sounds.booster, 'assets/sound/booster.mp3');
    this.load.audio(keys.sounds.cashRegister, 'assets/sound/cash_register.mp3');
    this.load.audio(keys.sounds.crash, 'assets/sound/crash.mp3');
    this.load.audio(keys.sounds.cannonBlast, 'assets/sound/cannon_blast.mp3');
    this.load.audio(
      keys.sounds.cannonMovement,
      'assets/sound/cannon_movement.mp3',
    );
    this.load.audio(keys.sounds.drill, 'assets/sound/drill.mp3');
    this.load.audio(keys.sounds.explosion, 'assets/sound/explosion.mp3');
    this.load.audio(keys.sounds.fanfare, 'assets/sound/fanfare.mp3');
    this.load.audio(keys.sounds.fuelPump, 'assets/sound/fuel_pump.mp3');
    this.load.audio(keys.sounds.powerUp, 'assets/sound/power_up.mp3');
    this.load.audio(keys.sounds.shipEngine, 'assets/sound/ship_engine.mp3');
    this.load.audio(
      keys.sounds.suckedIntoAsteroid,
      'assets/sound/sucked_into_asteroid.mp3',
    );
    this.load.audio(keys.sounds.wibbly, 'assets/sound/wibbly.mp3');

    // Particles
    this.load.atlas(
      keys.particles.dirt.atlas,
      'assets/sprites/brown.png',
      'assets/particles/dirt.json',
    );
    this.load.atlas(
      keys.particles.fire.atlas,
      'assets/sprites/fire_particles.png',
      'assets/particles/fire_particles.json',
    );
    this.load.atlas(
      keys.particles.smoke.atlas,
      'assets/sprites/smoke.png',
      'assets/particles/smoke.json',
    );
  }
}
