import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Item, Rarity } from '../../model/game/item';
import { titleCase } from '../../strings';

const NOT_SELECTED_CLASSES: readonly string[] = [
  'bg-truegray-900',
  'text-gray-100',
];

const SELECTED_CLASSES: readonly string[] = [
  'bg-truegray-100',
  'text-gray-900',
];

@Component({
  selector: 'rat-item-card',
  templateUrl: 'assets/templates/shop/item_card.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent implements OnChanges {
  @Input() item?: Item;
  @Input() isSelected = false;

  rarityString = '(unknown rarity)';
  baseClasses: readonly string[] = NOT_SELECTED_CLASSES;
  imageBannerClasses: readonly string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.rarityString = titleCase(Rarity[this.item.rarity]);
      this.imageBannerClasses = this.generateImageBannerClasses();
    }
    if (changes['isSelected']) {
      this.baseClasses = this.generateSelectionClasses();
    }
  }

  private generateSelectionClasses(): readonly string[] {
    if (this.isSelected) {
      return SELECTED_CLASSES;
    }
    return NOT_SELECTED_CLASSES;
  }

  private generateImageBannerClasses(): readonly string[] {
    switch (this.item.rarity) {
      case Rarity.COMMON:
        return ['bg-truegray-500'];
      case Rarity.UNCOMMON:
        return ['bg-green-500'];
      case Rarity.RARE:
        return ['bg-blue-500'];
      case Rarity.EPIC:
        return ['bg-purple-500'];
      case Rarity.LEGENDARY:
        return ['bg-orange-500'];
    }
  }
}
