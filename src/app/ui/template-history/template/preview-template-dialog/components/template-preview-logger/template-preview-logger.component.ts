import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  ScriptLogEntryFormatOptions,
  ScriptLogger,
} from '../../../../../../shared/util/script-logger';
import { CheckboxComponent } from '../../../../../../shared/form-controls/checkbox/checkbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template-preview-logger',
  standalone: true,
  imports: [AsyncPipe, CheckboxComponent, FormsModule],
  templateUrl: './template-preview-logger.component.html',
  styleUrl: './template-preview-logger.component.scss',
})
export class TemplatePreviewLoggerComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  private readonly subscriptions: Subscription[] = [];

  private readonly logsSubject = new BehaviorSubject<string>(null!);
  readonly logStream = this.logsSubject.asObservable();
  autoScrollLogs = true; // Toggle flag for auto-scrolling
  @ViewChild('logContainer') private logContainer!: ElementRef;

  formatOptions: ScriptLogEntryFormatOptions = {
    showTimestamp: true,
    showType: true,
  };

  @Input()
  scriptLogger!: ScriptLogger;

  @Output()
  logsCleared: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    const sub = this.scriptLogger.logStream.subscribe((log) => {
      this.refreshLogs();
    });

    this.subscriptions.push(sub);
    this.refreshLogs();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.autoScrollLogs && this.logContainer) {
      try {
        const element = this.logContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      } catch (err) {
        console.warn('Could not scroll to bottom:', err);
      }
    }
  }

  onLogScroll(): void {
    if (!this.logContainer) return;

    const element = this.logContainer.nativeElement;
    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 50; // 50px tolerance

    // If user scrolls to bottom, re-enable auto-scroll
    if (atBottom) {
      this.autoScrollLogs = true;
    }
    // If user scrolls up, disable auto-scroll
    else if (this.autoScrollLogs) {
      this.autoScrollLogs = false;
    }
  }

  // toggleAutoScroll(): void {
  //   this.autoScrollLogs = !this.autoScrollLogs;
  //   if (this.autoScrollLogs) {
  //     this.scrollToBottom();
  //   }
  // }

  clearLogs(): void {
    this.scriptLogger.clear();
    this.logsSubject.next('');
    this.logsCleared.next();
  }

  refreshLogs(): void {
    const value = this.scriptLogger
      .getLogs()
      .map((log) => log.formatted(this.formatOptions))
      .join('\n');

    this.logsSubject.next(value);
  }
}
