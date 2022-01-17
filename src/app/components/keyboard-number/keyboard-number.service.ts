import { BehaviorSubject } from 'rxjs';

export class KeyboardNumberService {
  value: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setValue(value: string): void {
    this.value.next(value);
    // if (value === 'b') {
    //   if (this.value.getValue().length >= 1) {
    //     this.value.next(
    //       this.value.getValue().slice(0, this.value.getValue().length - 1)
    //     );
    //   } else {
    //     return;
    //   }
    // } else {
    // //   this.value.next(`${String(this.value.getValue())}${String(value)}`);
    //   this.value.next(`${String(this.value.getValue())}${String(value)}`);
    // }
  }

  clear(): void {
    this.value.next('');
  }
}
