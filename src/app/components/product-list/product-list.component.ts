import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TProduct, TNullable } from '@common/types';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { ProductListService } from './product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductListService],
})
export class ProductListComponent implements OnInit {
  @Input() id = 'id';
  private _searchValue = '';
  public get searchValue() {
    return this._searchValue;
  }
  @Input()
  public set searchValue(value) {
    this.serachStr$.next(+value);
    this._searchValue = value;
    // if (value == String(Number(value)) || value === '') {
    //   this.prevText = +value;
    //   this.serachStr$.next(+value);
    //   this._searchValue = value;
    // } else {
    //   this._searchValue = String(this.prevText);
    // }
    // this.inputERef!.nativeElement.value = this._searchValue;
    // this._searchValue = value;
  }
  @Output() add: EventEmitter<TProduct> = new EventEmitter<TProduct>();
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();
  @Output() search: EventEmitter<TNullable<number>> = new EventEmitter<
    TNullable<number>
  >();

  @ViewChild('searchResult') searchResultERef?: ElementRef<any>;
  @ViewChild('searchLine') searchLineERef?: ElementRef<any>;
  // @ViewChild('inp') inputERef?: ElementRef<any>;

  serachStr$: BehaviorSubject<TNullable<number>> = new BehaviorSubject<
    TNullable<number>
  >(null);
  productList$: Observable<Array<TProduct>>;
  prevText: TNullable<number> = null;
  visibleResult = false;

  constructor(private productListService: ProductListService) {
    this.productList$ = this.productListService.productList$;
    this.serachStr$
      .pipe(
        filter((f: TNullable<number>) => f != null && String(f!).length > 0),
        tap(_ => {
          this.search.emit(_);
        }),
        debounceTime(300)
      )
      .subscribe((str: TNullable<number>) => {
        this.productListService.getPorducts(str);
        this.visibleResult = true;
      });

    console.log('TEST');
  }

  ngOnInit(): void {}

  ngAfterviewInit(): void {
    console.log(this.searchResultERef);
  }

  onInput(inp: any): void {
    if (inp.value == +inp.value) {
      this.prevText = inp.value;
      this.serachStr$.next(inp.value);
    } else {
      inp.value = this.prevText;
    }
  }

  addProductToReceipt(product: TProduct): void {
    this.add.emit(product);
    this.visibleResult = false;
    this.prevText = null;
    this.serachStr$.next(null);
    this.clear.emit();
    // input.value = null;
  }

  bgclick(): void {
    // console.log('click');
    this.visibleResult = false;
    this.clear.emit();
    // this.inputERef!.nativeElement!.value = '';
  }

  clearBtn(): void {
    this.clear.emit();

    // this.serachStr$.next(null);
  }
}
