import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2 } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Capacitor } from '@capacitor/core';
import { PrinterService, QueryService } from '@common/core';
import { BehaviorSubject, from, iif, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ServiceService {
  /** Деньги в кассе */
  moneyInKassa: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  /** Состояние смены */
  shiftStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /** состояние ПРРО */
  isOnline$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private http: HTTP,
    private authService: AuthenticationService,
    private queryService: QueryService,
    private printService: PrinterService
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
    return this.queryService
      .post(`${environment.apiUrl}/api/service/servicein`, { sum })
      .pipe(map((m: any) => m.data));
  }

  doCashOut(sum: number): Observable<any> {
    return this.queryService
      .post(`${environment.apiUrl}/api/service/serviceout`, { sum })
      .pipe(map((m: any) => m.data));
  }

  printZReport(render: Renderer2): void {
    this.getLastZReport$()
      .pipe(map((m) => m.data))
      .subscribe((res) => {
        res.data.forEach((str: string) => {
          this.printService.addTextToPrint(render, str);
        });
        this.printService.test_print();
      });
  }

  printLastReceipt(render: Renderer2): void {
    this.getLastReceipt$()
      .pipe(map((m) => m.data))
      .subscribe((res) => {
        this.printService.clearPrintBlank();
        res.data.forEach((str: string) => {
          this.printService.addTextToPrint(render, str);
        });
        if (res.link != null) {
          this.printService.addQrCode(render, res.link);
        }
        this.printService.test_print();
      });
  }

  doZReport$(): Observable<any> {
    return this.queryService.post(
      `${environment.apiUrl}/api/Service/dozreport`,
      {}
    );
  }

  getLastZReport$(): Observable<any> {
    return this.queryService.get(
      `${environment.apiUrl}/api/Service/zreport/last`
    );
  }

  getLastReceipt$(): Observable<any> {
    return this.queryService.get(
      `${environment.apiUrl}/api/Service/receipt/last`
    );
  }

  /**
   * Проверяет состояние смены
   */
  getShiftStatus(): void {
    this.getShiftStatus$().subscribe((res) => {
      this.shiftStatus$.next(res);
    });
  }

  /**
   * Проверяет состояние ПРРО
   */
  getEcrStatus(): void {
    this.getEcrStatus$().subscribe((res) => {
      this.isOnline$.next(res);
    });
  }

  /**
   * Запрос на проверку состояние смены
   * @returns Observable<any>
   */
  private getShiftStatus$(): Observable<boolean> {
    return this.queryService
      .get(`${environment.apiUrl}/api/Service/shiftStatus`)
      .pipe(map((m) => m.data as boolean));
  }

  /**
   * Запрос на проверку состояние ПРРО
   * @returns Observable<any>
   */
  private getEcrStatus$(): Observable<boolean> {
    return this.queryService
      .get(`${environment.apiUrl}/api/ecr/status`)
      .pipe(map((m) => m.data as boolean));
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
    .post(`${environment.apiUrl}/api/service/servicein`, { sum })
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
    .post(`${environment.apiUrl}/api/service/serviceout`, { sum })
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
