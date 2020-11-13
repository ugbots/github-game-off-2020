import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EquipmentType } from '../../services/shop/shop_service';
import { selectTab, Tab, TabGroupConfig } from '../tabs/tab_group_config';

@Component({
  selector: 'rat-shop-panel',
  templateUrl: 'assets/templates/shop/shop_panel.ng.html',
  styleUrls: ['assets/css/shop/shop_panel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopPanelComponent {
  equipmentTabGroupConfig = this.generateEquipmentTabGroupConfig();

  handleEquipmentTabSelected(tab: Tab<EquipmentType>): void {
    this.equipmentTabGroupConfig = selectTab(this.equipmentTabGroupConfig, tab);
  }

  private generateEquipmentTabGroupConfig(): TabGroupConfig<EquipmentType> {
    return {
      tabs: [
        {
          label: 'Drills',
          isSelected: true,
          value: EquipmentType.EQUIPMENT_DRILLS,
        },
        {
          label: 'Batteries',
          isSelected: false,
          value: EquipmentType.EQUIPMENT_BATTERIES,
        },
      ],
    };
  }
}
