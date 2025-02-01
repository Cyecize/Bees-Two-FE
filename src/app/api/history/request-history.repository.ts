import { Injectable } from '@angular/core';
import { HttpClientSecuredService } from '../../shared/http/http-client-secured.service';
import { Observable } from 'rxjs';
import { Page } from '../../shared/util/page';
import { Endpoints } from '../../shared/http/endpoints';
import { RequestHistoryQuery } from './request-history.query';
import { RequestHistory } from './request-history';
import { RouteUtils } from '../../shared/routing/route-utils';

@Injectable({ providedIn: 'root' })
export class RequestHistoryRepository {
  constructor(private http: HttpClientSecuredService) {}

  public search(query: RequestHistoryQuery): Observable<Page<RequestHistory>> {
    return this.http.post<RequestHistoryQuery, Page<RequestHistory>>(
      Endpoints.REQUEST_HISTORY_SEARCH,
      query,
    );
  }

  public getHistory(historyId: number): Observable<RequestHistory> {
    return this.http.get<RequestHistory>(
      RouteUtils.setPathParams(Endpoints.REQUEST_HISTORY, [historyId]),
    );
  }

  public deleteHistory(historyId: number): Observable<void> {
    return this.http.delete<void>(
      RouteUtils.setPathParams(Endpoints.REQUEST_HISTORY, [historyId]),
    );
  }
}
