import { Component, OnInit } from '@angular/core';
import { TProduct, TNullable } from '@common/types';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProductListService } from './product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductListService],
})
export class ProductListComponent implements OnInit {
  serachStr$: BehaviorSubject<TNullable<number>> = new BehaviorSubject<
    TNullable<number>
  >(null);
  productList$: Observable<Array<TProduct>>;
  prevText: TNullable<number> = null;

  constructor(private productListService: ProductListService) {
    this.productList$ = this.productListService.productList$;
    this.serachStr$
      .pipe(debounceTime(300))
      .subscribe((str: TNullable<number>) => {
        this.productListService.getPorducts(str);
      });
  }

  ngOnInit(): void {}

  onInput(inp: any): void {
    if (inp.value == +inp.value) {
      this.prevText = inp.value;
      this.serachStr$.next(inp.value);
    } else {
      inp.value = this.prevText;
    }
  }
}
