import { Injectable } from '@angular/core';
import { BeesContractRepository } from './bees-contract.repository';
import { CountryEnvironmentModel } from '../../env/country-environment.model';
import {
  FieldErrorWrapper,
  WrappedResponse,
} from '../../../shared/util/field-error-wrapper';
import { PageWithPagination } from '../../../shared/util/page';
import { BeesContract } from './bees-contract';
import {
  BeesContractQuery,
  BeesContractQueryImpl,
} from './bees-contract.query';

/**
 * @monaco
 */
interface IBeesContractService {
  findTopByDdc(
    maxResults: number,
    ddc: string,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<PageWithPagination<BeesContract>>>;
}

@Injectable({ providedIn: 'root' })
export class BeesContractService implements IBeesContractService {
  constructor(private repository: BeesContractRepository) {}

  public async findTopByDdc(
    maxResults: number,
    ddc: string,
    env: CountryEnvironmentModel,
  ): Promise<WrappedResponse<PageWithPagination<BeesContract>>> {
    const query: BeesContractQuery = new BeesContractQueryImpl();
    query.deliveryCenterId.push(ddc);
    query.vendorId.push(env.vendorId);
    query.page.pageSize = maxResults;

    return await new FieldErrorWrapper(() =>
      this.repository.searchContracts(query, env.id),
    ).execute();
  }
}
