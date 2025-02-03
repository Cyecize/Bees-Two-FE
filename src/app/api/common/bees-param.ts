export interface BeesParam {
  name: string;
  value: number | string | boolean | null;
}

export class BeesParamImpl implements BeesParam {
  name: string;
  value: number | string | boolean | null;

  constructor(name: string, value?: number | string | boolean | null) {
    this.name = name;
    this.value = value || null;
  }
}
