import {
  ComponentFactoryResolver,
  Injectable,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { Capacitor } from '@capacitor/core';
import { TNullable } from '@common/types';
import { QRCodeComponent } from 'angularx-qrcode';
import { from, iif, Observable, of, throwError, timer } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable()
export class PrinterService {
  private _container: TNullable<ViewContainerRef> = null;
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

  constructor(
    private printer: Printer,
    private cfr: ComponentFactoryResolver
  ) {}

  addTextToPrint(renderer: Renderer2, str: string): this {
    str = str.replace('І', 'I');
    str = str.replace('і', 'i');
    const text = renderer.createText(str.replace(/ /g, ' '));
    // const text = renderer.createText(
    //   str.replace(/ /g, String.fromCharCode(160))
    // );
    const child = renderer.createElement('p');

    renderer.appendChild(child, text);
    renderer.appendChild(this._container?.element.nativeElement, child);

    renderer.setStyle(child, 'margin-top', '4px');
    renderer.setStyle(child, 'margin-bottom', '4px');
    return this;
  }

  addQrCode(renderer: Renderer2, str: string): this {
    const factory = this.cfr.resolveComponentFactory(QRCodeComponent);
    const componentRef = this._container?.createComponent(factory);
    renderer.appendChild(
      this._container?.element.nativeElement,
      componentRef?.location.nativeElement
    );
    componentRef!.instance.elementType = 'img';
    componentRef!.instance.qrdata = str;
    componentRef!.instance.scale = 4;
    // componentRef!.instance.width = 15;
    // componentRef!.instance.errorCorrectionLevel = 'H';
    (componentRef!.instance as any).createQRCode();
    componentRef?.changeDetectorRef.detectChanges();
    return this;
  }

  clearPrintBlank(): this {
    this._container!.element.nativeElement.innerHTML = '';
    return this;
  }

  registerViewContainer(container: ViewContainerRef): void {
    this._container = container;
  }

  test_print(): void {
    timer(500)
      .pipe(
        switchMap((_) =>
          this.print(this._container?.element.nativeElement.outerHTML)
        )
      )
      .subscribe((res) => {});
  }

  print(content: string | HTMLElement): Observable<any> {
    return this._isAvailable$().pipe(
      switchMap((_) => {
        if (_ === true) {
          switch (Capacitor.getPlatform()) {
            case 'android': {
              return this._print$(content, this.options);
            }
            case 'web': {
              return this._print_web$(content, this.options);
            }
            default: {
              return throwError('not available type');
            }
          }
        } else {
          return throwError('printer not available');
        }
      })
    );
  }

  private _isAvailable$(): Observable<any> {
    if (Capacitor.getPlatform() === 'android') {
      return from(this.printer.isAvailable()).pipe(take(1));
    } else {
      return of(true);
    }
  }

  private _print$(
    content?: string | HTMLElement | undefined,
    options?: PrintOptions | undefined
  ): Observable<any> {
    return from(this.printer.print(content, options)).pipe(take(1));
  }

  private _print_web2$(
    content?: string | HTMLElement | undefined,
    options?: PrintOptions | undefined
  ): Observable<any> {
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (typeof content === 'string') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      content = tempDiv;
    }

    setTimeout(() => {
      
    }, 1000);

    printWindow!.document.write(`
    <html>
      <head>
      </head>
      <body>
        ${content!.outerHTML}
      </body>
    </html>
  `);

    printWindow!.document.close();

    printWindow!.onload = () => {
      printWindow!.focus();
      printWindow!.print();
      printWindow!.close();
    };

    return of(true);
  }

  private _print_web$(
    content?: string | HTMLElement,
    options?: PrintOptions
  ): Observable<boolean> {
    return new Observable(observer => {
      if (!content) {
        observer.error(new Error('Content is undefined or null'));
        return;
      }
  
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        observer.error(new Error('Unable to open print window'));
        return;
      }
  
      if (typeof content === 'string') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        content = tempDiv;
      }
  
      printWindow.document.write(`
        <html>
          <head>
          </head>
          <body>
            ${content.outerHTML}
          </body>
        </html>
      `);

      
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        observer.next(true);
        observer.complete();
      };
  
      printWindow.document.close();
  
    });
  }
}
