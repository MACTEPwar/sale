import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardNumberComponent } from './keyboard-number.component';
import { KeyboardNumberService } from './keyboard-number.service';

@NgModule({
  declarations: [KeyboardNumberComponent],
  imports: [CommonModule],
  exports: [KeyboardNumberComponent],
  providers: [KeyboardNumberService],
})
export class KeyboardNumberModule {}
