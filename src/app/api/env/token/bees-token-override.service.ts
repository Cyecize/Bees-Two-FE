import { Injectable } from '@angular/core';
import { BeesToken, BeesTokenImpl } from './bees-token';
import { CountryEnvironmentModel } from '../country-environment.model';
import { STORAGE_BEES_TOKENS_NAME } from '../../../shared/general.constants';

interface BeesTokenMap {
  [key: number]: BeesToken;
}

@Injectable({ providedIn: 'root' })
export class BeesTokenOverrideService {
  public getBeesToken(env: CountryEnvironmentModel): BeesToken | null {
    const data = this.getBeesTokensByEnvId();
    return data[env.id] || null;
  }

  public clearToken(env: CountryEnvironmentModel): void {
    const data = this.getBeesTokensByEnvId();
    delete data[env.id];
    this.saveBeesTokens(data);
  }

  public addToken(token: BeesToken): void {
    const data = this.getBeesTokensByEnvId();
    data[token.envId] = token;
    this.saveBeesTokens(data);
  }

  private getBeesTokensByEnvId(): BeesTokenMap {
    const data = localStorage.getItem(STORAGE_BEES_TOKENS_NAME);
    if (!data) {
      return {};
    }

    const beesTokens: BeesToken[] = JSON.parse(data)
      .map((val: any) => BeesTokenImpl.from(val))
      .filter((val: BeesToken) => !val.isExpired());
    const res: BeesTokenMap = {};

    beesTokens.forEach((token) => {
      res[token.envId] = token;
    });

    return res;
  }

  private saveBeesTokens(data: BeesTokenMap): void {
    const serializedData = Object.values(data).map((token: BeesToken) =>
      token.serialize(),
    );

    localStorage.setItem(
      STORAGE_BEES_TOKENS_NAME,
      JSON.stringify(serializedData),
    );
  }
}
