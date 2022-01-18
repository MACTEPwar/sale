import { BehaviorSubject } from 'rxjs';

export class KeyboardLiteralService {
  value: BehaviorSubject<string> = new BehaviorSubject<string>('');

  setValue(value: string): void {
    this.value.next(value);
  }

  clear(): void {
    this.value.next('');
  }
}
