import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import {
  dequipItem,
  EMPTY_INVENTORY,
  equipItem,
  GameState,
  INITIAL_GAME_STATE,
  Inventory,
} from '../../model/game/game_state';
import { EMPTY_ITEM, Item, ItemType } from '../../model/game/item';
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
  @Input() gameState: GameState = INITIAL_GAME_STATE;
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

  handleEquipSelectChange(option?: SelectOption<Item>): void {
    this.currentSelectedEquipment = option?.value;
    this.currentSelectedEquipped = undefined;
    this.equipmentSelectConfig = this.generateEquipmentSelectConfig();
    this.equippedSelectConfig = this.generateEquippedSelectConfig();

    this.nextInventory = undefined;
    if (option?.value !== undefined) {
      this.nextInventory = equipItem(
        this.gameState,
        option?.value,
      ).shipInventory;
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

  handleRemoveSelectChange(option?: SelectOption<Item>): void {
    this.currentSelectedEquipped = option?.value;
    this.currentSelectedEquipment = undefined;
    this.equipmentSelectConfig = this.generateEquipmentSelectConfig();
    this.equippedSelectConfig = this.generateEquippedSelectConfig();

    this.nextInventory = undefined;
    if (option?.value !== undefined) {
      this.nextInventory = dequipItem(
        this.gameState,
        option?.value,
      ).shipInventory;
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
    selectedItem?: Item,
  ): SelectConfig<Item> {
    return {
      options: [
        this.buildDisabledOption('Drills'),
        ...this.buildItemsOption(ItemType.DRILL, inv.items, selectedItem),
        this.buildDisabledOption('Boosters'),
        ...this.buildItemsOption(ItemType.BOOSTER, inv.items, selectedItem),
        this.buildDisabledOption('Batteries'),
        ...this.buildItemsOption(ItemType.BATTERY, inv.items, selectedItem),
        this.buildDisabledOption('Stabilizers'),
        ...this.buildItemsOption(ItemType.STABILIZER, inv.items, selectedItem),
        this.buildDisabledOption('Cannons'),
        ...this.buildItemsOption(ItemType.CANNON, inv.items, selectedItem),
        this.buildDisabledOption('Radar'),
        ...this.buildItemsOption(ItemType.RADAR, inv.items, selectedItem),
      ],
    };
  }

  private buildItemsOption(
    itemType: ItemType,
    items: readonly Item[],
    selectedItem?: Item,
  ): readonly SelectOption<Item>[] {
    return items
      .filter((x) => x.type === itemType)
      .map((item) => ({
        disabled: false,
        selected: item === selectedItem,
        label: item.name,
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
