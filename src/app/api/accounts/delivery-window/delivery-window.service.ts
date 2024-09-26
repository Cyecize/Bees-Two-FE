import { DeliveryWindowRepository } from './delivery-window.repository';
import { Injectable } from '@angular/core';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';
import { DeliveryWindowPayload } from './delivery-window.payload';

@Injectable({ providedIn: 'root' })
export class DeliveryWindowService {
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
