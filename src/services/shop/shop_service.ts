import { Inject, Injectable, NgZone } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { COBALT_FUEL_ROD } from '../../model/game/batteries';
import { ION_ENGINE } from '../../model/game/boosters';
import { M65_ATOMIC_CANNON } from '../../model/game/cannons';
import { addFunds } from '../../model/game/cost';
import { DIAMOND_DRILL } from '../../model/game/drills';
import { GameState, INITIAL_GAME_STATE } from '../../model/game/game_state';
import { QUANTUM_WIBBLY, TELESCOPE, VOID_SONAR } from '../../model/game/radars';
import { SUB_QUANTUM_GYRO } from '../../model/game/stabilizers';
import { finishShopping, shopScenePlaySound } from '../../scenes/shop_scene';
import { keys } from '../../util/keys';

export enum ShopState {
  SHOP_SHOW,
  SHOP_HIDE,
}

export enum ShopContext {
  CONTEXT_SHOP,
  CONTEXT_BUILD,
}

let subFn: (g: GameState) => void = () => {
  throw new Error('subFn not set!');
};

export const showShop = (g: GameState): void => {
  subFn(g);
};

@Injectable()
export class ShopService {
  private readonly gameStateSubject = new BehaviorSubject<
    GameState | undefined
  >(undefined);

  private readonly shopStateSubject = new BehaviorSubject(ShopState.SHOP_HIDE);

  constructor(@Inject(NgZone) private readonly zone: NgZone) {
    subFn = (gameState: GameState) => {
      zone.run(() => {
        this.setShopState(ShopState.SHOP_SHOW);
        this.setGameState(gameState);
      });
    };
  }

  finishShopping(): void {
    this.setShopState(ShopState.SHOP_HIDE);

    this.zone.runOutsideAngular(() => {
      finishShopping(this.gameStateSubject.getValue() ?? INITIAL_GAME_STATE);
    });
  }

  getShopState$(): Observable<ShopState> {
    return this.shopStateSubject;
  }

  setShopState(shopState: ShopState): void {
    this.shopStateSubject.next(shopState);
  }

  getGameState$(): Observable<GameState | undefined> {
    return this.gameStateSubject;
  }

  setGameState(gameState: GameState): void {
    this.gameStateSubject.next(gameState);
  }

  applyCheatCode(cheatCode: string): void {
    const gs = this.gameStateSubject.value ?? INITIAL_GAME_STATE;

    let validCheatCode = true;

    switch (cheatCode) {
      // rosebud: Gain 10,000 of each currency
      case 'rosebud':
        this.setGameState({
          ...gs,
          wallet: addFunds(gs.wallet, {
            gold: 10_000,
            emerald: 10_000,
            ruby: 10_000,
            sapphire: 10_000,
          }),
        });
        break;
      // mechanical: Remove ship equipment limit
      case 'mechanical':
        this.setGameState({
          ...gs,
          maxShipItems: Infinity,
        });
        break;
      // freshness: Reset game state
      case 'freshness':
        this.setGameState(INITIAL_GAME_STATE);
        break;
      // fillerup: Gain 1000 fuel
      case 'fillerup':
        this.setGameState({
          ...gs,
          earthInventory: {
            ...gs.earthInventory,
            fuel: gs.earthInventory.fuel + 1000,
          },
        });
        break;
      // armstrong: Equip awesome upgrades
      case 'armstrong':
        const items = [
          DIAMOND_DRILL,
          COBALT_FUEL_ROD,
          ION_ENGINE,
          SUB_QUANTUM_GYRO,
          M65_ATOMIC_CANNON,
          TELESCOPE,
          VOID_SONAR,
          QUANTUM_WIBBLY,
        ];
        this.setGameState({
          ...gs,
          maxShipItems: items.length,
          shipInventory: {
            ...gs.shipInventory,
            items,
          },
        });
        break;
      default:
        validCheatCode = false;
        break;
    }

    if (validCheatCode) {
      shopScenePlaySound(keys.sounds.powerUp);
    }
  }
}
