import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, iif, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Capacitor } from '@capacitor/core';

@Injectable()
export class ServiceService {
  moneyInKassa: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(
    private httpClient: HttpClient,
    private http: HTTP,
    private authService: AuthenticationService
  ) {}

  getMoneyInKassa(): void {
    this.getMoneyInKassa$()
      .pipe(
        map((m) => m.data),
        take(1)
      )
      .subscribe((res) => {
        this.moneyInKassa.next(res);
      });
  }

  private getMoneyInKassa$(): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          getMoneyInKassa_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!
          ),
          getMoneyInKassa_WEB$(this.httpClient)
        )
      )
    );
  }

  doCashIn(sum: number): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          doCashIn_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!,
            sum
          ),
          doCashIn_WEB$(this.httpClient, sum)
        )
      )
    );
  }

  doCashOut(sum: number): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          doCashOut_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!,
            sum
          ),
          doCashOut_WEB$(this.httpClient, sum)
        )
      )
    );
  }

  doZReport(): Observable<any> {
    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          doZReport_ANDROID$(
            this.http,
            this.authService.currentUser?.access_token!
          ),
          doZReport_WEB$(this.httpClient)
        )
      )
    );
  }
}

export function getMoneyInKassa_ANDROID$(
  http: HTTP,
  auth: string
): Observable<any> {
  return from(
    http.get(
      `${environment.apiUrl}/api/service/moneyInKassa`,
      {},
      {
        Authorization: `Bearer ${auth}`,
      }
    )
  ).pipe(map((m) => JSON.parse(m.data)));
}

export function getMoneyInKassa_WEB$(http: HttpClient): Observable<any> {
  return http.get(`${environment.apiUrl}/api/service/moneyInKassa`);
}

export function doCashIn_ANDROID$(
  http: HTTP,
  auth: string,
  sum: number
): Observable<any> {
  http.setDataSerializer('json');

  return from(
    http.post(
      `${environment.apiUrl}/api/service/servicein`,
      { sum },
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      }
    )
  ).pipe(map((m) => JSON.parse(m.data), take(1)));
}

export function doCashIn_WEB$(http: HttpClient, sum: number): Observable<any> {
  return http
    .post(`${environment.apiUrl}/api/service/servicein`, sum)
    .pipe(take(1));
}

export function doCashOut_ANDROID$(
  http: HTTP,
  auth: string,
  sum: number
): Observable<any> {
  http.setDataSerializer('json');

  return from(
    http.post(
      `${environment.apiUrl}/api/service/serviceout`,
      { sum },
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      }
    )
  ).pipe(map((m) => JSON.parse(m.data), take(1)));
}

export function doCashOut_WEB$(http: HttpClient, sum: number): Observable<any> {
  return http
    .post(`${environment.apiUrl}/api/service/serviceout`, sum)
    .pipe(take(1));
}

export function doZReport_ANDROID$(http: HTTP, auth: string): Observable<any> {
  http.setDataSerializer('json');

  return from(
    http.post(
      `${environment.apiUrl}/api/service/serviceout`,
      {},
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth}`,
      }
    )
  ).pipe(map((m) => JSON.parse(m.data), take(1)));
}

export function doZReport_WEB$(http: HttpClient): Observable<any> {
  return http
    .post(`${environment.apiUrl}/api/service/serviceout`, {})
    .pipe(take(1));
}
