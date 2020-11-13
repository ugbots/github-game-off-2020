import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { buildEmptyTab, Tab } from './tab_group_config';

@Component({
  selector: 'rat-tab',
  templateUrl: 'assets/templates/tab/tab.ng.html',
  styleUrls: ['assets/css/tab/tab.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent<T> {
  @Input() tab: Tab<T> = buildEmptyTab();
}
