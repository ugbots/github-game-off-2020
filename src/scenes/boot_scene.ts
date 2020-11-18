import { BinaryOperatorExpr } from '@angular/compiler';
import * as Phaser from 'phaser';
import { getGameWidth, getGameHeight } from '../helpers';
import { INITIAL_GAME_STATE } from '../model/game/game_state';
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

      this.startScene(keys.scenes.flight);
    });

    this.loadAssets();
  }

  private startScene(sceneKey: string): void {
    switch (sceneKey) {
      case keys.scenes.flight: {
        this.scene.start(sceneKey, {
          gameState: INITIAL_GAME_STATE,
          shipRotationVelocity: 0.01,
        });
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
    // Load sample assets

    // Images
    this.load.image(keys.sprites.cannonBase, 'assets/sprites/cannon_base.png');
    this.load.image(
      keys.sprites.cannonTurret,
      'assets/sprites/cannon_turret.png',
    );
    this.load.image(keys.sprites.drillShip, 'assets/sprites/drillship.png');
    this.load.image(keys.sprites.planet, 'assets/sprites/planet.png');
    this.load.image(keys.sprites.white, 'assets/sprites/white.png');

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
  }
}
