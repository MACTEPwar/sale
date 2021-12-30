import { TestComponent } from './views/test/test.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./views/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'sale',
    loadChildren: () =>
      import('./views/sale/sale.module').then((m) => m.SaleModule),
  },
  {
    path: 'return',
    loadChildren: () =>
      import('./views/return/return.module').then((m) => m.ReturnModule),
  },
  {
    path: 'report',
    loadChildren: () =>
      import('./views/report/report.module').then((m) => m.ReportModule),
  },
  {
    path: 'test',
    component: TestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
