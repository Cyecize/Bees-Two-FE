export interface BeesParam {
  name: string;
  value?: number | string | boolean;
}

export class BeesParamImpl implements BeesParam {
  name: string;
  value?: number | string | boolean;

  constructor(name: string, value?: number | string | boolean) {
    this.name = name;
    this.value = value;
  }
}
