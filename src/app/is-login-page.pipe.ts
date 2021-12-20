import { Pipe, PipeTransform } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { iif, Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Pipe({
  name: 'isLoginPage',
})
export class IsLoginPagePipe implements PipeTransform {
  transform(router: Router): Observable<any> {
    return router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      switchMap((_: any) => {
        if (_.url === '/' || _.url === '/login') {
          return of(true);
        } else {
          return of(false);
        }
      })
    );
  }
}
