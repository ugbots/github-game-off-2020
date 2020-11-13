import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ShopContext,
  ShopService,
  ShopState,
} from '../../services/shop/shop_service';
import { SCREEN_DIMENSIONS } from '../../util/screen';
import { selectTab, Tab, TabGroupConfig } from '../tabs/tab_group_config';

@Component({
  selector: 'rat-shop',
  templateUrl: 'assets/templates/shop/shop.ng.html',
  styleUrls: ['assets/css/shop/shop.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent implements OnChanges {
  @Input() shopState = ShopState.SHOP_SHOW;

  screenDimensions = SCREEN_DIMENSIONS;
  hidden = true;
  tabGroupConfig = this.generateTabGroupConfig();
  shouldShowShopPanel = true;

  constructor(@Inject(ShopService) private readonly shopService: ShopService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shopState']) {
      this.hidden = this.shopState === ShopState.SHOP_HIDE;
    }
    if (changes['shopContext']) {
      this.tabGroupConfig = this.generateTabGroupConfig();
    }
  }

  handleTabSelected(tab: Tab<ShopContext>): void {
    this.tabGroupConfig = selectTab(this.tabGroupConfig, tab);
    this.shouldShowShopPanel = tab.value === ShopContext.CONTEXT_SHOP;
  }

  closeShop(): void {
    this.shopService.finishShopping();
  }

  private generateTabGroupConfig(): TabGroupConfig<ShopContext> {
    return {
      tabs: [
        {
          label: 'Shop',
          isSelected: true,
          value: ShopContext.CONTEXT_SHOP,
        },
        {
          label: 'Build',
          isSelected: false,
          value: ShopContext.CONTEXT_BUILD,
        },
      ],
    };
  }
}
