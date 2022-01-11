import { PrinterService } from '@common/core';
import { TUser } from './shared/types/types/t-user';
import { TNullable } from './shared/types/types/t-nullabel';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import {
  Component,
  ViewChild,
  ViewContainerRef,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ServiceService } from './views/service/service.service';
import { Observable } from 'rxjs';
import { ServiceComponent } from './views/service/service.component';
import { SaleService } from './core/BLL/sale-logic/sale.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ServiceService, ConfirmationService],
})
export class AppComponent {
  title = 'sale';
  items: MenuItem[] = [];
  currentUser: Observable<TNullable<TUser>>;
  confirmText: number | null = null;
  visibleConfirmDialog = false;
  confirmOperation: 'cashIn' | 'cashOut' | null = null;

  @ViewChild('printContainer', { read: ViewContainerRef })
  printContainerDOM: any;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private serviceComponent: ServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private printerService: PrinterService,
    private renderer: Renderer2
  ) {
    this.currentUser = this.authenticationService._currentUser$;
  }

  ngOnInit(): void {
    this.items = [
      { routerLink: '/test', label: 'Test' },
      { routerLink: '/sale', label: 'Продаж' },
      { routerLink: '/return', label: 'Повернення' },
      {
        label: 'Звiти',
        items: [
          { routerLink: '/report/receipts', label: 'Чеки' },
          { routerLink: '/report/z-reports', label: 'Z-звiти' },
        ],
      },
      {
        label: 'Сервiси',
        items: [
          {
            label: 'Внесення',
            command: () => this.doCashIn(),
          },
          {
            label: 'Вилучення',
            command: () => this.doCashOut(),
          },
          { label: 'Z-звiт', command: () => this.doZReport() },
        ],
      },
    ];
  }

  ngAfterViewInit(): void {
    console.log(this.printContainerDOM);
    this.printerService.registerViewContainer(this.printContainerDOM!);
    // this.printerService.addTextToPrint(this.renderer, 'Hello world !!!');
    // this.printerService.addTextToPrint(this.renderer, 'string 1');
    // this.printerService.clearPrintBlank();
    // this.printerService.addTextToPrint(this.renderer, 'string 2');
    // this.printerService.addQrCode(this.renderer,'test');
    // this.printerService.test_print();
  }

  doCashIn(): void {
    this.confirmOperation = 'cashIn';
    this.visibleConfirmDialog = true;
  }

  doCashOut(): void {
    this.confirmOperation = 'cashOut';
    this.visibleConfirmDialog = true;
  }

  doZReport(): void {
    this.serviceComponent
      .doZReport$()
      .pipe(map((m) => m.data))
      .subscribe((res) => {
        this.confirmationService.confirm({
          message: 'Z-звiт зроблено. Роздрукувати?',
          acceptLabel: 'Так',
          rejectLabel: 'Нi',
          header: 'Iнфо',
          accept: () => {
            this.serviceComponent.printZReport(this.renderer);
          },
        });
      });
  }

  logout(): void {
    this.authenticationService.logout();
  }

  confirm(state: boolean): void {
    switch (this.confirmOperation) {
      case 'cashIn': {
        if (state === true && this.confirmText != null) {
          this.serviceComponent.doCashIn(+this.confirmText).subscribe((res) => {
            this.serviceComponent.getMoneyInKassa();
            this.visibleConfirmDialog = false;
            this.confirmText = null;
            this.messageService.add({
              severity: 'info',
              summary: 'Iнфо',
              detail: 'Виконано внесення',
            });
          });
        } else {
          this.visibleConfirmDialog = false;
        }
        break;
      }
      case 'cashOut': {
        if (state === true && this.confirmText != null) {
          this.serviceComponent
            .doCashOut(+this.confirmText)
            .subscribe((res) => {
              this.serviceComponent.getMoneyInKassa();
              this.confirmText = null;
              this.visibleConfirmDialog = false;
              this.messageService.add({
                severity: 'info',
                summary: 'Iнфо',
                detail: 'Виконано вилучення',
              });
            });
        }
        break;
      }
    }
  }
}
