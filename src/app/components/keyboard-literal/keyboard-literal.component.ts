import { InputNumberModule } from 'primeng/inputnumber';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { EKeyBoardType, TNullable } from '@common/types';

@Component({
  selector: 'app-keyboard-literal',
  templateUrl: './keyboard-literal.component.html',
})
export class KeyboardLiteralComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input()
  itemTemplate?: TemplateRef<any>;
  @Input()
  value: TNullable<string> = null;
  @Input() defaultValue: any = null;
  @Output() change: EventEmitter<TNullable<string>> = new EventEmitter<
    TNullable<string>
  >();

  @Input() keyboardVisible = false;

  key: EKeyBoardType = EKeyBoardType.UA;
  eKeyBoardType = EKeyBoardType;

  showKeyboard = () => {
    this.keyboardVisible = true;
  };

  hideKeyboard = () => {
    this.keyboardVisible = false;
  };

  clearFunction = () => {
    this.value = this.defaultValue;
    if (this.value == null || this.value === '' || this.value === undefined) {
      this.change.emit(this.defaultValue);
    } else {
      this.change.emit(String(this.value));
    }
  };

  constructor() {}

  ngOnInit(): void {}

  onClose(): void {
    this.close.emit();
  }

  togleLang(key: EKeyBoardType): void {
    this.key = key;
  }
}
