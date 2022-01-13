import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-keyboard-number',
  templateUrl: './keyboard-number.component.html',
  styleUrls: ['./keyboard-number.component.scss'],
})
export class KeyboardNumberComponent implements OnInit {
  @Input()
  itemTemplate?: TemplateRef<any>;

  value: string = '';

  clearFunction = () => {
    this.value = '';
  };

  constructor() {}

  ngOnInit(): void {}

  setValue(value: string): void {
    if (value === 'b') {
      if (this.value.length >= 1) {
        this.value = this.value.slice(0, this.value.length - 1);
      } else {
        return;
      }
    } else {
      this.value = `${String(this.value)}${String(value)}`;
    }
  }
}
