import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Drill } from '../../model/game/drills';
import {
  dequipItem,
  equipItem,
  GameState,
  Inventory,
} from '../../model/game/game_state';
import { Item } from '../../model/game/item';
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gameState'] && this.gameState !== undefined) {
      console.log(this.gameState.earthInventory.drills);
      this.equipmentSelectConfig = this.generateEquipmentSelectConfig();
      this.equippedSelectConfig = this.generateEquippedSelectConfig();
    }
  }

  handleEquipSelectChange(item?: Item): void {
    this.currentSelectedEquipment = item;
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
  }

  handleRemoveSelectChange(item?: Item): void {
    this.currentSelectedEquipped = item;
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
  }

  private generateEquipmentSelectConfig(): SelectConfig<Item> {
    return this.generateInventorySelectConfig(this.gameState.earthInventory);
  }

  private generateEquippedSelectConfig(): SelectConfig<Item> {
    return this.generateInventorySelectConfig(this.gameState.shipInventory);
  }

  private generateInventorySelectConfig(inv: Inventory): SelectConfig<Item> {
    return {
      options: [
        this.buildDisabledOption('Drills'),
        ...this.generateDrillsOption(inv.drills),
      ],
    };
  }

  private generateDrillsOption(
    drills: readonly Drill[],
  ): readonly SelectOption<Item>[] {
    return drills.map((drill) => ({
      disabled: true,
      label: '....... ' + drill.name,
      value: drill,
    }));
  }

  private buildDisabledOption(label: string): SelectOption<Item> {
    return {
      disabled: false,
      label,
      value: undefined,
    };
  }
}
