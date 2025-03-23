import { Injectable } from '@angular/core';
import { VendorV2Repository } from './vendor-v2.repository';
import { CountryEnvironmentModel } from '../env/country-environment.model';
import { VendorV2 } from './vendor-v2';
import { VendorV2Query, VendorV2QueryImpl } from './vendor-v2.query';
import { FieldErrorWrapper } from '../../shared/util/field-error-wrapper';

/**
 * @monaco
 */
export interface IVendorV2Service {
  findById(
    vendorId: string,
    env: CountryEnvironmentModel,
  ): Promise<VendorV2 | null>;
}

@Injectable({ providedIn: 'root' })
export class VendorV2Service implements IVendorV2Service {
  constructor(private repository: VendorV2Repository) {}

  async findById(
    vendorId: string,
    env: CountryEnvironmentModel,
    countryCodes?: string[],
  ): Promise<VendorV2 | null> {
    const query: VendorV2Query = new VendorV2QueryImpl();

    if (countryCodes?.length) {
      query.countries.push(...countryCodes);
    } else {
      query.countries.push(env.countryCode);
    }

    query.vendorId.push(vendorId);

    const result = await new FieldErrorWrapper(() =>
      this.repository.searchVendors(query, env.id),
    ).execute();

    if (!result.isSuccess) {
      console.log(result);
      return null;
    }

    const vendors = result.response.response.content;

    if (!vendors.length) {
      return null;
    }

    return vendors[0];
  }
}
