import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ServiceService {
  constructor(private httpClient: HttpClient) {}

  doCashIn(sum: number): Observable<any> {
    return this.httpClient.get(
      `${environment.apiUrl}/api/service/doCashIn/${sum}`
    );
  }

  doCashOut(sum: number): Observable<any> {
    return this.httpClient.get(
      `${environment.apiUrl}/api/service/doCashIn/${sum}`
    );
  }

  doZReport(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}/api/service/doZReport`);
  }
}
