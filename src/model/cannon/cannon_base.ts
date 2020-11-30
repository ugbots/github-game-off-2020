import { easeInOut, EasingDirection } from '../../math/easing';
import { SoundEasing } from '../../ui/sound_easing';
import { keys } from '../../util/keys';
import { CannonSceneConfig, SceneState } from './cannon_scene_config';

export class CannonBase {
  private sprite: Phaser.GameObjects.Sprite;
  private fuelSound: SoundEasing;
  private movementSound: SoundEasing;

  create(scene: Phaser.Scene, sc: CannonSceneConfig): CannonBase {
    this.sprite = scene.add.sprite(
      sc.cannonPivot.x,
      sc.cannonPivot.y,
      keys.sprites.cannonBase,
    );

    this.movementSound = new SoundEasing().create(
      scene,
      keys.sounds.cannonMovement,
      {
        fn: easeInOut,
        speed: 0.002,
      },
      {
        loop: true,
      },
    );

    this.fuelSound = new SoundEasing().create(
      scene,
      keys.sounds.fuelPump,
      {
        fn: easeInOut,
        speed: 0.002,
      },
      {
        loop: true,
      },
    );

    return this;
  }

  destroy(): void {
    this.sprite.destroy();
    this.movementSound.destroy();
    this.fuelSound.destroy();
  }

  update(time: number, dt: number, sc: CannonSceneConfig): CannonBase {
    this.sprite.setPosition(sc.cannonPivot.x, sc.cannonPivot.y);

    // Play movement sound
    if (sc.cursorKeys.left?.isDown || sc.cursorKeys.right?.isDown || false) {
      this.movementSound.update(dt, EasingDirection.INCREASE);
    } else {
      this.movementSound.update(dt, EasingDirection.DECREASE);
    }

    // Play fuel pump sound
    if (sc.cursorKeys.up?.isDown || sc.cursorKeys.down?.isDown || false) {
      this.fuelSound.update(dt, EasingDirection.INCREASE);
    } else {
      this.fuelSound.update(dt, EasingDirection.DECREASE);
    }

    // Shake based on loaded fuel
    if (sc.sceneState === SceneState.ROTATE_CANNON) {
      const loadedFuel = sc.loadedFuelEasing.getValue();
      this.sprite.scale = 1 + 0.001 * Math.random() * loadedFuel;
      this.sprite.setRotation((0.5 - Math.random()) * 0.001 * loadedFuel);
    }
    return this;
  }
}
