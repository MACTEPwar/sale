import { QueryService } from '@common/core';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class ConfigService {
  settings: { key: string; value: string }[] = [];

  constructor(private queryService: QueryService) {}

  load(): Observable<any> {
    return forkJoin([this.loadLocales$()]);
  }

  private loadLocales$(): Observable<any> {
    return this.queryService.get('./assets/ua.json').pipe(
      tap((t) => {
        this.settings.push({ key: 'locales', value: JSON.stringify(t) });
      })
    );
  }

  getValue<T = any>(key: string): T | null {
    const val = this.settings.find((i) => i.key === key)?.value;
    return !val ? null : (JSON.parse(val) as T);
  }
}
