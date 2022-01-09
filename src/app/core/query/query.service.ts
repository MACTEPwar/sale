import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Capacitor } from '@capacitor/core';
import { MessageService } from 'primeng/api';
import { from, iif, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap, catchError } from 'rxjs/operators';

@Injectable()
export class QueryService {
  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  get<T = any>(url: string, headers: RequestHeaders): Observable<T> {
    return this.sendRequest<T>(EQueryMethod.GET, url, {}, headers);
  }

  post<T = any>(
    url: string,
    body: any,
    headers: RequestHeaders
  ): Observable<T> {
    return this.sendRequest<T>(EQueryMethod.POST, url, body, headers);
  }

  private sendRequest<T>(
    method: EQueryMethod,
    url: string,
    body: any,
    headers: RequestHeaders
  ): Observable<T> {
    return of({}).pipe(
      switchMap((s) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          this.sendRequestAndroid(method, url, body, headers),
          this.sendRequestWeb(method, url, body, headers)
        )
      ),
      tap(
        (s) => {
          // console.log('s', s);
        },
        (e) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Помилка',
            detail: e?.error?.message,
            closable: false,
            life: 0,
          });
        }
      ),
      take(1)
    );
  }
  private sendRequestAndroid<T>(
    method: EQueryMethod,
    url: string,
    body: any,
    headers: RequestHeaders
  ): Observable<any> {
    return from(
      this.http.sendRequest(url, {
        method,
        serializer: 'json',
        data: body,
        headers,
      })
    ).pipe(
      map((m: any) => {
        // console.log('m', m);
        return JSON.parse(m.data) as T;
      }),
      catchError((_) => {
        // console.log(_);
        _.error = JSON.parse(_.error);
        return throwError(_);
      })
    );
  }

  private sendRequestWeb<T>(
    method: EQueryMethod,
    url: string,
    body: any,
    headers: RequestHeaders
  ): Observable<any> {
    return this.httpClient.request<T>(method, url, {
      body,
      headers,
    });
  }
}

export enum EQueryMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export type RequestHeaders = {
  [index: string]: string;
};
