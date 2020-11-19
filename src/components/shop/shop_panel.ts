import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ALL_ITEMS } from '../../model/game/all_items';
import { ALL_DRILLS } from '../../model/game/drills';
import { Item, ItemType } from '../../model/game/item';
import { selectTab, Tab, TabGroupConfig } from '../tabs/tab_group_config';

@Component({
  selector: 'rat-shop-panel',
  templateUrl: 'assets/templates/shop/shop_panel.ng.html',
  styleUrls: ['assets/css/shop/shop_panel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopPanelComponent {
  equipmentTabGroupConfig = this.generateEquipmentTabGroupConfig();

  items: readonly Item[] = ALL_DRILLS;
  selectedItem?: Item;

  handleEquipmentTabSelected(tab: Tab<ItemType>): void {
    this.equipmentTabGroupConfig = selectTab(this.equipmentTabGroupConfig, tab);
    this.items = ALL_ITEMS.filter((x) => x.type === tab.value);
    this.selectedItem = undefined;
  }

  selectItem(item: Item): void {
    this.selectedItem = item;
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
}
