import { Component, OnInit } from '@angular/core';
import { TProduct, TNullable } from '@common/types';
import { Observable } from 'rxjs';
import { ProductListService } from './product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductListService],
})
export class ProductListComponent implements OnInit {
  text: TNullable<number> = null;
  productList$: Observable<Array<TProduct>>;

  constructor(private productListService: ProductListService) {
    this.productList$ = this.productListService.productList$;
  }

  ngOnInit(): void {}

  search(event: any): void {
    this.productListService.getPorducts(event.query);
  }
}
