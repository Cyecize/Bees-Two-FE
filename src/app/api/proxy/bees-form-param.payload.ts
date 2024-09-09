import { BeesMultipartValuePayload } from './bees-multipart-value.payload';

export interface BeesFormParamPayload {
  name: string;
  value?: number | string | boolean;
  multipartValue?: BeesMultipartValuePayload;
}

export class BeesFormParamPayloadImpl implements BeesFormParamPayload {
  name: string;
  value?: number | string | boolean;

  constructor(name: string, value?: number | string | boolean) {
    this.name = name;
    this.value = value;
  }
}

export class BeesMultipartFormParamPayloadImpl implements BeesFormParamPayload {
  name: string;
  multipartValue?: BeesMultipartValuePayload;

  constructor(name: string, value?: BeesMultipartValuePayload) {
    this.name = name;
    this.multipartValue = value;
  }
}
