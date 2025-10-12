/**
 * @monaco
 */
export interface IFileUtils {
  downloadCsv(csvContent: string, fileName: string): void;
  readFileAsString(file: Blob): Promise<string>;
  downloadFile(fileName: string, content: Blob): void;
}

export class FileUtils implements IFileUtils {
  public downloadCsv(csvContent: string, fileName: string): void {
    FileUtils.downloadCsv(csvContent, fileName);
  }

  public static downloadCsv(csvContent: string, fileName: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  public async readFileAsString(file: Blob): Promise<string> {
    return await FileUtils.readFileAsString(file);
  }

  public static readFileAsString(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Error reading file.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file.'));
      };

      reader.readAsText(file!);
    });
  }

  public downloadFile(fileName: string, content: Blob): void {
    FileUtils.downloadFile(fileName, content);
  }

  public static downloadFile(fileName: string, content: Blob): void {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(content);

    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
