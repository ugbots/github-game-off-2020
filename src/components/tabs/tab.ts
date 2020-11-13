import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Tab } from './tab_group_config';

const buildEmptyTab = <T>(): Tab<T> => ({
  label: '(unknown label)',
  isSelected: false,
  value: undefined,
});

@Component({
  selector: 'rat-tab',
  templateUrl: 'assets/templates/tab/tab.ng.html',
  styleUrls: ['assets/css/tab/tab.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent<T> {
  @Input() tab: Tab<T> = buildEmptyTab();
}
