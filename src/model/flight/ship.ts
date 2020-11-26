import { keys } from '../../util/keys';
import { Sprite } from '../../util/phaser_types';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import {
  FlightSceneConfig,
  FlightSceneState,
  FLIGHT_SCENE_SHIP_POSITION,
  FLIGHT_SCENE_SHIP_SIZE,
} from './flight_scene_config';
import { FlightShipThruster } from './flight_ship_thruster';

export class Ship {
  private particleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private sprite: Phaser.GameObjects.Sprite;
  private thrusters: {
    rotateRight: FlightShipThruster;
    rotateLeft: FlightShipThruster;
    forward: FlightShipThruster;
  };

  create(sc: FlightSceneConfig): Ship {
    this.particleManager = sc.scene.add.particles(keys.particles.fire.atlas);

    this.thrusters = {
      rotateRight: new FlightShipThruster().create(sc, this.particleManager),
      rotateLeft: new FlightShipThruster().create(sc, this.particleManager),
      forward: new FlightShipThruster().create(sc, this.particleManager),
    };

    this.sprite = sc.scene.physics.add.sprite(
      SCREEN_DIMENSIONS.x / 2,
      SCREEN_DIMENSIONS.y / 2,
      keys.sprites.drillShip,
    );
    this.sprite.scale = 2;

    return this;
  }

  destroy(): void {
    this.sprite.destroy();
    this.particleManager.destroy();
  }

  update(time: number, dt: number, sc: FlightSceneConfig): void {
    this.sprite.rotation = sc.shipRotation;

    this.updateThrusters(sc);

    if (sc.sceneState === FlightSceneState.INTRO) {
      this.sprite.y = SCREEN_DIMENSIONS.y - sc.shipIntroEasing.getValue() * 100;
    }
    if (sc.sceneState === FlightSceneState.ASTEROID_COLLISION) {
      this.sprite.scale += 0.001 * dt;
    }
  }

  private updateThrusters(sc: FlightSceneConfig): void {
    const shipX = FLIGHT_SCENE_SHIP_POSITION.x;
    const shipY = FLIGHT_SCENE_SHIP_POSITION.y - FLIGHT_SCENE_SHIP_SIZE / 2;

    this.thrusters.forward.setEnabled(sc.shipThrusters.forward);
    this.thrusters.rotateLeft.setEnabled(sc.shipThrusters.rotateLeft);
    this.thrusters.rotateRight.setEnabled(sc.shipThrusters.rotateRight);

    if (sc.shipThrusters.forward) {
      const angle = sc.shipRotation + Math.PI / 2;
      this.thrusters.forward.setRotation(angle);
      const x = shipX + 30 * Math.cos(angle);
      const y = shipY + 30 * Math.sin(angle);
      this.thrusters.forward.setPosition(x, y);
    }

    if (sc.shipThrusters.rotateLeft) {
      const angle = sc.shipRotation + Math.PI;
      this.thrusters.rotateLeft.setRotation(angle);
      const x = shipX + 20 * Math.cos(angle);
      const y = shipY + 20 * Math.sin(angle);
      this.thrusters.rotateLeft.setPosition(x, y);
    }

    if (sc.shipThrusters.rotateRight) {
      const angle = sc.shipRotation;
      this.thrusters.rotateRight.setRotation(angle);
      const x = shipX + 20 * Math.cos(angle);
      const y = shipY + 20 * Math.sin(angle);
      this.thrusters.rotateRight.setPosition(x, y);
    }
  }
}
