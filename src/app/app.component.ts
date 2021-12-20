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
      { url: '/sale', label: 'Продажа' },
      { url: '/return', label: 'Возвраты' },
      { url: '/service', label: 'Сервис' },
      {
        label: 'Отчеты',
        items: [
          { url: '/report/receipts', label: 'Чеки' },
          { url: '/report/z-reports', label: 'Z-отчеты' },
        ],
      },
    ];
  }
}
