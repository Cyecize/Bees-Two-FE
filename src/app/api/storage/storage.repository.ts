import { Injectable } from '@angular/core';
import { ProxyService } from '../proxy/proxy.service';
import { BeesParamImpl } from '../common/bees-param';
import { BeesMultipartValuePayload } from '../proxy/bees-multipart-value.payload';
import { Observable } from 'rxjs';
import { BeesResponse } from '../proxy/bees-response';
import { Endpoints } from '../../shared/http/endpoints';
import { BeesEntity } from '../common/bees-entity';
import { RequestMethod } from '../common/request-method';
import { MultipartBeesFormDataPayload } from '../proxy/bees-form-data.payload';
import { BeesMultipartFormParamPayloadImpl } from '../proxy/bees-form-param.payload';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { BeesStorageResponse } from './dto/bees-storage.response';
import { CmsStorageResponse } from './dto/cms-storage.response';

@Injectable({ providedIn: 'root' })
export class StorageRepository {
  constructor(private proxyService: ProxyService) {}

  public postToBeesStorage(
    multipartFile: BeesMultipartValuePayload,
    env: CountryEnvironmentModel,
  ): Observable<BeesResponse<BeesStorageResponse>> {
    return this.proxyService.makeRequest<BeesStorageResponse>({
      endpoint: Endpoints.FILES_UPLOAD,
      entity: BeesEntity.BEES_STORAGE,
      method: RequestMethod.POST,
      targetEnv: env.id,
      headers: [
        new BeesParamImpl('Accept', 'application/json'),
        new BeesParamImpl(
          'purpose',
          `${env.countryCode}-images-vendor-${env.vendorId}`,
        ),
        new BeesParamImpl('linkExpirationTime', -1),
        new BeesParamImpl('title', multipartFile.fileName),
      ],
      formData: new MultipartBeesFormDataPayload([
        new BeesMultipartFormParamPayloadImpl('file', multipartFile),
      ]),
    });
  }

  public postToCmsStorage(
    multipartFile: BeesMultipartValuePayload,
    envId?: number,
  ): Observable<BeesResponse<CmsStorageResponse>> {
    return this.proxyService.makeRequest<CmsStorageResponse>({
      endpoint: Endpoints.CMS_FILES_UPLOAD,
      entity: BeesEntity.CMS_STORAGE,
      method: RequestMethod.POST,
      targetEnv: envId,
      headers: [new BeesParamImpl('Accept', 'application/json')],
      formData: new MultipartBeesFormDataPayload([
        new BeesMultipartFormParamPayloadImpl('File', multipartFile),
      ]),
    });
  }
}
