import { Injectable } from '@angular/core';
import JSZip from 'jszip';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from '../http/endpoints';
import { HttpClientSecuredService } from '../http/http-client-secured.service';

@Injectable({ providedIn: 'root' })
export class JszipService {
  constructor(private http: HttpClientSecuredService) {}

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

  public async downloadAndCompress(files: NameAndUrlPair[]): Promise<Blob> {
    const zip = new JSZip();

    const imagePromises = files.map(async (f, index) => {
      let response: HttpResponse<Blob>;

      try {
        response = await firstValueFrom(
          this.http.get(Endpoints.GET_FILE, {
            params: { url: f.url },
            responseType: 'blob',
            observe: 'response',
          }),
        );
      } catch (err) {
        console.warn(
          `Image ${f.name} with URL: ${f.url} failed to return body!`,
        );
        return;
      }

      if (!response.body || !response.ok) {
        console.warn(
          `Image ${f.name} with URL: ${f.url} failed to return body!`,
        );
        return;
      }
      zip.file(
        `${f.name}.${this.getFileExtension(response.headers.get('Content-Type'))}`,
        response.body,
      );
    });

    await Promise.all(imagePromises);

    return await zip.generateAsync({ type: 'blob' });
  }

  private getFileExtension(contentType: string | null): string {
    switch (contentType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      default:
        return 'bin'; // Default to 'bin' if the content type is not recognized
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

export interface NameAndUrlPair {
  url: string;
  name: string;
}

export class NameAndUrlPairImpl implements NameAndUrlPair {
  constructor(
    public url: string,
    public name: string,
  ) {}
}
