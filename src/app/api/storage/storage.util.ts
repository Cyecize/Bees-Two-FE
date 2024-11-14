export class StorageUtil {
  public static sanitizeFileName(filename: string): string {
    return filename.replaceAll(/[\s_=]+/g, '-');
  }
}
