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
import { BATTERY_HELP } from '../../model/game/batteries';
import { BOOSTER_HELP } from '../../model/game/boosters';
import { CANNON_HELP } from '../../model/game/cannons';
import { canAfford, Cost } from '../../model/game/cost';
import { ALL_DRILLS, DRILL_HELP } from '../../model/game/drills';
import { buyItem, GameState, sellItem } from '../../model/game/game_state';
import { getCost, Item, itemEquals, ItemType } from '../../model/game/item';
import { RADAR_HELP } from '../../model/game/radars';
import { SHIP_UPGRADE_HELP } from '../../model/game/ship_upgrades';
import { STABILIZER_HELP } from '../../model/game/stabilizers';
import { shopScenePlaySound } from '../../scenes/shop_scene';
import { isSuccess } from '../../types/result';
import { keys } from '../../util/keys';
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
  itemCategoryHelp = DRILL_HELP;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gameState']) {
      this.wallet = this.gameState?.wallet;
      this.canBuySelectedItem = this.generateCanBuySelectedItem();
    }
  }

  handleEquipmentTabSelected(tab: Tab<ItemType>): void {
    this.equipmentTabGroupConfig = selectTab(this.equipmentTabGroupConfig, tab);
    this.items = ALL_ITEMS.filter((x) => x.type === tab.value);
    this.selectedItem = undefined;
    this.itemCategoryHelp = this.generateItemCategoryHelp(tab.value);
  }

  getQuantity(item?: Item): number {
    if (item === undefined) {
      return 0;
    }

    const earthInv = this.gameState?.earthInventory?.items ?? [];
    const shipInv = this.gameState?.shipInventory?.items ?? [];

    return [...earthInv, ...shipInv].filter((x) => itemEquals(x, item)).length;
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

    // Do custom GameState change if the item requests it, or just buy the item
    // if it doesn't.
    if (this.selectedItem.handleBuy !== undefined) {
      const cost = getCost(this.selectedItem, this.gameState);
      if (cost === undefined) {
        throw new Error("Can't buy item, it's not for sale!");
      }

      const buyResult = this.selectedItem.handleBuy(this.gameState, cost);

      if (!isSuccess(buyResult)) {
        throw new Error(buyResult.error);
      }

      this.gameStateChange.emit(buyResult.value);
      shopScenePlaySound(keys.sounds.cashRegister);
      return;
    }

    const result = buyItem(this.gameState, this.selectedItem);
    if (!isSuccess(result)) {
      throw new Error(result.error);
    }
    this.gameStateChange.emit(result.value);
    shopScenePlaySound(keys.sounds.cashRegister);
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
    shopScenePlaySound(keys.sounds.cashRegister);
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
        {
          label: 'Stabilizers',
          isSelected: false,
          value: ItemType.STABILIZER,
        },
        {
          label: 'Cannons',
          isSelected: false,
          value: ItemType.CANNON,
        },
        {
          label: 'Radar',
          isSelected: false,
          value: ItemType.RADAR,
        },
        {
          label: 'Ship',
          isSelected: false,
          value: ItemType.SHIP_UPGRADE,
        },
      ],
    };
  }

  private generateItemCategoryHelp(itemType?: ItemType): string {
    switch (itemType) {
      case undefined:
        return '(unknown ItemType)';
      case ItemType.DRILL:
        return DRILL_HELP;
      case ItemType.BATTERY:
        return BATTERY_HELP;
      case ItemType.BOOSTER:
        return BOOSTER_HELP;
      case ItemType.CANNON:
        return CANNON_HELP;
      case ItemType.STABILIZER:
        return STABILIZER_HELP;
      case ItemType.RADAR:
        return RADAR_HELP;
      case ItemType.SHIP_UPGRADE:
        return SHIP_UPGRADE_HELP;
    }
  }

  private generateCanBuySelectedItem(): boolean {
    if (this.gameState?.wallet === undefined) {
      return false;
    }
    if (this.selectedItem === undefined) {
      return false;
    }

    const itemCost = getCost(this.selectedItem, this.gameState);
    if (itemCost === undefined) {
      return false;
    }

    return canAfford(this.gameState.wallet, itemCost);
  }
}
