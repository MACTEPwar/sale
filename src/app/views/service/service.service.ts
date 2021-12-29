import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class ServiceService {
  moneyInKassa: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private httpClient: HttpClient) {}

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
    return this.httpClient.get(
      `${environment.apiUrl}/api/service/moneyInKassa`
    );
  }

  doCashIn(sum: number): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/service/servicein`, sum)
      .pipe(
        tap((_) => {
          this.getMoneyInKassa();
        }),
        take(1)
      );
  }

  doCashOut(sum: number): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/service/serviceout`, sum)
      .pipe(
        tap((_) => {
          this.getMoneyInKassa();
        }),
        take(1)
      );
  }

  doZReport(): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/api/service/doZReport`, {})
      .pipe(
        tap((_) => {
          this.getMoneyInKassa();
        }),
        take(1)
      );
  }
}
