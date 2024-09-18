import {
  LocalPageRequest,
  LocalPageRequestImpl,
} from '../../shared/util/page-request';
import {
  CountryEnvironmentQuery,
  CountryEnvironmentQueryImpl,
} from './country-environment.query';

export interface CountryCodeQuery {
  page: LocalPageRequest;
  countryCode?: string;
  query: CountryEnvironmentQuery;
}

export class CountryCodeQueryImpl implements CountryCodeQuery {
  page: LocalPageRequest = new LocalPageRequestImpl(0, 100);
  countryCode?: string;
  query: CountryEnvironmentQuery = new CountryEnvironmentQueryImpl();

  constructor(query?: CountryEnvironmentQuery) {
    if (query) {
      this.query = query;
    }
  }
}
