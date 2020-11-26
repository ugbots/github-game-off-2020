import { keys } from '../../util/keys';
import { Vector2 } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { CannonSceneConfig, SceneState } from './cannon_scene_config';

export class FireParticles {
  private manager: Phaser.GameObjects.Particles.ParticleEmitterManager;

  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private position: Vector2;

  private alreadyFired = false;

  create(scene: Phaser.Scene, sc: CannonSceneConfig): FireParticles {
    this.manager = scene.add.particles(keys.particles.fire.atlas);

    this.position = sc.cannonPivot.clone();
    this.position.y -= SCREEN_DIMENSIONS.y / 20;

    this.emitter = this.manager.createEmitter({
      frame: keys.particles.fire.frames,
      x: this.position.x,
      y: this.position.y,
      lifespan: 1500,
      speed: {
        min: 1000,
        max: 4000,
      },
      angle: {
        min: 260,
        max: 280,
      },
      rotate: {
        min: 0,
        max: 90,
      },
      gravityY: 1800,
      scale: {
        min: 2,
        max: 10,
      },
      quantity: 0,
      blendMode: 'ADD',
    });

    return this;
  }

  update(time: number, dt: number, sc: CannonSceneConfig): FireParticles {
    if (sc.sceneState === SceneState.LAUNCH_SHIP && !this.alreadyFired) {
      this.emitter.setQuantity(100);
      this.alreadyFired = true;
    } else {
      this.emitter.setQuantity(0);
    }

    return this;
  }
}
