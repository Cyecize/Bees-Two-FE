import { Injectable } from '@angular/core';
import JSZip from 'jszip';

@Injectable({ providedIn: 'root' })
export class JszipService {
  public async getFileNames(file: File): Promise<string[]> {
    const names: string[] = [];

    await this.iterate(file, async (relativePath) => {
      names.push(relativePath);
    });

    return names;
  }

  public async iterate(
    file: File,
    callback: (relativePath: string, file: JSZip.JSZipObject) => Promise<void>,
  ): Promise<void> {
    const zip = new JSZip();

    const arrayBuffer = await this.readFileAsArrayBuffer(file);
    const contents = await zip.loadAsync(arrayBuffer);

    const files: { relativePath: string; file: JSZip.JSZipObject }[] = [];
    contents.forEach((relativePath, file) => {
      files.push({
        relativePath,
        file,
      });
    });

    for (const f of files) {
      await callback(f.relativePath, f.file);
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Error reading file.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file.'));
      };

      reader.readAsArrayBuffer(file);
    });
  }
}
