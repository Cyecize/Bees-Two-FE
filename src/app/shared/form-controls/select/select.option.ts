export interface SelectOption {
  key: string;
  value: string | number | null;
}

export class SelectOptionKey implements SelectOption {
  key: string;
  value: string | number | null;
  constructor(keyAndValue: string | number) {
    this.key = keyAndValue + '';
    this.value = keyAndValue;
  }
}

export class SelectOptionKvp implements SelectOption {
  constructor(
    public key: string,
    public value: string | number | null,
  ) {}
}
