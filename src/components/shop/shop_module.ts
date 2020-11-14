import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from '../button/button_module';
import { SelectModule } from '../select/select_module';
import { TabsModule } from '../tabs/tabs_module';
import { BuildPanelComponent } from './build_panel';
import { ShipStatsDiffComponent } from './ship_stats_diff';

import { ShopComponent } from './shop';
import { ShopPanelComponent } from './shop_panel';

@NgModule({
  imports: [ButtonModule, BrowserModule, SelectModule, TabsModule],
  declarations: [
    BuildPanelComponent,
    ShopComponent,
    ShopPanelComponent,
    ShipStatsDiffComponent,
  ],
  exports: [ShopComponent],
})
export class ShopModule {}
