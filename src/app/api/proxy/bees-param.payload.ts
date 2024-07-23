export interface BeesParamPayload {
  name: string;
  value?: number | string | boolean;
}

export class BeesParamPayloadImpl implements BeesParamPayload {
  name: string;
  value?: number | string | boolean;

  constructor(name: string, value?: number | string | boolean) {
    this.name = name;
    this.value = value;
  }
}
