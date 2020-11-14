import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { buildEmptySelectConfig, SelectConfig } from './select_config';

@Component({
  selector: 'rat-select',
  templateUrl: 'assets/templates/select/select.ng.html',
  styleUrls: ['assets/css/select/select.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T> {
  @Input() config: SelectConfig<T> = buildEmptySelectConfig();
  @Output() selectChange = new EventEmitter<T>();

  handleSelectChange(e: Event): void {
    const selectedLabel = (e.target as HTMLSelectElement).value;

    const selectedOption = this.config.options.find(
      (o) => o.label === selectedLabel,
    );

    this.selectChange.emit(selectedOption.value);
  }
}
