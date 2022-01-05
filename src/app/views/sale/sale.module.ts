import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { SaleRoutingModule } from './sale-router.module';
import { SaleComponent } from './sale.component';

@NgModule({
  declarations: [SaleComponent],
  imports: [
    CommonModule,
    SaleRoutingModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    FormsModule,
    StyleClassModule,
    DialogModule,
    ProgressBarModule,
  ],
})
export class SaleModule {}
