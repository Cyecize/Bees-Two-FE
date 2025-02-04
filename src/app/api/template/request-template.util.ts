export class RequestTemplateUtil {
  public static encodePayload(payload: string | null): string | null {
    if (!payload) {
      return null;
    }

    return payload.replace(/{/g, "%%'{'%%").replace(/}/g, "%%'}'%%");
  }

  public static decodePayload(payload: string | null): string | null {
    if (!payload) {
      return null;
    }

    return payload.replace(/{/g, "[['{']]").replace(/}/g, "[['}']]");
  }
}
