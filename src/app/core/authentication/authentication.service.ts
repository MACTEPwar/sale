import { environment } from 'src/environments/environment';
import { TNullable } from './../../shared/types/types/t-nullabel';
import { TFiscal, TUser } from '@common/types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, iif, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, mergeMap, switchMap } from 'rxjs/operators';

/**
 * Сервис по управлению авторизацией пользователя
 */
@Injectable()
export class AuthenticationService {
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

  constructor(private http: HttpClient, private route: Router) {
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') as string
    );
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
    const formData: any = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    if (fiscal != null) {
      formData.append('fiscal', fiscal);
    }

    return this.http
      .post<TUser>(`${environment.apiUrl}/api/auth/token`, formData)
      .pipe(
        mergeMap((_: TUser) =>
          this.getUser(_.access_token!).pipe(
            map((user) => {
              _.name = user.name;
              _.username = user.username;
              return _;
            })
          )
        ),
        map((user) => {
          localStorage.setItem('currentUser', JSON.stringify(user));

          return (this.currentUser = user as TUser);
        }),
        switchMap((_) =>
          iif(() => fiscal != null, of({}), this.$getFiscalList())
        )
        // switchMap((_) => )
      );
  }

  $getFiscalList(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/api/Ecr/list`)
      .pipe(map((m: any) => m.data));
  }

  /**
   * Вылогин
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.route.navigate(['/login']);
  }

  /**
   * Обновление токеноа авторизации по рефреш токену
   */
  loginByRefreshToken$(): Observable<any> {
    const formData: any = new FormData();
    formData.append('refresh_token', this.currentUser?.refresh_token);
    formData.append('grant_type', 'refresh_token');

    return this.http
      .post<TUser>(`${environment.apiUrl}/api/auth/refresh`, formData)
      .pipe(
        tap((user) => {
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  private getUser(token: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/api/Auth/info`, {})
      .pipe(map((m: any) => m.data));
  }
}
