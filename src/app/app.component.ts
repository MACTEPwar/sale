import { TUser } from './shared/types/types/t-user';
import { TNullable } from './shared/types/types/t-nullabel';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'sale';
  items: MenuItem[] = [];
  currentUser: TNullable<TUser>;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUser;
  }

  ngOnInit(): void {
    this.items = [
      { routerLink: '/sale', label: 'Продаж' },
      { routerLink: '/return', label: 'Повернення' },
      {
        label: 'Звiти',
        items: [
          { routerLink: '/report/receipts', label: 'Чеки' },
          { routerLink: '/report/z-reports', label: 'Z-звiти' },
        ],
      },
    ];
  }
}
