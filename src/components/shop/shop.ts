import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { GameState } from '../../model/game/game_state';
import { ItemType } from '../../model/game/item';
import {
  ShopContext,
  ShopService,
  ShopState,
} from '../../services/shop/shop_service';
import { failure, isSuccess, Result, success } from '../../types/result';
import { UNIT, Unit } from '../../types/unit';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { selectTab, Tab, TabGroupConfig } from '../tabs/tab_group_config';

@Component({
  selector: 'rat-shop',
  templateUrl: 'assets/templates/shop/shop.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent implements OnChanges {
  @Input() shopState = ShopState.SHOP_SHOW;

  screenDimensions = SCREEN_DIMENSIONS;
  hidden = true;
  tabGroupConfig = this.generateTabGroupConfig();
  shouldShowShopPanel = true;
  shouldShowBuildPanel = false;

  constructor(@Inject(ShopService) private readonly shopService: ShopService) {}

  gameState$ = this.shopService.getGameState$();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shopState']) {
      this.hidden = this.shopState === ShopState.SHOP_HIDE;
      this.tabGroupConfig = this.generateTabGroupConfig();
    }
  }

  handleTabSelected(tab: Tab<ShopContext>): void {
    this.tabGroupConfig = selectTab(this.tabGroupConfig, tab);
    this.shouldShowShopPanel = tab.value === ShopContext.CONTEXT_SHOP;
    this.shouldShowBuildPanel = tab.value === ShopContext.CONTEXT_BUILD;
  }

  handleGameStateChange(gs: GameState): void {
    this.shopService.setGameState(gs);
  }

  getCloseShopTooltip(gs: GameState): string {
    const result = this.checkCanCloseShop(gs);
    if (isSuccess(result)) {
      return 'Click to launch another ship.';
    }
    return result.error;
  }

  handleCheatCodeSubmit(e: KeyboardEvent): void {
    const inputBox = e.target as HTMLInputElement;
    const cheatCode = inputBox.value;

    this.shopService.applyCheatCode(cheatCode);
    inputBox.value = '';
  }

  getCloseShopButtonClasses(gs: GameState): readonly string[] {
    if (!isSuccess(this.checkCanCloseShop(gs))) {
      return ['bg-gray-900 text-gray-100 cursor-context-menu'];
    }
    return [
      'bg-orange-800',
      'text-gray-100',
      'cursor-pointer',
      'hover:bg-yellow-300',
      'hover:text-gray-900',
    ];
  }

  closeShop(gs: GameState): void {
    if (isSuccess(this.checkCanCloseShop(gs))) {
      this.shopService.finishShopping();
    }
  }

  private generateTabGroupConfig(): TabGroupConfig<ShopContext> {
    return {
      tabs: [
        {
          label: 'Shop',
          isSelected: true,
          value: ShopContext.CONTEXT_SHOP,
        },
        {
          label: 'Build',
          isSelected: false,
          value: ShopContext.CONTEXT_BUILD,
        },
      ],
    };
  }

  private checkCanCloseShop(gs: GameState): Result<string, Unit> {
    return checkHasExactlyOneCannon(gs);
  }
}

const checkHasExactlyOneCannon = (gs: GameState): Result<string, Unit> => {
  const equippedCannons = gs.shipInventory.items.filter(
    (x) => x.type === ItemType.CANNON,
  );

  if (equippedCannons.length === 1) {
    return success(UNIT);
  }

  return failure('You must have exactly one cannon equipped.');
};
