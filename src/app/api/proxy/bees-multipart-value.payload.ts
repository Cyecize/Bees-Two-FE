export interface BeesMultipartValuePayload {
  mediaType?: string;
  fileName?: string;
  base64: string;
}

export class BeesMultipartFile implements BeesMultipartValuePayload {
  constructor(
    public mediaType: string,
    public fileName: string,
    public base64: string,
  ) {}
}
