import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tooltip-span',
  standalone: true,
  imports: [],
  templateUrl: './tooltip-span.component.html',
  styleUrl: './tooltip-span.component.scss',
})
export class TooltipSpanComponent {
  @Input()
  displayText!: string;

  @Input()
  tooltipText!: string;
}
