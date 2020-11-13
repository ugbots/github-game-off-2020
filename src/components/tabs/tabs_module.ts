import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TabGroupComponent } from './tab_group';
import { TabComponent } from './tab';

@NgModule({
  imports: [BrowserModule],
  declarations: [TabGroupComponent, TabComponent],
  exports: [TabGroupComponent, TabComponent],
})
export class TabsModule {}
