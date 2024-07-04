import { QueryService } from '@common/core';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import config from '../../../../capacitor.config';
import { environment } from 'src/environments/environment';
@Injectable()
export class ConfigService {
  settings: { key: string; value: string }[] = [];

  constructor(private queryService: QueryService) {}

  load(): Observable<any> {
    return forkJoin([this.loadLocales$()]);
  }

  private loadLocales$(): Observable<any> {
    // return this.queryService.get('./assets/ua.json').pipe(
    // return this.queryService.get(`http://127.0.0.1:4200/assets/ua.json`).pipe(
    // return this.queryService.get(`http://192.168.14.26:4200/assets/ua.json`).pipe(
    return this.queryService.get(`assets/ua.json`).pipe(
      tap(
        (t) => {
          this.settings.push({ key: 'locales', value: JSON.stringify(t) });
          alert('locale load');
          alert(config.server?.url)
        },
        (err) => {
          alert('error load locale');
          alert(JSON.stringify(err, null, 4));
        }
      )
    );
  }

  getValue<T = any>(key: string): T | null {
    const val = this.settings.find((i) => i.key === key)?.value;
    return !val ? null : (JSON.parse(val) as T);
  }
}
