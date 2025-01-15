export class ArrayUtils {
  public static splitToBatches(items: string[], size: number): string[][] {
    const result: string[][] = [];

    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }

    return result;
  }
}
