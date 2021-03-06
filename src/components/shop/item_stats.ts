import {
  Component,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Item } from '../../model/game/item';

interface ItemStat {
  readonly name: string;
  readonly value: number | boolean;
}

@Component({
  selector: 'rat-item-stats',
  templateUrl: 'assets/templates/shop/item_stats.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemStatsComponent implements OnChanges {
  @Input() item?: Item;

  itemStats: readonly ItemStat[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.itemStats = this.generateItemStats();
    }
  }

  private generateItemStats(): readonly ItemStat[] {
    if (this.item === undefined) {
      return [];
    }

    return [
      { name: 'Drill', value: this.item.drills },
      { name: 'Battery', value: this.item.batteries },
      { name: 'Booster', value: this.item.boosters },
      { name: 'Stabilizers', value: this.item.stabilizers },
      { name: 'Max cannon power', value: this.item.maxCannonPower },
      { name: 'Moon radar', value: this.item.moonRadar },
      { name: 'Asteroid radar', value: this.item.asteroidRadar },
      { name: "Fool's Gold radar", value: this.item.foolsGoldRadar },
      { name: 'Equipment slots', value: this.item.equipmentSlots },
    ].filter((x) => x.value !== 0 && x.value !== false);
  }
}
