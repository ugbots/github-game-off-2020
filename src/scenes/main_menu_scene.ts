import { INITIAL_GAME_STATE } from '../model/game/game_state';
import { MenuButton } from '../ui/menu-button';
import { keys } from '../util/keys';
import { localStorage } from '../util/local_storage';
import { SCREEN_DIMENSIONS } from '../util/screen';

/** This Scene shows the main menu. */
export class MainMenuScene extends Phaser.Scene {
  private bgImage: Phaser.GameObjects.Image;

  constructor() {
    super({
      active: false,
      visible: false,
      key: keys.scenes.mainMenu,
    });
  }

  public create(): void {
    this.add.image(
      SCREEN_DIMENSIONS.x / 2,
      SCREEN_DIMENSIONS.y / 2,
      keys.sprites.mainMenuBg,
    );

    const githubUrl = 'github.com/ugbots/github-game-off-2020';
    const githubText = this.add.text(10, 10, githubUrl);

    githubText.setInteractive({
      useHandCursor: true,
    });

    githubText.on('pointerdown', () => {
      window.open('https://' + githubUrl, '_blank');
    });

    this.add.text(SCREEN_DIMENSIONS.x - 170, 10, '© 2020 Ugly Robot');

    new MenuButton(
      this,
      SCREEN_DIMENSIONS.x / 2,
      SCREEN_DIMENSIONS.y * (4 / 5),
      'New game',
      () => {
        localStorage.reset();
        this.scene.start(keys.scenes.cannon, INITIAL_GAME_STATE);
      },
    );

    const loadedGameState = localStorage.getGameState();
    if (loadedGameState !== undefined) {
      new MenuButton(
        this,
        SCREEN_DIMENSIONS.x / 2 + 300,
        SCREEN_DIMENSIONS.y * (4 / 5),
        'Load game',
        () => {
          this.scene.start(loadedGameState.currentScene, loadedGameState);
        },
      );
    }
  }
}
