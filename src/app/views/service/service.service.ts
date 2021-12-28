import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ServiceService {
  constructor(private httpClient: HttpClient) {}

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
