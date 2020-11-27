import { Inject, Injectable, NgZone } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { addFunds } from '../../model/game/cost';
import {
  GameState,
  INITIAL_GAME_STATE,
  moveShipWalletToWallet,
} from '../../model/game/game_state';
import { finishShopping } from '../../scenes/shop_scene';

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

    switch (cheatCode) {
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
    }
  }
}
