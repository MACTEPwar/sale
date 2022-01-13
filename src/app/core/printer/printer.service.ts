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
import { from, iif, Observable, throwError, timer } from 'rxjs';
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
    componentRef!.instance.scale = 1;
    componentRef!.instance.width = 15;
    componentRef!.instance.errorCorrectionLevel = 'H';
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
      switchMap((_) =>
        iif(
          () => _ === true && Capacitor.getPlatform() === 'android',
          this._print$(content, this.options),
          throwError('printer not available or this not android')
        )
      )
    );
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
