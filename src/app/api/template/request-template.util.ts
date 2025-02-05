export class RequestTemplateUtil {
  public static encodePayload(payload: string | null): string | null {
    if (!payload) {
      return null;
    }

    return payload
      .replace(/{/g, "[['{']]")
      .replace(/}/g, "[['}']]")
      .replace(/@/g, "[['@']]");
  }
}
