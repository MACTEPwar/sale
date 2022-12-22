import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable()
export class PreloaderService {
  loader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  setLoader(state: boolean) {
    this.loader$.next(state);
  }
}
