import { Injectable } from '@angular/core';
import { BeesMultipartFile } from '../proxy/bees-multipart-value.payload';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../shared/util/field-error-wrapper';
import { StorageRepository } from './storage.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { BeesStorageResponse } from './dto/bees-storage.response';
import { StorageUtil } from './storage.util';
import { CmsStorageResponse } from './dto/cms-storage.response';
import { map } from 'rxjs/operators';
import { Env } from '../env/env';
import { StorageType } from './storage.type';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private storageRepository: StorageRepository) {}

  public async uploadToBeesStorage(
    multipartFile: BeesMultipartFile,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<BeesStorageResponse>> {
    multipartFile.fileName = StorageUtil.sanitizeFileName(
      multipartFile.fileName,
    );
    return await new FieldErrorWrapper(() =>
      this.storageRepository.postToBeesStorage(multipartFile, env),
    ).execute();
  }

  public async uploadToCmsStorage(
    multipartFile: BeesMultipartFile,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<CmsStorageResponse>> {
    multipartFile.fileName = StorageUtil.sanitizeFileName(
      multipartFile.fileName,
    );
    return await new FieldErrorWrapper(() =>
      this.storageRepository.postToCmsStorage(multipartFile, env.id).pipe(
        map((value) => {
          if (!value?.response?.message) {
            return value;
          }

          switch (env.env) {
            case Env.PROD:
            case Env.PROD_EU:
            case Env.PROD_US:
              value.response.finalUrl = value.response.prod;
              break;
            case Env.UAT:
            case Env.UAT_EU:
            case Env.UAT_US:
              value.response.finalUrl = value.response.uat;
              break;
            case Env.SIT_GLOBAL:
              value.response.finalUrl = value.response.sit;
              break;
            default:
              alert(`CMS does not support env ${env.env}!`);
              throw new Error(`Not implemented, missing env ${env.env}`);
          }

          return value;
        }),
      ),
    ).execute();
  }

  public async upload(
    storageType: StorageType,
    multipartFile: BeesMultipartFile,
    env: CountryEnvironmentModel,
  ): Promise<string | null> {
    let url;

    if (storageType === StorageType.BEES_STORAGE) {
      const res = await this.uploadToBeesStorage(multipartFile, env);
      if (!res.isSuccess) {
        console.error(res);
        return null;
      }

      url = res.response.response.url;
    } else if (storageType === StorageType.BEES_CMS) {
      const res = await this.uploadToCmsStorage(multipartFile, env);
      if (!res.isSuccess) {
        console.error(res);
        return null;
      }

      url = res.response.response.finalUrl;
    } else {
      alert(`${storageType} is not supported!`);
      throw new Error(`${storageType} is not supported!`);
    }

    return url;
  }
}
