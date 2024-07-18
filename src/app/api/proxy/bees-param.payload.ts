export interface BeesParamPayload {
  name: string;
  value?: number | string;
}

export class BeesParamPayloadImpl implements BeesParamPayload {
  name: string;
  value?: number | string;

  constructor(name: string, value?: number | string) {
    this.name = name;
    this.value = value;
  }
}
