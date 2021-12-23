import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iif, Observable, of, throwError } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // Отбираю только ответы
      filter((f: any) => f.type === 4),
      // Есди в ответе есть свойство errors, то ошибка
      mergeMap((response: HttpResponse<any>) => {
        return of(response);
        // return iif(
        //   () =>
        //     response.body.hasOwnProperty('errors') &&
        //     Array.isArray(response.body.errors),
        //   throwError(() => {
        //     if (response?.body?.errors[0]?.message) {
        //       return response.body.errors[0].message;
        //     } else {
        //       ('');
        //     }
        //   }),
        //   of(response)
        // );
      })
    );
  }
}
