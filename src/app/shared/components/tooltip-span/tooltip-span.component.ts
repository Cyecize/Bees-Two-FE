import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { CopyIconComponent } from '../copy-icon/copy-icon.component';
import { NgIf } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-tooltip-span',
  standalone: true,
  imports: [CopyIconComponent, NgIf, MatTooltip],
  templateUrl: './tooltip-span.component.html',
  styleUrl: './tooltip-span.component.scss',
})
export class TooltipSpanComponent implements OnInit {
  @Input()
  displayText!: string;

  @Input()
  trimDisplayTextChars = -1;

  @Input()
  tooltipText!: string;

  @Input()
  enableCopy = false;

  @Input()
  onCopy = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    if (this.trimDisplayTextChars > 0) {
      this.displayText = this.shortenStr(this.displayText);
    }
  }

  onTextCopy(val: string): void {
    this.onCopy.emit(val);
  }

  private shortenStr(str: any): string {
    return (
      str.substring(0, Math.min(str.length, this.trimDisplayTextChars)) +
      (str.length > this.trimDisplayTextChars ? '...' : '')
    );
  }
}
