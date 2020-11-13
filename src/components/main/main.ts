import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { of } from 'rxjs';
import { ShopService } from '../../services/shop/shop_service';
import { SCREEN_DIMENSIONS } from '../../util/screen';

@Component({
  selector: 'rat-main',
  templateUrl: 'assets/templates/main/main.ng.html',
  styleUrls: ['assets/css/main/main.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  readonly screenDimensions = SCREEN_DIMENSIONS;

  constructor(@Inject(ShopService) private readonly shopService: ShopService) {}

  readonly shopState$ = this.shopService.getShopState$();
}
