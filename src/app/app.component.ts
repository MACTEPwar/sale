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
      { url: '/sale', label: 'Продаж' },
      { url: '/return', label: 'Повернення' },
      { url: '/service', label: 'Сервiс' },
      {
        label: 'Звiти',
        items: [
          { url: '/report/receipts', label: 'Чеки' },
          { url: '/report/z-reports', label: 'Z-звiти' },
        ],
      },
    ];
  }
}
