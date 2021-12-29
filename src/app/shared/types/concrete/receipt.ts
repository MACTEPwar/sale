import { BehaviorSubject } from 'rxjs';
import { TProduct } from '../types/t-product';
import { TReceiptProduct } from '../types/t-receipt-product';

export class Receipt {
  products: BehaviorSubject<Array<TReceiptProduct>> = new BehaviorSubject<
    Array<TReceiptProduct>
  >([]);
  totalSum: BehaviorSubject<number> = new BehaviorSubject<number>(0);
}
