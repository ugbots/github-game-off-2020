import { Sound } from 'phaser';
import { easeInOut, EasingDirection } from '../../math/easing';
import { SoundEasing } from '../../ui/sound_easing';
import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import { Direction } from './direction';
import {
  MineSceneConfig,
  MineSceneState,
  MineShipConfig,
  ShipState,
} from './mine_scene_config';

export class MineShip {
  private fireManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private fireEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private smokeManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private sprite: Phaser.GameObjects.Sprite;

  private engineSound: SoundEasing;
  private drillSound: SoundEasing;
  private explosionSound: Phaser.Sound.BaseSound;
  private blewUp = false;

  create(sc: MineSceneConfig): MineShip {
    this.smokeManager = sc.scene.add.particles(keys.particles.smoke.atlas);

    this.sprite = sc.scene.add.sprite(
      sc.shipConfig.position.x,
      sc.shipConfig.position.y,
      keys.sprites.drillShip,
    );

    this.fireManager = sc.scene.add.particles(keys.particles.fire.atlas);

    this.smokeEmitter = this.smokeManager.createEmitter({
      frame: keys.particles.smoke.frames,
      x: 0,
      y: 0,
      lifespan: {
        min: 1_500,
        max: 3_000,
      },
      speed: {
        min: 10,
        max: 80,
      },
      angle: {
        min: 260,
        max: 320,
      },
      rotate: {
        start: 0,
        end: 360,
      },
      scale: {
        min: 2,
        max: 10,
      },
      quantity: 0.1,
      blendMode: 'NORMAL',
    });

    this.fireEmitter = this.fireManager.createEmitter({
      frame: keys.particles.fire.frames,
      x: 0,
      y: 0,
      lifespan: 1500,
      speed: {
        min: 1000,
        max: 4000,
      },
      angle: {
        min: 0,
        max: 360,
      },
      rotate: {
        start: 0,
        end: 360,
      },
      scale: {
        min: 2,
        max: 10,
      },
      quantity: 0,
      blendMode: 'COPY',
    });

    this.engineSound = new SoundEasing().create(
      sc.scene,
      keys.sounds.shipEngine,
      {
        fn: easeInOut,
        speed: 0.005,
        friction: 1,
        minVolume: 0.5,
      },
      {
        loop: true,
      },
    );

    this.drillSound = new SoundEasing().create(
      sc.scene,
      keys.sounds.drill,
      {
        fn: easeInOut,
        speed: 0.05,
        friction: 1,
      },
      {
        loop: true,
      },
    );

    this.explosionSound = sc.scene.sound.add(keys.sounds.explosion);

    return this;
  }

  destroy(): void {
    this.fireManager.destroy();
    this.smokeManager.destroy();
    this.sprite.destroy();
    this.engineSound.destroy();
    this.drillSound.destroy();
    this.explosionSound.destroy();
  }

  update(dt: number, sc: MineSceneConfig): void {
    switch (sc.sceneState) {
      case MineSceneState.ROAMING:
        this.updateRoaming(dt, sc);
        break;
      case MineSceneState.SHIP_BLEW_UP:
        this.updateShipBlewUp(sc);
        break;
    }
  }

  private updateRoaming(dt: number, sc: MineSceneConfig): void {
    const rotation = this.generateRotation(sc.shipConfig);
    this.smokeEmitter.setPosition(
      sc.shipConfig.position.x + Math.cos(rotation + Math.PI / 2) * 32,
      sc.shipConfig.position.y + Math.sin(rotation + Math.PI / 2) * 20,
    );

    this.sprite.rotation = rotation;
    this.sprite.scale = 2;

    const wobbly = sc.shipConfig.foolsGoldRadarEasing.getValue();
    const wobblyChannel = Math.floor((1 - wobbly) * 0xff);
    this.sprite.setTint(0x00ff00 | (wobblyChannel << 16) | wobblyChannel);

    const rotateMul =
      sc.shipConfig.foolsGoldRadarEasing.getValue() *
      (Math.random() * 0.2 - 0.1);
    this.sprite.rotation += rotateMul;

    const shakeMul = sc.shipConfig.shipState === ShipState.MINING ? 2.5 : 0;

    this.sprite.x =
      sc.shipConfig.position.x + (2 * Math.random() - 1) * shakeMul;
    this.sprite.y =
      sc.shipConfig.position.y + (2 * Math.random() - 1) * shakeMul;

    // Play drill sound
    if (sc.shipConfig.shipState === ShipState.MINING) {
      this.drillSound.update(dt, EasingDirection.INCREASE);
    } else {
      this.drillSound.update(dt, EasingDirection.DECREASE);
    }

    // Change engine sound
    if (
      sc.cursorKeys.left?.isDown ||
      sc.cursorKeys.right?.isDown ||
      sc.cursorKeys.up?.isDown ||
      sc.cursorKeys.down?.isDown
    ) {
      this.engineSound.update(dt, EasingDirection.INCREASE);
    } else {
      this.engineSound.update(dt, EasingDirection.DECREASE);
    }
  }

  private updateShipBlewUp(sc: MineSceneConfig): void {
    if (!this.blewUp) {
      this.sprite.setTexture(keys.sprites.blownUpDrillship);
      this.fireEmitter.setPosition(
        sc.shipConfig.position.x,
        sc.shipConfig.position.y,
      );
      this.smokeEmitter.setPosition(
        sc.shipConfig.position.x,
        sc.shipConfig.position.y,
      );
      this.fireEmitter.setQuantity(500);
      this.smokeEmitter.setQuantity(1);

      this.engineSound.stop();
      this.explosionSound.play();

      this.blewUp = true;
    } else {
      this.fireEmitter.setQuantity(0);
    }

    this.smokeEmitter.setPosition(
      sc.shipConfig.position.x + Math.random() * 60 - 30,
      sc.shipConfig.position.y,
    );
  }

  private generateRotation(sc: MineShipConfig): number {
    switch (sc.direction) {
      case Direction.NORTH:
        return 0;
      case Direction.EAST:
        return Math.PI / 2;
      case Direction.SOUTH:
        return Math.PI;
      case Direction.WEST:
        return Math.PI * (3 / 2);
    }
  }
}
