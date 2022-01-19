import { KeyboardNumberModule } from './../../components/keyboard-number/keyboard-number.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReturnComponent } from './return.component';
import { ReturnRoutingModule } from './return-router.module';

@NgModule({
  declarations: [ReturnComponent],
  imports: [CommonModule, ReturnRoutingModule, KeyboardNumberModule],
})
export class ReturnModule {}
