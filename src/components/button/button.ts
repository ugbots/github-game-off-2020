import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'rat-button',
  templateUrl: 'assets/templates/button/button.ng.html',
  styleUrls: ['assets/css/button/button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() text: string;
  @Input() disabled?: boolean;
}
