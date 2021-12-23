import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from './../authentication/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.endsWith('auth/refresh')) {
      // Если запрос на обновление токена авторизации по рефреш токену, то выполнить его
      return next.handle(request);
    }

    return next
      .handle(
        request.clone({
          setHeaders: this.generateHeader(),
        })
      )
      .pipe(
        catchError((err) => {
          // если ошибка авторизации
          if (err.status === 401) {
            return this.handle401Error(request, next);
          }
          // Другая ошибка запроса
          else {
            return throwError(err);
          }
        })
      );
  }

  /**
   * Хэндлер для ответов со статусом 401
   * @param request Запрос
   * @param next Хандлер
   */
  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    // Проверяю наличие рефреш токена
    if (this.authenticationService.hasRefreshToken) {
      return this.authenticationService.loginByRefreshToken$().pipe(
        catchError((error) => {
          this.authenticationService.logout();
          return EMPTY;
        }),
        mergeMap((m) =>
          // Повторная отправка запроса с обновленным токеном
          next.handle(request.clone({ setHeaders: this.generateHeader() }))
        )
      );
    } else {
      // Рефреш токена нет
      this.authenticationService.logout();
      return EMPTY;
    }
  }

  /**
   * Генерирует хедеры для запроса
   */
  private generateHeader(): {
    [name: string]: string | string[];
  } {
    const headers: { [name: string]: string | string[] } = {
      'Accept-Language': 'uk',
    };

    if (this.authenticationService.currentUser?.access_token) {
      headers.Authorization = `Bearer ${this.authenticationService.currentUser.access_token}`;
    }

    return headers;
  }
}
