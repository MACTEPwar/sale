import { QueryService } from '@common/core';
import { environment } from 'src/environments/environment';
import { TNullable } from './../../shared/types/types/t-nullabel';
import { TFiscal, TUser } from '@common/types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, iif, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  map,
  tap,
  mergeMap,
  switchMap,
  take,
} from 'rxjs/operators';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Capacitor } from '@capacitor/core';

/**
 * Сервис по управлению авторизацией пользователя
 */
@Injectable()
export class AuthenticationService {
  isAuthinticate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  currentFiscalNumber: BehaviorSubject<number | null> = new BehaviorSubject<
    number | null
  >(null);

  public _currentUser$: BehaviorSubject<TNullable<TUser>> = new BehaviorSubject<
    TNullable<TUser>
  >(null);

  /** Получает текущий пользователя */
  get currentUser(): TNullable<TUser> {
    return this._currentUser$?.getValue() as TNullable<TUser>;
  }

  listFiscals: BehaviorSubject<Array<TFiscal>> = new BehaviorSubject<
    Array<TFiscal>
  >(new Array());

  /** Задает текущего пользователя */
  set currentUser(value: TNullable<TUser>) {
    if (!this._currentUser$) {
      this._currentUser$ = new BehaviorSubject<TNullable<TUser>>(value);
    }
    this._currentUser$.next(value);
  }

  // есть рефреш токен?
  get hasRefreshToken(): boolean {
    return !!(this.currentUser && this.currentUser.refresh_token);
  }

  constructor(
    private httpClient: HttpClient,
    private route: Router,
    private http: HTTP,
    private queryService: QueryService
  ) {
    if (Capacitor.getPlatform() === 'web') {
      this.currentUser = JSON.parse(
        localStorage.getItem('currentUser') as string
      );
    }
  }

  /**
   * Авторизация
   * @param param0 {ися пользователя, пароль}
   * @returns
   */
  login$({
    username,
    password,
    fiscal,
  }: {
    username: string;
    password: string;
    fiscal?: number;
  }): Observable<any> {
    let obj: any = { username, password };

    if (fiscal != null) {
      obj.fiscal = String(fiscal);
    }

    return this.queryService
      .post<TUser>(`${environment.apiUrl}/api/auth/tokenBody`, obj, {})
      .pipe(
        map((m: any) => m.data),
        mergeMap((_: TUser) =>
          this.getUser$(_.access_token!).pipe(
            map((user) => {
              _.name = user?.name;
              _.username = user?.username;
              return _;
            })
          )
        ),
        map((user) => {
          if (Capacitor.getPlatform() === 'web') {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.queryService.authToken = user.access_token!;
          return (this.currentUser = user as TUser);
        }),
        tap((_) => {
          if (fiscal != null) {
            this.currentFiscalNumber.next(fiscal);
          } else {
            this.isAuthinticate.next(true);
          }
        }),
        switchMap((_) =>
          iif(() => fiscal != null, of({}), this.$getFiscalList())
        )
      );
  }

  $getFiscalList(): Observable<any> {
    return this.queryService
      .get(`${environment.apiUrl}/api/Ecr/list`, {
        Authorization: `Bearer ${this.currentUser?.access_token}`,
      })
      .pipe(map((m: any) => m.data));
  }

  /**
   * Вылогин
   */
  logout(): void {
    if (Capacitor.getPlatform() === 'web') {
      localStorage.removeItem('currentUser');
    }
    this.queryService.authToken = null;
    this.currentUser = null;
    this.isAuthinticate.next(false);
    this.currentFiscalNumber.next(null);
    this.route.navigate(['/login']);
  }

  /**
   * Обновление токеноа авторизации по рефреш токену
   */
  loginByRefreshToken$(): Observable<any> {
    const formData: any = new FormData();
    formData.append('refresh_token', this.currentUser?.refresh_token);
    formData.append('grant_type', 'refresh_token');

    return of({}).pipe(
      switchMap((_) =>
        iif(
          () => Capacitor.getPlatform() === 'android',
          getRefresh_ANDROID$(this.http, formData),
          getRefresh_WEB$(this.httpClient, formData)
        )
      ),
      tap((user) => {
        this.currentUser = user;
        if (Capacitor.getPlatform() === 'web') {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  private getUser$(token: string): Observable<any> {
    return this.queryService
      .post(
        `${environment.apiUrl}/api/Auth/info`,
        {},
        {
          Authorization: `Bearer ${this.currentUser?.access_token}`,
        }
      )
      .pipe(map((m: any) => m.data));
  }
}

export function getRefresh_ANDROID$(
  http: HTTP,
  formData: FormData
): Observable<any> {
  http.setDataSerializer('json');

  var object: any = {};
  formData.forEach((value, key) => (object[key] = value));

  return from(
    http.post(`${environment.apiUrl}/api/auth/refreshBody`, object, {
      'Content-Type': 'application/json',
    })
  ).pipe(
    map((m) => JSON.parse(m.data)),
    take(1)
  );
}

export function getRefresh_WEB$(
  http: HttpClient,
  formData: FormData
): Observable<any> {
  return http
    .post<TUser>(`${environment.apiUrl}/api/auth/refresh`, formData)
    .pipe(take(1));
}
