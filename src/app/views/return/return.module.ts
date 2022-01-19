import { KeyboardNumberModule } from './../../components/keyboard-number/keyboard-number.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnComponent } from './return.component';
import { ReturnRoutingModule } from './return-router.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [ReturnComponent],
  imports: [
    CommonModule,
    ReturnRoutingModule,
    KeyboardNumberModule,
    DialogModule,
    ButtonModule,
  ],
})
export class ReturnModule {}
