import { keys } from '../../util/keys';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { CannonSceneConfig, SceneState } from './cannon_scene_config';

export class CannonTurret {
  private sprite: Phaser.GameObjects.Sprite;
  private blastSound: Phaser.Sound.BaseSound;

  private alreadyFired = false;

  create(scene: Phaser.Scene, sc: CannonSceneConfig): CannonTurret {
    this.sprite = scene.add.sprite(
      sc.cannonPivot.x,
      sc.cannonPivot.y,
      keys.sprites.cannonTurret,
    );

    this.blastSound = scene.sound.add(keys.sounds.cannonBlast);
    return this;
  }

  destroy(): void {
    this.sprite.destroy();
    this.blastSound.destroy();
  }

  update(time: number, dt: number, sc: CannonSceneConfig): CannonTurret {
    const r = sc.rotationEasing.getValue();
    const t = r * (1 + 0.3 * Math.sin(0.01 * time));

    this.sprite.rotation = t * 20;

    const recoil = sc.cannonFireEasing.getValue();

    const px = sc.cannonPivot.x + t * 1500;
    const py = sc.cannonPivot.y - SCREEN_DIMENSIONS.y / 10 + recoil * 100;

    this.sprite.setPosition(px, py);

    // Shake based on loaded fuel
    if (sc.sceneState === SceneState.ROTATE_CANNON) {
      const loadedFuel = sc.loadedFuelEasing.getValue();
      this.sprite.scale = 1 + 0.001 * Math.random() * loadedFuel;
      this.sprite.rotation += (0.5 - Math.random()) * 0.001 * loadedFuel;
    }

    if (!this.alreadyFired && sc.sceneState === SceneState.LAUNCH_SHIP) {
      this.alreadyFired = true;
      this.blastSound.play();
    }
    return this;
  }
}
