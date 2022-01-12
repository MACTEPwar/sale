import { TNullable } from '@common/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Capacitor } from '@capacitor/core';
import { MessageService } from 'primeng/api';
import { from, iif, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap, catchError } from 'rxjs/operators';

@Injectable()
export class QueryService {
  // храню токен для android, т к интерсептор не перехватывает
  authToken: TNullable<string> = null;

  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  get<T = any>(
    url: string,
    params: any = {},
    headers: RequestHeaders = {}
  ): Observable<T> {
    return this.sendRequest<T>(EQueryMethod.GET, url, params, headers, 'json');
  }

  post<T = any>(
    url: string,
    body: any,
    headers: RequestHeaders = {},
    type: 'json' | 'multipart' = 'json'
  ): Observable<T> {
    return this.sendRequest<T>(EQueryMethod.POST, url, body, headers, type);
  }

  // import(formData: FormData): Observable<any> {
  //   this.http.setDataSerializer('multipart');

  //   return from(this.http.post(``, formData, {}));
  // }

  private sendRequest<T>(
    method: EQueryMethod,
    url: string,
    body: any,
    headers: RequestHeaders,
    type: 'json' | 'multipart'
  ): Observable<T> {
    return of({}).pipe(
      switchMap((s) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          this.sendRequestAndroid(method, url, body, headers, type),
          this.sendRequestWeb(
            method,
            url,
            method === EQueryMethod.GET ? {} : body,
            method === EQueryMethod.POST ? {} : body,
            headers
          )
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
    headers: RequestHeaders,
    type: 'json' | 'multipart'
  ): Observable<any> {
    let httpHeaders: RequestHeaders = headers;
    if (type === 'json') {
      httpHeaders['Content-Type'] = 'application/json';
    }

    if (this.authToken != null) {
      httpHeaders.Authorization = `Bearer ${this.authToken}`;
    }

    return from(
      this.http.sendRequest(url, {
        method,
        serializer: type,
        data: body,
        headers: httpHeaders,
      })
    ).pipe(
      map((m: any) => {
        // console.log('m', m);
        let result: any = null;
        try {
          result = JSON.parse(m.data) as T;
        } catch {
          result = m.data;
        }
        return result;
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
    params: any,
    headers: RequestHeaders
  ): Observable<any> {
    return this.httpClient.request<T>(method, url, {
      body,
      headers,
      params,
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
