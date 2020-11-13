import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  buildEmptyTabGroupConfig,
  Tab,
  TabGroupConfig,
} from './tab_group_config';

@Component({
  selector: 'rat-tab-group',
  templateUrl: 'assets/templates/tab/tab_group.ng.html',
  styleUrls: ['assets/css/tab/tab_group.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroupComponent<T> {
  @Input() config: TabGroupConfig<T> = buildEmptyTabGroupConfig();
  @Output() readonly tabSelected = new EventEmitter<Tab<T>>();

  selectTab(tab: Tab<T>): void {
    this.tabSelected.emit(tab);
  }
}
