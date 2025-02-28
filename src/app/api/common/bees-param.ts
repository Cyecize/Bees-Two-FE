/**
 * @monaco
 */
export interface BeesParam {
  name: string;
  value: number | string | boolean | null;
}

export class BeesParamImpl implements BeesParam {
  name: string;
  value: number | string | boolean | null;

  constructor(name: string, value?: number | string | boolean | null) {
    this.name = name;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.value = value;
  }
}
