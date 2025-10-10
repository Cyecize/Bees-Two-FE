import { Injectable } from '@angular/core';
import JSZip, { JSZipObjectOptions, OnUpdateCallback, OutputType } from 'jszip';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from '../http/endpoints';
import { HttpClientSecuredService } from '../http/http-client-secured.service';

/**
 * @monaco
 * @monaco_include_deps
 */
export interface JSZipObjectMonaco {
  name: string;
  unsafeOriginalName?: string;
  dir: boolean;
  date: Date;
  comment: string;
  unixPermissions: number | string | null;
  dosPermissions: number | null;
  options: JSZipObjectOptions;
  async<T extends OutputType>(
    type: T,
    onUpdate?: OnUpdateCallback,
  ): Promise<OutputByType[T]>;
  nodeStream(
    type?: 'nodebuffer',
    onUpdate?: OnUpdateCallback,
  ): NodeJS.ReadableStream;
}

interface OutputByType {
  base64: string;
  string: string;
  text: string;
  binarystring: string;
  array: number[];
  uint8array: Uint8Array;
  arraybuffer: ArrayBuffer;
  blob: Blob;
  nodebuffer: Buffer;
}

/**
 * @monaco
 */
export interface IJszipService {
  getFileNames(file: File): Promise<string[]>;

  iterate(
    file: File,
    callback: (relativePath: string, file: JSZipObjectMonaco) => Promise<void>,
  ): Promise<void>;

  getTextContent(file: JSZipObjectMonaco): Promise<string>;
}

@Injectable({ providedIn: 'root' })
export class JszipService implements IJszipService {
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

  public async getTextContent(file: JSZip.JSZipObject): Promise<string> {
    const arrayBuffer = await file.async('arraybuffer');
    const view = new Uint8Array(arrayBuffer);

    if (view.length >= 2 && view[0] === 0xff && view[1] === 0xfe) {
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      return new TextDecoder('utf-16le').decode(arrayBuffer);
    }

    if (view.length >= 2 && view[0] === 0xfe && view[1] === 0xff) {
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      return new TextDecoder('utf-16be').decode(arrayBuffer);
    }

    if (
      view.length >= 3 &&
      view[0] === 0xef &&
      view[1] === 0xbb &&
      view[2] === 0xbf
    ) {
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      return new TextDecoder('utf-8').decode(arrayBuffer.slice(3));
    }

    // Default to UTF-8
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    return new TextDecoder('utf-8').decode(arrayBuffer);
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
