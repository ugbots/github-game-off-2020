import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ALL_ITEMS } from '../../model/game/all_items';
import { canAfford, Cost } from '../../model/game/cost';
import { ALL_DRILLS } from '../../model/game/drills';
import { buyItem, GameState, sellItem } from '../../model/game/game_state';
import { Item, itemEquals, ItemType } from '../../model/game/item';
import { isSuccess } from '../../types/result';
import { selectTab, Tab, TabGroupConfig } from '../tabs/tab_group_config';

@Component({
  selector: 'rat-shop-panel',
  templateUrl: 'assets/templates/shop/shop_panel.ng.html',
  styleUrls: ['assets/css/shop/shop_panel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopPanelComponent implements OnChanges {
  @Input() gameState?: GameState;
  @Output() gameStateChange = new EventEmitter<GameState>();

  equipmentTabGroupConfig = this.generateEquipmentTabGroupConfig();

  items: readonly Item[] = ALL_DRILLS;
  selectedItem?: Item;
  canBuySelectedItem = false;
  wallet?: Cost;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gameState']) {
      this.wallet = this.gameState?.wallet;
    }
  }

  handleEquipmentTabSelected(tab: Tab<ItemType>): void {
    this.equipmentTabGroupConfig = selectTab(this.equipmentTabGroupConfig, tab);
    this.items = ALL_ITEMS.filter((x) => x.type === tab.value);
    this.selectedItem = undefined;
  }

  getQuantity(item?: Item): number {
    if (item === undefined) {
      return 0;
    }

    const owned = this.gameState?.earthInventory?.items ?? [];

    return owned.filter((x) => itemEquals(x, item)).length;
  }

  selectItem(item: Item): void {
    this.selectedItem = item;
    this.canBuySelectedItem = this.generateCanBuySelectedItem();
  }

  handleBuyItem(): void {
    if (this.gameState === undefined) {
      throw new Error("Can't buy item, GameState is undefined!");
    }
    if (this.selectedItem === undefined) {
      throw new Error("Can't buy item, selectedItem is undefined!");
    }

    const result = buyItem(this.gameState, this.selectedItem);
    if (!isSuccess(result)) {
      throw new Error(result.error);
    }
    this.gameStateChange.emit(result.value);
  }

  handleSellItem(): void {
    if (this.gameState === undefined) {
      throw new Error("Can't sell item, GameState is undefined!");
    }
    if (this.selectedItem === undefined) {
      throw new Error("Can't sell item, selectedItem is undefined!");
    }

    const result = sellItem(this.gameState, this.selectedItem);
    if (!isSuccess(result)) {
      throw new Error(result.error);
    }
    this.gameStateChange.emit(result.value);
  }

  private generateEquipmentTabGroupConfig(): TabGroupConfig<ItemType> {
    return {
      tabs: [
        {
          label: 'Drills',
          isSelected: true,
          value: ItemType.DRILL,
        },
        {
          label: 'Batteries',
          isSelected: false,
          value: ItemType.BATTERY,
        },
        {
          label: 'Boosters',
          isSelected: false,
          value: ItemType.BOOSTER,
        },
      ],
    };
  }

  private generateCanBuySelectedItem(): boolean {
    if (this.gameState?.wallet === undefined) {
      return false;
    }
    if (this.selectedItem === undefined) {
      return false;
    }

    return canAfford(this.gameState.wallet, this.selectedItem.cost);
  }
}
