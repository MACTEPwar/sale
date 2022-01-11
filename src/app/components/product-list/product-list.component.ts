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
import { debounceTime, filter } from 'rxjs/operators';
import { ProductListService } from './product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductListService],
})
export class ProductListComponent implements OnInit {
  @Input() id = 'id';
  @Output() add: EventEmitter<TProduct> = new EventEmitter<TProduct>();

  @ViewChild('searchResult') searchResultERef?: ElementRef<any>;
  @ViewChild('searchLine') searchLineERef?: ElementRef<any>;
  @ViewChild('inp') inputERef?: ElementRef<any>;

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    try {
      if (
        this.searchResultERef!.nativeElement.contains(event.target) ||
        this.searchLineERef!.nativeElement.contains(event.target)
      ) {
      } else {
        if (this.visibleResult) {
          this.visibleResult = false;
          this.inputERef!.nativeElement!.value = '';
        }
      }
    } catch {}
  }

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
        debounceTime(300)
      )
      .subscribe((str: TNullable<number>) => {
        this.productListService.getPorducts(str);
        this.visibleResult = true;
      });
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

  addProductToReceipt(product: TProduct, input: any): void {
    this.add.emit(product);
    this.visibleResult = false;
    this.prevText = null;
    this.serachStr$.next(null);
    input.value = null;
  }
}
