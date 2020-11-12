import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ShopService } from '../../services/shop/shop_service';
import { PhaserWrapperModule } from '../phaserwrapper/phaser_wrapper_module';
import { ShopModule } from '../shop/shop_module';
import { MainComponent } from './main';

@NgModule({
  imports: [BrowserModule, PhaserWrapperModule, ShopModule],
  providers: [ShopService],
  declarations: [MainComponent],
  bootstrap: [MainComponent],
})
export class MainModule {}
