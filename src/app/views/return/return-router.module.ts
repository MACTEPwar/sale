import { ReturnComponent } from './return.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/BLL/auth.guard';

const routes: Routes = [
  {
    path: ':fiscalNumber',
    component: ReturnComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnRoutingModule {}
