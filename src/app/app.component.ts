import { TUser } from './shared/types/types/t-user';
import { TNullable } from './shared/types/types/t-nullabel';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ServiceService } from './views/service/service.service';
import { Observable } from 'rxjs';
import { ServiceComponent } from './views/service/service.component';
import { SaleService } from './core/BLL/sale-logic/sale.service';

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

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private serviceComponent: ServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  doCashIn(): void {
    this.confirmOperation = 'cashIn';
    this.visibleConfirmDialog = true;
  }

  doCashOut(): void {
    this.confirmOperation = 'cashOut';
    this.visibleConfirmDialog = true;
  }

  doZReport(): void {
    this.serviceComponent.doZReport().subscribe((res) => {});
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
