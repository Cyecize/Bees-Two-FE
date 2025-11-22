import { Observable, Subject } from 'rxjs';
import { ObjectUtils } from './object-utils';

export interface ScriptLogEntryFormatOptions {
  showType?: boolean;
  showTimestamp?: boolean;
}

export interface ScriptLogEntry {
  type: string;
  timestamp: string;
  message: string;
  formatted(options?: ScriptLogEntryFormatOptions): string;
}

export class ScriptLogEntryImpl implements ScriptLogEntry {
  private readonly MIN_TYPE_LENGTH = 11;

  constructor(
    public type: string,
    public timestamp: string,
    public message: string,
  ) {}
  public formatted(
    options: ScriptLogEntryFormatOptions = {
      showTimestamp: true,
      showType: true,
    },
  ): string {
    if (ObjectUtils.isNil(options.showTimestamp)) {
      options.showTimestamp = true;
    }

    if (ObjectUtils.isNil(options.showType)) {
      options.showType = true;
    }

    const typeVal = `${this.type}${' '.repeat(Math.max(0, this.MIN_TYPE_LENGTH - this.type.length))}`;

    const chunks: string[] = [];

    if (options?.showType) {
      chunks.push(`[${typeVal}]`);
    }

    if (options?.showTimestamp) {
      chunks.push(`[${this.timestamp}]`);
    }

    chunks.push(this.message);

    return chunks.join(' ');
  }
}

/**
 * @monaco
 * @monaco_include_deps
 */
export interface ScriptLogger {
  startCapturing(): boolean;
  log(message: string, type?: string): void;
  logAndPrint(message: string, type?: string): void;
  stopCapturing(): boolean;
  getLogs(): ScriptLogEntry[];
  logStream: Observable<ScriptLogEntry>;
  generateLogFile(): Blob;
  downloadLogFile(filename?: string): void;
  clear(): void;
}

export class ScriptLoggerImpl implements ScriptLogger {
  // TODO: Support multiple instances of this class by fixing this tiny mess
  private readonly originalConsoleLog = console.log;
  private readonly originalAlert = window.alert;
  private logs: ScriptLogEntry[] = [];
  private isCapturing = false;

  private readonly logStreamSubject = new Subject<ScriptLogEntry>();
  public readonly logStream = this.logStreamSubject.asObservable();

  constructor(startCapturing?: boolean) {
    if (startCapturing) {
      this.startCapturing();
    }
  }

  startCapturing(): boolean {
    if (this.isCapturing) {
      return false;
    }
    // Override console.log
    console.log = (...args) => {
      this.log(
        args
          .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
          )
          .join(' '),

        'CONSOLE_LOG',
      );

      // Call original function
      this.originalConsoleLog.apply(console, args);
    };

    // Override alert
    window.alert = (message) => {
      this.log(String(message), 'ALERT_LOG');

      // Call original function
      this.originalAlert(message);
    };

    this.isCapturing = true;
    return true;
  }

  log(message: string, type = 'CUSTOM'): void {
    const entry = new ScriptLogEntryImpl(
      type,
      new Date().toISOString(),
      message,
    );
    this.logs.push(entry);

    this.logStreamSubject.next(entry);
  }

  logAndPrint(message: string, type?: string): void {
    this.log(message, type);
    const wasRunning = this.stopCapturing();
    console.log(message);
    if (wasRunning) {
      this.startCapturing();
    }
  }

  stopCapturing(): boolean {
    if (!this.isCapturing) {
      return false;
    }
    // Restore original functions
    console.log = this.originalConsoleLog;
    window.alert = this.originalAlert;

    this.isCapturing = false;
    return true;
  }

  getLogs(): ScriptLogEntry[] {
    return this.logs;
  }

  generateLogFile(): Blob {
    const logText = this.logs
      .map(
        (entry) =>
          `[${entry.timestamp}] ${entry.type.toUpperCase()}: ${entry.message}`,
      )
      .join('\n');

    return new Blob([logText], { type: 'text/plain' });
  }

  downloadLogFile(filename = 'script-logs.txt'): void {
    const blob = this.generateLogFile();
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    URL.revokeObjectURL(url);
  }

  clear(): void {
    this.logs = [];
  }
}
