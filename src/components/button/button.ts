import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

const ENABLED_CLASSES: readonly string[] = [
  'bg-gray-800',
  'text-gray-200',
  'cursor-pointer',
  'transform',
  'hover:-translate-y-1',
  'hover:shadow',
  'hover:bg-gray-200',
  'hover:text-gray-800',
];

const DISABLED_CLASSES: readonly string[] = [
  'bg-gray-800',
  'text-gray-600',
  'cursor-not-allowed',
];

@Component({
  selector: 'rat-button',
  templateUrl: 'assets/templates/button/button.ng.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnChanges {
  @Input() text: string;
  @Input() disabled?: boolean;

  classes: readonly string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.classes = this.disabled ? DISABLED_CLASSES : ENABLED_CLASSES;
    }
  }
}
