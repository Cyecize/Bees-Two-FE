import { DeliveryWindowRepository } from './delivery-window.repository';
import { Injectable } from '@angular/core';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';
import { DeliveryWindowPayload } from './delivery-window.payload';

/**
 * @monaco
 */
export interface IDeliveryWindowService {
  createDeliveryWindow(
    payload: DeliveryWindowPayload,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>>;
}

@Injectable({ providedIn: 'root' })
export class DeliveryWindowService implements IDeliveryWindowService {
  constructor(private deliveryWindowRepository: DeliveryWindowRepository) {}

  public async createDeliveryWindow(
    payload: DeliveryWindowPayload,
    env?: CountryEnvironmentModel,
  ): Promise<WrappedResponse<any>> {
    return await new FieldErrorWrapper(() =>
      this.deliveryWindowRepository.createDeliveryWindow(payload, env?.id),
    ).execute();
  }
}
