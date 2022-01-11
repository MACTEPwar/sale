import { Injectable } from '@angular/core';
import { QueryService } from '@common/core';
import { TProduct } from '@common/types';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProductListService {
  productList$: BehaviorSubject<Array<TProduct>> = new BehaviorSubject<
    Array<TProduct>
  >([]);
  constructor(private queryService: QueryService) {}

  getPorducts(name: number | null = null): void {
    let url = `${environment.apiUrl}/api/barPrice/list`;
    if (name != null) {
      url += `?name=${name}`;
    }
    this.queryService
      .get(url)
      .pipe(map((m: any) => m.data))
      .subscribe(
        (res) => {
          this.productList$.next(
            res.map((m: any) => ({
              id: m.id,
              name: m.name,
              bar: m.bar,
              price: m.price,
              article: m.article,
            }))
          );
        },
        (e) => {
          alert(JSON.stringify(e, null, 4));
        }
      );
  }
}
