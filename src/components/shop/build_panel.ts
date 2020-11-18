import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { Drill } from '../../model/game/drills';
import {
  dequipItem,
  EMPTY_INVENTORY,
  equipItem,
  GameState,
  Inventory,
} from '../../model/game/game_state';
import { Item, ItemType } from '../../model/game/item';
import {
  buildEmptySelectConfig,
  SelectConfig,
  SelectOption,
} from '../select/select_config';

@Component({
  selector: 'rat-build-panel',
  templateUrl: 'assets/templates/shop/build_panel.ng.html',
  styleUrls: ['assets/css/shop/build_panel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildPanelComponent implements OnChanges {
  @Input() gameState?: GameState;
  @Output() gameStateChange = new EventEmitter<GameState>();

  equipmentSelectConfig: SelectConfig<Item> = buildEmptySelectConfig();
  equippedSelectConfig: SelectConfig<Item> = buildEmptySelectConfig();

  currentSelectedEquipment?: Item;
  currentSelectedEquipped?: Item;

  currentInventory: Inventory = EMPTY_INVENTORY;
  nextInventory?: Inventory;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gameState'] && this.gameState !== undefined) {
      this.equipmentSelectConfig = this.generateEquipmentSelectConfig();
      this.equippedSelectConfig = this.generateEquippedSelectConfig();
      this.currentInventory = this.gameState.shipInventory;
    }
  }

  handleEquipSelectChange(item?: Item): void {
    this.currentSelectedEquipment = item;
    this.currentSelectedEquipped = undefined;
    this.equipmentSelectConfig = this.generateEquipmentSelectConfig();
    this.equippedSelectConfig = this.generateEquippedSelectConfig();

    this.nextInventory = undefined;
    if (item !== undefined) {
      this.nextInventory = equipItem(this.gameState, item).shipInventory;
    }
  }

  equipCurrentSelection(): void {
    // Guard against unselected equipment
    if (this.currentSelectedEquipment === undefined) {
      return;
    }

    this.gameStateChange.emit(
      equipItem(this.gameState, this.currentSelectedEquipment),
    );
    this.currentSelectedEquipment = undefined;
    this.nextInventory = undefined;
  }

  handleRemoveSelectChange(item?: Item): void {
    this.currentSelectedEquipped = item;
    this.currentSelectedEquipment = undefined;
    this.equipmentSelectConfig = this.generateEquipmentSelectConfig();
    this.equippedSelectConfig = this.generateEquippedSelectConfig();

    this.nextInventory = undefined;
    if (item !== undefined) {
      this.nextInventory = dequipItem(this.gameState, item).shipInventory;
    }
  }

  removeCurrentSelection(): void {
    // Guard against unselected equipment
    if (this.currentSelectedEquipped === undefined) {
      return;
    }

    this.gameStateChange.emit(
      dequipItem(this.gameState, this.currentSelectedEquipped),
    );
    this.currentSelectedEquipped = undefined;
    this.nextInventory = undefined;
  }

  private generateEquipmentSelectConfig(): SelectConfig<Item> {
    return this.generateInventorySelectConfig(
      this.gameState.earthInventory,
      this.currentSelectedEquipment,
    );
  }

  private generateEquippedSelectConfig(): SelectConfig<Item> {
    return this.generateInventorySelectConfig(
      this.gameState.shipInventory,
      this.currentSelectedEquipped,
    );
  }

  private generateInventorySelectConfig(
    inv: Inventory,
    selectedItem: Item,
  ): SelectConfig<Item> {
    return {
      options: [
        this.buildDisabledOption('Drills'),
        ...this.buildItemsOption(ItemType.DRILL, inv.items, selectedItem),
      ],
    };
  }

  private buildItemsOption(
    itemType: ItemType,
    items: readonly Item[],
    selectedItem: Item,
  ): readonly SelectOption<Item>[] {
    return items
      .filter((x) => x.type === itemType)
      .map((item) => ({
        disabled: false,
        selected: item === selectedItem,
        label: `....... ${item.name}`,
        value: item,
      }));
  }

  private buildDisabledOption(label: string): SelectOption<Item> {
    return {
      disabled: true,
      selected: false,
      label,
      value: undefined,
    };
  }
}
