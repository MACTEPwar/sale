import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';

@Injectable()
export class ServiceMockService {
  constructor(private httpClient: HttpClient) {}

  doCashIn(sum: number): Observable<any> {
    return this.waitTime(2000);
  }

  doCashOut(sum: number): Observable<any> {
    return this.waitTime(2000);
  }

  doZReport(): Observable<any> {
    return this.waitTime(2000);
  }

  private waitTime(time: number): Observable<any> {
    return timer(time);
  }
}
