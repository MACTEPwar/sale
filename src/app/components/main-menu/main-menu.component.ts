import { TNullable } from '@common/types';
import { MainMenuService } from '@common/core';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  items$: Observable<MenuItem[]>;
  visible$: Observable<boolean>;
  parrent$: Observable<TNullable<MenuItem[]>>;

  constructor(
    private mainMenuService: MainMenuService,
    private router: Router
  ) {
    this.items$ = this.mainMenuService.currentItems$;
    this.visible$ = this.mainMenuService.visible$.pipe(
      tap((_) => {
        if (_ === false) {
          this.goToBack();
        }
      })
    );
    this.parrent$ = this.mainMenuService.parentsItem$;
  }

  ngOnInit(): void {}

  executeCommand(item: MenuItem): void {
    if (item?.items?.length! > 0) {
      this.mainMenuService.gotToChild(item);
    } else if (item.command === undefined) {
      this.router.navigate([item.routerLink]);
      this.goToBack();
    } else {
      item.command?.call(null);
      this.goToBack();
    }
  }

  goToBack(): void {
    this.mainMenuService.goToParent();
  }
}
