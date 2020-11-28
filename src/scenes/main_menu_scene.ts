import { INITIAL_GAME_STATE } from '../model/game/game_state';
import { MenuButton } from '../ui/menu-button';
import { keys } from '../util/keys';
import { localStorage } from '../util/local_storage';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: keys.scenes.mainMenu,
};

/**
 * The initial scene that starts, shows the splash screens, and loads the necessary assets.
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.add
      .text(
        100,
        50,
        'This is a sample main menu. Click the "Start" button below to run your game.',
        {
          fill: '#FFFFFF',
        },
      )
      .setFontSize(24);

    new MenuButton(this, 100, 150, 'New game', () => {
      localStorage.reset();
      this.scene.start(keys.scenes.cannon, INITIAL_GAME_STATE);
    });

    const loadedGameState = localStorage.getGameState();
    if (loadedGameState !== undefined) {
      new MenuButton(this, 100, 250, 'Load game', () => {
        this.scene.start(loadedGameState.currentScene, loadedGameState);
      });
    }
  }
}
