import { Inject, Injectable, NgZone } from '@angular/core';
import { Game } from 'phaser';

import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../../model/game/game_state';
import { finishShopping } from '../../scenes/shop_scene';

export enum ShopState {
  SHOP_SHOW,
  SHOP_HIDE,
}

let subFn: (g: GameState) => void = undefined;

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

  setShopState(shopState: ShopState): void {
    this.shopStateSubject.next(shopState);
  }

  finishShopping(): void {
    this.setShopState(ShopState.SHOP_HIDE);

    this.zone.runOutsideAngular(() => {
      finishShopping(this.gameStateSubject.getValue());
    });
  }

  setGameState(gameState: GameState): void {
    this.gameStateSubject.next(gameState);
  }

  getShopState$(): Observable<ShopState> {
    return this.shopStateSubject;
  }

  getGameState$(): Observable<GameState|undefined> {
    return this.gameStateSubject;
  }
}
