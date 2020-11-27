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
  private blewUp = false;

  create(sc: MineSceneConfig): MineShip {
    this.sprite = sc.scene.add.sprite(
      sc.shipConfig.position.x,
      sc.shipConfig.position.y,
      keys.sprites.drillShip,
    );

    this.smokeManager = sc.scene.add.particles(keys.particles.smoke.atlas);
    this.fireManager = sc.scene.add.particles(keys.particles.fire.atlas);

    this.smokeEmitter = this.smokeManager.createEmitter({
      frame: keys.particles.smoke.frames,
      x: 0,
      y: 0,
      lifespan: 1500,
      speed: {
        min: 5,
        max: 40,
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
      quantity: 0,
      blendMode: 'OVERLAY',
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

    return this;
  }

  destroy(): void {
    this.fireManager.destroy();
    this.smokeManager.destroy();
    this.sprite.destroy();
  }

  update(sc: MineSceneConfig): void {
    switch (sc.sceneState) {
      case MineSceneState.ROAMING:
        this.updateRoaming(sc);
        break;
      case MineSceneState.SHIP_BLEW_UP:
        this.updateShipBlewUp(sc);
        break;
    }
  }

  private updateRoaming(sc: MineSceneConfig): void {
    this.sprite.rotation = this.generateRotation(sc.shipConfig);
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
