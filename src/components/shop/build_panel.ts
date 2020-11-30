import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { Cost, COST_FREE, purchase } from '../../model/game/cost';
import {
  dequipAll,
  dequipItem,
  EMPTY_INVENTORY,
  equipItem,
  GameState,
  goldForAnotherEquipmentSlot,
  INITIAL_GAME_STATE,
  Inventory,
} from '../../model/game/game_state';
import { Item, ItemType } from '../../model/game/item';
import { shopScenePlaySound } from '../../scenes/shop_scene';
import { isSuccess } from '../../types/result';
import { keys } from '../../util/keys';
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

  buyEquipmentSlotButtonClasses: readonly string[] = [];
  shipEquipmentCount = this.generateShipEquipmentCount();
  maxShipEquipment = this.generateMaxShipEquipment();
  goldForAnotherEquipmentSlot = this.generateGoldForAnotherEquipmentSlot();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gameState'] && this.gameState !== undefined) {
      this.equipmentSelectConfig = this.generateEquipmentSelectConfig();
      this.equippedSelectConfig = this.generateEquippedSelectConfig();
      this.currentInventory = this.gameState.shipInventory;
      this.shipEquipmentCount = this.generateShipEquipmentCount();
      this.maxShipEquipment = this.generateMaxShipEquipment();
      this.goldForAnotherEquipmentSlot = this.generateGoldForAnotherEquipmentSlot();
      this.buyEquipmentSlotButtonClasses = this.generateBuyEquipmentSlotButtonClasses();
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

  canBuyEquipmentSlot(): boolean {
    if (this.goldForAnotherEquipmentSlot === undefined) {
      return false;
    }
    return this.gameState.wallet.gold >= this.goldForAnotherEquipmentSlot;
  }

  buyEquipmentSlot(): void {
    const goldCost = this.goldForAnotherEquipmentSlot;
    if (goldCost === undefined) {
      return;
    }

    const cost: Cost = {
      ...COST_FREE,
      gold: goldCost,
    };

    const purchaseTry = purchase(this.gameState.wallet, cost);
    if (isSuccess(purchaseTry)) {
      this.gameStateChange.emit({
        ...this.gameState,
        maxShipItems: this.gameState.maxShipItems + 1,
        wallet: purchaseTry.value,
      });
      shopScenePlaySound(keys.sounds.cashRegister);
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

  hasNothingEquipped(): boolean {
    return this.gameState.shipInventory.items.length === 0;
  }

  dequipAll(): void {
    this.gameStateChange.emit(dequipAll(this.gameState));
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

  private generateShipEquipmentCount(): number {
    return this.gameState.shipInventory.items.length;
  }

  private generateMaxShipEquipment(): number {
    return this.gameState.maxShipItems;
  }

  private generateGoldForAnotherEquipmentSlot(): number | undefined {
    return goldForAnotherEquipmentSlot(this.gameState);
  }

  private generateBuyEquipmentSlotButtonClasses(): readonly string[] {
    if (this.canBuyEquipmentSlot()) {
      return [
        'bg-green-700',
        'text-gray-100',
        'cursor-pointer',
        'transition-all',
        'transform-y-0',
        'hover:bg-green-600',
        'hover:-transform-y-1',
      ];
    }
    return ['bg-gray-800', 'text-gray-100', 'cursor-not-allowed'];
  }
}
