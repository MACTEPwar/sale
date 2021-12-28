import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ServiceService {
  moneyInKassa: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private httpClient: HttpClient) {}

  getMoneyInKassa(): void {
    this.getMoneyInKassa$()
      .pipe(map((m) => m.data))
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
    return this.httpClient.post(
      `${environment.apiUrl}/api/service/servicein`,
      sum
    );
  }

  doCashOut(sum: number): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/api/service/serviceout`,
      sum
    );
  }

  doZReport(): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/api/service/doZReport`,
      {}
    );
  }
}
