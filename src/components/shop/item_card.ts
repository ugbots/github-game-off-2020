import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Item, Rarity } from '../../model/game/item';
import { titleCase } from '../../util/strings';
import { imageBannerClasses, quantityString } from './items';

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
  @Input() quantity?: number;
  @Input() isSelected = false;

  rarityString = '(unknown rarity)';
  quantityString = '(unknown quantity)';
  baseClasses: readonly string[] = NOT_SELECTED_CLASSES;
  imageBannerClasses: readonly string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item !== undefined) {
      this.rarityString = titleCase(Rarity[this.item.rarity]);
      this.imageBannerClasses = imageBannerClasses(this.item);
    }
    if (changes['quantity']) {
      this.quantityString = this.generateQuantityString();
    }
    if (changes['isSelected']) {
      this.baseClasses = this.generateSelectionClasses();
    }
  }

  private generateQuantityString(): string {
    return quantityString(this.quantity ?? 0);
  }

  private generateSelectionClasses(): readonly string[] {
    if (this.isSelected) {
      return SELECTED_CLASSES;
    }
    return NOT_SELECTED_CLASSES;
  }
}
