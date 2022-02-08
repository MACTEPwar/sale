import { Injectable } from '@angular/core';
import { QueryService } from '@common/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ZReportService {
  zReprots: BehaviorSubject<Array<TZReport>> = new BehaviorSubject<
    Array<TZReport>
  >([]);
  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private queryService: QueryService) {}

  getReceipts(filter: TZReportFilter): void {
    this.loading.next(true);
    this.queryService
      .post(
        `${
          environment.apiUrl
        }/api/reports/list?dateTime=${filter.dateTime.toISOString()}`,
        {
          skip: filter.skip,
          take: filter.take,
        }
      )
      .pipe(
        map((m: any) => m.data),
        take(1)
      )
      .subscribe((data) => {
        this.zReprots.next(data.Value);
        this.count.next(data.Key);
        this.loading.next(false);
      });
  }
}

export type TZReport = {
  id: string;
  fiscalNumber: number;
  shiftId: number;
  dateCreate: Date;
};

export type TZReportFilter = {
  dateTime: Date;
  skip: number;
  take: number;
};
