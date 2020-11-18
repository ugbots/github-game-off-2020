import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  buildEmptySelectConfig,
  SelectConfig,
  SelectOption,
} from './select_config';

const DISABLED_CLASSES: readonly string[] = ['text-gray-900'];

const UNSELECTED_CLASSES: readonly string[] = ['text-gray-100'];

const SELECTED_CLASSES: readonly string[] = ['text-gray-100'];

@Component({
  selector: 'rat-select',
  templateUrl: 'assets/templates/select/select.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T> {
  @Input() config: SelectConfig<T> = buildEmptySelectConfig();
  @Output() selectChange = new EventEmitter<T>();

  getClasses(option: SelectOption<T>): readonly string[] {
    if (option.disabled) {
      return DISABLED_CLASSES;
    }
    if (option.selected) {
      return SELECTED_CLASSES;
    }
    return UNSELECTED_CLASSES;
  }

  handleSelectChange(e: Event): void {
    const selectedLabel = (e.target as HTMLSelectElement).value;

    const selectedOption = this.config.options.find(
      (o) => o.label === selectedLabel,
    );

    this.selectChange.emit(selectedOption.value);
  }
}
