import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Cost, salePrice } from '../../model/game/cost';
import { GameState } from '../../model/game/game_state';
import { getCost, Item } from '../../model/game/item';
import { UNIT, Unit } from '../../types/unit';
import { imageBannerClasses, quantityString } from './items';

const BASE_BUTTON_CLASSES = [
  'select-none',
  'rounded-lg',
  'py-2',
  'px-8',
  'mx-1',
  'shadow-lg',
];

const BUTTON_ENABLED_CLASSES = [
  'cursor-pointer',
  'transition-all',
  'transform',
  'hover:-translate-y-1',
  'hover:bg-yellow-300',
];

const BUTTON_DISABLED_CLASSES = [
  ...BASE_BUTTON_CLASSES,
  'cursor-not-allowed',
  'bg-truegray-600',
  'text-truegray-100',
];

const SELL_BUTTON_CLASSES = [
  ...BASE_BUTTON_CLASSES,
  ...BUTTON_ENABLED_CLASSES,
  'bg-red-500',
  'text-gray-900',
];

const BUY_BUTTON_CLASSES = [
  ...BASE_BUTTON_CLASSES,
  ...BUTTON_ENABLED_CLASSES,
  'bg-green-500',
  'text-gray-900',
];

@Component({
  selector: 'rat-item-summary',
  templateUrl: 'assets/templates/shop/item_summary.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemSummaryComponent implements OnChanges {
  @Input() item?: Item;
  @Input() gameState?: GameState;
  @Input() quantity?: number;
  @Input() canBuy?: boolean;
  @Output() sellItem = new EventEmitter<Unit>();
  @Output() buyItem = new EventEmitter<Unit>();

  quantityString = '(unknown quantity)';
  cost?: Cost;
  itemSalePrice?: Cost;

  imageBannerClasses: readonly string[] = [];
  sellButtonClasses: readonly string[] = [];
  buyButtonClasses: readonly string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item !== undefined) {
      this.imageBannerClasses = imageBannerClasses(this.item);
      this.buyButtonClasses = this.generateBuyButtonClasses();
      this.cost = this.generateCost();
      this.itemSalePrice = this.generateSalePrice();
    }
    if (changes['gameState']) {
      this.cost = this.generateCost();
      this.itemSalePrice = this.generateSalePrice();
    }
    if (changes['quantity']) {
      this.quantityString = quantityString(this.quantity ?? 0);
      this.sellButtonClasses = this.generateSellButtonClasses();
    }
    if (changes['canBuy']) {
      this.buyButtonClasses = this.generateBuyButtonClasses();
    }
  }

  handleBuyItem(): void {
    if (Boolean(this.canBuy)) {
      this.buyItem.emit(UNIT);
    }
  }

  handleSellItem(): void {
    if (this.canSell()) {
      this.sellItem.emit(UNIT);
    }
  }

  private canSell(): boolean {
    return (this.quantity ?? 0) > 0;
  }

  private generateSellButtonClasses(): readonly string[] {
    if (!this.canSell()) {
      return BUTTON_DISABLED_CLASSES;
    }
    return SELL_BUTTON_CLASSES;
  }

  private generateBuyButtonClasses(): readonly string[] {
    if (!this.canBuy) {
      return BUTTON_DISABLED_CLASSES;
    }
    return BUY_BUTTON_CLASSES;
  }

  private generateCost(): Cost | undefined {
    if (this.gameState === undefined || this.item === undefined) {
      return undefined;
    }

    return getCost(this.item, this.gameState);
  }

  private generateSalePrice(): Cost | undefined {
    if (this.item === undefined) {
      return undefined;
    }
    return salePrice(this.item.cost);
  }
}
