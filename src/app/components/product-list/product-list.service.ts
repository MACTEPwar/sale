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

  getPorducts(name: string | null = null): void {
    let obj: any = {};
    if (name) {
      obj.name = name;
    }

    this.queryService
      .get(`${environment.apiUrl}/api/barPrice/list`, obj)
      .pipe(map((m: any) => m.data))
      .subscribe(
        (res) => {
          this.productList$.next(
            res.map((m: any) => ({
              id: m.id,
              name: m.name,
              bar: m.bar,
              price: m.price,
            }))
          );
        },
        (e) => {
          alert(JSON.stringify(e, null, 4));
        }
      );
  }
}
