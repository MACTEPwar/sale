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

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.items = [
      { routerLink: '/sale', label: 'Продаж' },
      { routerLink: '/return', label: 'Повернення' },
      { routerLink: '/service', label: 'Сервiс' },
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
