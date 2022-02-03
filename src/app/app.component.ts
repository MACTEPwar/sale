import {
  Component,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { MainMenuService, PrinterService } from '@common/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { TNullable } from './shared/types/types/t-nullabel';
import { TUser } from './shared/types/types/t-user';
import { ServiceService } from './views/service/service.service';

declare function require(moduleName: string): any;

const { version } = require('../../package.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ServiceService, ConfirmationService],
})
export class AppComponent {
  @ViewChild('printContainer', { read: ViewContainerRef })
  printContainerDOM: any;

  title = '';
  // items: MenuItem[] = [];
  items2: MenuItem[] = [];
  currentUser: Observable<TNullable<TUser>>;
  confirmText: number | null = null;
  visibleConfirmDialog = false;
  confirmOperation: 'cashIn' | 'cashOut' | null = null;

  isOnline: Observable<boolean>;
  shiftStatus: Observable<boolean>;

  /** Денег в кассе */
  moneyInKassa: Observable<number>;

  //#region Import file
  visibleImporProducts = false;

  fileForImport: TNullable<File> = null;
  shopGroup: TNullable<{ id: string; name: string }> = null;

  shopGroups$: Observable<Array<{ id: string; name: string }>>;
  //#endregion

  visibleMainMenu$: Observable<boolean>;

  visibleProgress = false;
  visibleZProgress = false;

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
    private serviceComponent: ServiceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private printerService: PrinterService,
    private renderer: Renderer2,
    private titleService: Title,
    private serviceService: ServiceService,
    private mainMenuService: MainMenuService
  ) {
    this.currentUser = this.authenticationService._currentUser$;
    /** Подписка на сумму денег в кассе */
    this.moneyInKassa = this.serviceService.moneyInKassa;

    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.title = titleService.getTitle();
      });

    this.isOnline = this.serviceService.isOnline$;
    this.shiftStatus = this.serviceService.shiftStatus$;
    this.shopGroups$ = this.serviceComponent.shopGroups$;
    this.visibleMainMenu$ = this.mainMenuService.visible$;
  }

  ngOnInit(): void {
    // this.items = [
    //   // { routerLink: '/test', label: 'Test' },
    //   { routerLink: '/sale', label: 'Продаж' },
    //   // { routerLink: '/return', label: 'Повернення' },
    //   {
    //     label: 'Звiти',
    //     items: [
    //       { routerLink: '/report/receipts', label: 'Чеки' },
    //       // { routerLink: '/report/z-reports', label: 'Z-звiти' },
    //     ],
    //   },
    //   {
    //     label: 'Сервiси',
    //     items: [
    //       {
    //         label: 'Внесення',
    //         command: () => this.doCashIn(),
    //       },
    //       {
    //         label: 'Вилучення',
    //         command: () => this.doCashOut(),
    //       },
    //       { label: 'X-звiт', command: () => this.doXReport() },
    //       { label: 'Z-звiт', command: () => this.doZReport() },
    //     ],
    //   },
    // ];

    this.authenticationService._currentUser$.subscribe((user) => {
      let menu: MenuItem[] = [];
      if (user?.isAdmin) {
        menu = [
          {
            // icon: '../images/icons/m_admin.svg',
            icon: 'admin',
            label: 'Адмiн',
            items: [
              {
                icon: 'import',
                label: 'Iмпорт товарiв',
                command: () => (this.visibleImporProducts = true),
              },
              {
                icon: 'print',
                label: 'Тест друку',
                command: () => this.serviceComponent.testPrint(this.renderer),
              },
              {
                icon: 'info',
                label: 'Iнфо по планшету',
                command: () => this.getInfo(),
              },
            ],
          },
          // { routerLink: '/test', label: 'Test' },
          { routerLink: '/sale', label: 'Продаж', icon: 'sale' },
          // { routerLink: '/return', label: 'Повернення' },
          {
            icon: 'report',
            label: 'Звiти',
            items: [
              { routerLink: '/report/receipts', label: 'Чеки', icon: 'check' },
              // { routerLink: '/report/z-reports', label: 'Z-звiти' },
            ],
          },
          {
            icon: 'service',
            label: 'Сервiси',
            items: [
              {
                icon: 'incash',
                label: 'Внесення',
                command: () => this.doCashIn(),
              },
              {
                icon: 'outcash',
                label: 'Вилучення',
                command: () => this.doCashOut(),
              },
              {
                icon: 'x-report',
                label: 'X-звiт',
                command: () => this.doXReport(),
              },
              {
                icon: 'z-report',
                label: 'Z-звiт',
                command: () => this.doZReport(),
              },
            ],
          },
        ];

        this.serviceComponent.getShopGroups();
      } else {
        this.serviceComponent.shopGroups$.next([]);
        menu = [
          // { routerLink: '/test', label: 'Test' },
          { routerLink: '/sale', label: 'Продаж', icon: 'sale' },
          // { routerLink: '/return', label: 'Повернення' },
          {
            icon: 'report',
            label: 'Звiти',
            items: [
              { routerLink: '/report/receipts', label: 'Чеки', icon: 'check' },
              // { routerLink: '/report/z-reports', label: 'Z-звiти' },
            ],
          },
          {
            icon: 'service',
            label: 'Сервiси',
            items: [
              {
                icon: 'incash',
                label: 'Внесення',
                command: () => this.doCashIn(),
              },
              {
                icon: 'outcash',
                label: 'Вилучення',
                command: () => this.doCashOut(),
              },
              {
                icon: 'x-report',
                label: 'X-звiт',
                command: () => this.doXReport(),
              },
              {
                icon: 'z-report',
                label: 'Z-звiт',
                command: () => this.doZReport(),
              },
            ],
          },
        ];
      }
      this.mainMenuService.setMenu(menu);
    });

    this.items2 = [
      { label: 'Вийти', command: () => this.logout() },
      { label: version },
    ];
  }

  ngAfterViewInit(): void {
    this.printerService.registerViewContainer(this.printContainerDOM!);
  }

  showMenu(): void {
    this.mainMenuService.toggleMenu();
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
    // this.visibleConfirmDialog = true;
    this.visibleZProgress = true;
    this.serviceComponent
      .doZReport$()
      .pipe(map((m) => m.data))
      .subscribe(
        (res) => {
          // this.visibleConfirmDialog = false;
          this.visibleZProgress = false;
          /** Поулчаю статус ПРРО */
          this.serviceService.getEcrStatus();
          /** Поулчаю статус смены */
          this.serviceService.getShiftStatus();
          this.confirmationService.confirm({
            message: 'Z-звiт зроблено. Роздрукувати?',
            acceptLabel: 'Так',
            rejectLabel: 'Нi',
            header: 'Iнфо',
            accept: () => {
              this.serviceComponent.printZReport(this.renderer);
            },
          });
        },
        (err) => {
          // this.visibleConfirmDialog = false;
          this.visibleZProgress = false;
        }
      );
  }

  doXReport(): void {
    this.serviceComponent.doXReport(this.renderer);
  }

  logout(): void {
    this.authenticationService.logout();
  }

  confirm(state: boolean, needPrint: boolean): void {
    switch (this.confirmOperation) {
      case 'cashIn': {
        if (state === true && this.confirmText != null) {
          this.visibleProgress = true;
          this.serviceComponent.doCashIn(+this.confirmText).subscribe(
            (res) => {
              this.visibleProgress = false;
              this.serviceComponent.getMoneyInKassa();
              this.serviceComponent.getShiftStatus();
              this.visibleConfirmDialog = false;
              this.confirmText = null;
              this.messageService.add({
                severity: 'info',
                summary: 'Iнфо',
                detail: 'Виконано внесення',
              });
              if (needPrint === true) {
                this.serviceComponent.printLastReceipt(this.renderer);
              }
            },
            (err) => {
              this.visibleProgress = false;
            }
          );
        } else {
          this.visibleConfirmDialog = false;
        }
        break;
      }
      case 'cashOut': {
        if (state === true && this.confirmText != null) {
          this.visibleProgress = true;
          this.serviceComponent.doCashOut(+this.confirmText).subscribe(
            (res) => {
              this.visibleProgress = false;
              this.serviceComponent.getMoneyInKassa();
              this.confirmText = null;
              this.visibleConfirmDialog = false;
              this.messageService.add({
                severity: 'info',
                summary: 'Iнфо',
                detail: 'Виконано вилучення',
              });
              if (needPrint === true) {
                this.serviceComponent.printLastReceipt(this.renderer);
              }
            },
            (err) => {
              this.visibleProgress = false;
            }
          );
        } else {
          this.visibleConfirmDialog = false;
        }
        break;
      }
    }
  }

  onSelect(event: any): void {
    this.fileForImport = event.files[0];
  }

  doImportProducts(): void {
    // alert(JSON.stringify(this.shopGroup, null, 4));
    this.serviceComponent
      .importProducts$(this.fileForImport!, this.shopGroup?.id!)
      .pipe(map((m) => m.data))
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Iнфо',
          detail: 'Виконан iмпорт товарiв',
        });
      });
  }

  getInfo(): void {
    alert(`
       window.devicePixelRatio : ${window.devicePixelRatio}
    `);
  }
}
