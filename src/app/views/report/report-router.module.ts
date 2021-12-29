import { AuthGuard } from 'src/app/core/BLL/auth.guard';
import { ReportComponent } from './report.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZReportsComponent } from './z-reports/z-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'receipts',
        component: ReceiptsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'z-reports',
        component: ZReportsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
