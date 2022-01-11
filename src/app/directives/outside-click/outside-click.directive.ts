import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOutsideClick]',
})
export class OutsideClickDirective {
  constructor(private elementref: ElementRef) {
    console.log('>>>>>>>>>>', this.elementref);
  }

  @HostListener('click') onClick() {
    console.log(this.elementref.nativeElement.offsetParrent);
  }
}
