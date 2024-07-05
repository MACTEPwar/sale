import { QueryService } from '@common/core';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import config from '../../../../capacitor.config';
import { environment } from 'src/environments/environment';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ConfigService {
  settings: { key: string; value: string }[] = [];

  constructor(
    private queryService: QueryService,
    private httpClient: HttpClient
  ) {}

  load(): Observable<any> {
    return forkJoin([this.loadLocales$()]);
  }

  private loadLocales$(): Observable<any> {
    // return this.queryService.get('./assets/ua.json').pipe(
    // return this.queryService.get(`http://127.0.0.1:4200/assets/ua.json`).pipe(
    // return this.queryService.get(`http://192.168.14.26:4200/assets/ua.json`).pipe(
    // return this.queryService.get(`assets/ua.json`).pipe(
    // return this.queryService.getFile$('assets/ua.json').pipe(
    return this.httpClient.get('assets/ua.json').pipe(
      tap(
        (t) => {
          // from(this.getFileUrl('assets/ua.json')).subscribe((res) => {
          //   alert(res);
          // });
          this.settings.push({ key: 'locales', value: JSON.stringify(t) });
          // alert('locale load');
          // alert(config.server?.url);
          // alert(JSON.stringify(t, null, 4));
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

  private async getFileUrl(path: string): Promise<string> {
    const fileUri = await Filesystem.getUri({
      directory: Directory.Documents,
      path: path,
    });
    return fileUri.uri;
  }
}
