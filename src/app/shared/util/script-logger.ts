export interface ScriptLogEntry {
  type: string;
  timestamp: string;
  message: string;
}

/**
 * @monaco
 * @monaco_include_deps
 */
export interface ScriptLogger {
  startCapturing(): void;
  stopCapturing(): void;
  getLogs(): ScriptLogEntry[];
  generateLogFile(): Blob;
  downloadLogFile(filename?: string): void;
}

export class ScriptLoggerImpl implements ScriptLogger {
  private readonly originalConsoleLog = console.log;
  private readonly originalAlert = window.alert;
  private readonly logs: ScriptLogEntry[] = [];
  constructor(startCapturing?: boolean) {
    if (startCapturing) {
      this.startCapturing();
    }
  }

  startCapturing(): void {
    // Override console.log
    console.log = (...args) => {
      this.logs.push({
        type: 'log',
        timestamp: new Date().toISOString(),
        message: args
          .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
          )
          .join(' '),
      });
      // Call original function
      this.originalConsoleLog.apply(console, args);
    };

    // Override alert
    window.alert = (message) => {
      this.logs.push({
        type: 'alert',
        timestamp: new Date().toISOString(),
        message: String(message),
      });
      // Call original function
      this.originalAlert(message);
    };
  }

  stopCapturing(): void {
    // Restore original functions
    console.log = this.originalConsoleLog;
    window.alert = this.originalAlert;
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
}
