import { Scene } from 'phaser';
import { SCREEN_DIMENSIONS } from '../util/screen';
import { MenuButton } from './menu-button';

export class TutorialOverlay {
  private backdrop: Phaser.GameObjects.Rectangle;
  private card: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;
  private okButton: MenuButton;
  private onOkClick: () => void;
  private spaceListener: Phaser.Input.Keyboard.KeyboardPlugin;

  create(scene: Scene, text: string, onOkClick: () => void): TutorialOverlay {
    this.backdrop = scene.add.rectangle(
      SCREEN_DIMENSIONS.x / 2,
      SCREEN_DIMENSIONS.y / 2,
      SCREEN_DIMENSIONS.x,
      SCREEN_DIMENSIONS.y,
      0x000000,
      0.4,
    );

    this.card = scene.add.rectangle(
      SCREEN_DIMENSIONS.x / 2,
      SCREEN_DIMENSIONS.y / 2,
      SCREEN_DIMENSIONS.x * (4 / 5),
      SCREEN_DIMENSIONS.y * (4 / 5),
      0x222222,
    );

    this.text = scene.add.text(
      SCREEN_DIMENSIONS.x * (1 / 7),
      SCREEN_DIMENSIONS.y * (1 / 7),
      text,
      {
        fontFamily: 'monospace',
        color: 'white',
        fontSize: '2rem',
      },
    );

    this.okButton = new MenuButton(
      scene,
      SCREEN_DIMENSIONS.x * (3 / 5),
      SCREEN_DIMENSIONS.y * (4 / 5),
      'OK',
      () => {
        this.hide();
      },
    );

    this.onOkClick = onOkClick;

    this.setVisible(false);

    return this;
  }

  destroy(): void {
    this.backdrop.destroy();
    this.text.destroy();
    this.okButton.destroy();
    if (this.spaceListener !== undefined) {
      this.spaceListener.off('keyup');
    }
  }

  show(scene: Scene): void {
    this.setVisible(true);
    this.spaceListener = scene.input.keyboard.addListener(
      'keyup',
      (e: KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Escape' || e.key === 'Enter') {
          this.hide();
        }
      },
    );
  }

  private hide(): void {
    this.onOkClick();
    this.setVisible(false);
  }

  private setVisible(visible: boolean): void {
    this.backdrop.setVisible(visible);
    this.card.setVisible(visible);
    this.text.setVisible(visible);
    this.okButton.setVisible(visible);
  }
}
