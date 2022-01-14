import { TNullable } from '@common/types';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Injectable()
export class MainMenuService {
  menu: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);
  currentItems$: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(
    []
  );
  parentsItem$: BehaviorSubject<TNullable<MenuItem[]>> = new BehaviorSubject<
    TNullable<MenuItem[]>
  >(null);
  visible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  setMenu(menu: MenuItem[]): void {
    this.menu.next(menu);
    this.currentItems$.next(menu);
  }

  toggleMenu(state: TNullable<boolean> = null) {
    this.visible$.next(state ?? !this.visible$.getValue());
  }

  gotToChild(item: MenuItem): void {
    this.parentsItem$.next(this.currentItems$.getValue());
    this.currentItems$.next(item.items!);
  }

  goToParent(): void {
    if (this.parentsItem$.getValue() !== null) {
      this.currentItems$.next(this.parentsItem$.getValue()!);
      this.parentsItem$.next(null);
    }
  }
}
