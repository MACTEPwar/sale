import { Injectable } from '@angular/core';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { from, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable()
export class PrinterService {
  options: PrintOptions = {
    name: 'MyDocument',
    duplex: false,
    orientation: 'portrait',
    monochrome: true,
    margin: false,
    autoFit: false,
    font: {
      name: 'Noto Mono',
      size: 8,
      italic: false,
      bold: false,
      align: 'left',
      color: '#000000',
    },
  };

  constructor(private printer: Printer) {}

  print(content: string | HTMLElement): Observable<any> {
    return this._isAvailable$();
    // return from();
    // this.printer
    //   .isAvailable()
    //   .then((p) => {
    //     alert('availible');
    //     this.printer.print(content, this.options).then(
    //       (s) => alert('success'),
    //       (e) => alert(JSON.stringify(e, null, 4))
    //     );
    //   })
    //   .catch((e) => alert(JSON.stringify(e, null, 4)));
  }

  private _isAvailable$(): Observable<any> {
    return from(this.printer.isAvailable()).pipe(take(1));
  }

  private _print$(
    content?: string | HTMLElement | undefined,
    options?: PrintOptions | undefined
  ): Observable<any> {
    return from(this.printer.print(content, options)).pipe(take(1));
  }
}
