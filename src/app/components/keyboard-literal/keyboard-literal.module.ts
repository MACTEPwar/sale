import { KeyboardLiteralService } from './keyboard-literal.service';
import { KeyboardLiteralComponent } from './keyboard-literal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [KeyboardLiteralComponent],
  imports: [CommonModule],
  exports: [KeyboardLiteralComponent],
  providers: [KeyboardLiteralService],
})
export class KeyboardLiteralModule {}
