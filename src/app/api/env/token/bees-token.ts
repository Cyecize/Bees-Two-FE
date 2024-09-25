export interface BeesToken {
  token: string;
  expires: Date;
  envId: number;

  serialize(): any;
  isExpired(): boolean;
}

export class BeesTokenImpl implements BeesToken {
  constructor(
    public token: string,
    public expires: Date,
    public envId: number,
  ) {}

  serialize(): any {
    return {
      token: this.token,
      expires: this.expires.getTime(),
      envId: this.envId,
    };
  }

  isExpired(): boolean {
    return new Date().getTime() >= this.expires.getTime();
  }

  public static from(jsonObj: any): BeesToken {
    if (!jsonObj.token || !jsonObj.expires || !jsonObj.envId) {
      throw new Error('Could not create BeesToken from this object!', jsonObj);
    }

    return new BeesTokenImpl(
      jsonObj.token + '',
      new Date(jsonObj.expires),
      jsonObj.envId,
    );
  }
}
