import { ReportComponent } from './report.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZReportsComponent } from './z-reports/z-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      { path: 'receipts', component: ReceiptsComponent },
      { path: 'z-reports', component: ZReportsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
