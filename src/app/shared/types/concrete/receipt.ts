import { BehaviorSubject } from 'rxjs';
import { TProduct } from '../types/t-product';
import { TReceiptProduct } from '../types/t-receipt-product';

export class Receipt {
  products: BehaviorSubject<Array<TReceiptProduct>> = new BehaviorSubject<
    Array<TReceiptProduct>
  >([]);
  totalSum: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // addProduct(product: TProduct, amount: number): void {
  //   this.products.next([
  //     {
  //       id: product.id,
  //       amount,
  //       name: product.name,
  //       price: product.price,
  //     },
  //     ...this.products.getValue(),
  //   ]);

  //   // this.refreshTotalPrice();
  // }

  // dropProduct(id: string): void {
  //   this.products.next(this.products.getValue().filter((f) => f.id !== id));

  //   // this.refreshTotalPrice();
  // }

  //   private refreshTotalPrice(): void {
  //     this.products.getValue().reduce((curr: any, acc: any) => {
  //       acc += (curr as TReceiptProduct).amount * (curr as TReceiptProduct).price;
  //       return acc;
  //     }, 0);
  //   }
}
