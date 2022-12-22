import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { PeriodReportService } from './period-report.service';
import { map, tap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PreloaderService } from '@common/core';

@Component({
  selector: 'app-period-report',
  templateUrl: './period-report.component.html',
  styleUrls: ['./period-report.component.scss'],
  providers: [PeriodReportService],
})
export class PeriodReportComponent implements OnInit {
  date: [Date, Date] = [
    new Date(
      new Date().setDate(new Date().getDate() - new Date().getDate() + 1)
    ),
    new Date(),
  ];

  listEcrs$: Observable<Array<any>>;

  visibleReport: boolean = false;
  printContent$: BehaviorSubject<Array<string>>;

  profileForm: FormGroup = new FormGroup({
    fromDate: new FormControl(null, Validators.required),
    toDate: new FormControl(null),
    fiscalNumber: new FormControl(null, Validators.required),
  });

  constructor(
    private periodReportService: PeriodReportService,
    private renderer: Renderer2
  ) {
    this.listEcrs$ = this.periodReportService
      .getEcrsList$()
      .pipe(map((m) => m.map((mm: any) => ({ label: mm, value: mm }))));

    this.printContent$ = this.periodReportService.contentForPrint$;
  }

  ngOnInit(): void {
    this.profileForm.patchValue({
      fromDate: this.date[0],
      toDate: this.date[1],
    });
  }

  onDateChange(event: [Date, Date]): void {
    this.date = event;
    if (!event[0] || !event[1]) {
      return;
    }

    this.profileForm.patchValue({
      fromDate: this.date[0],
      toDate: this.date[1],
    });
  }

  execute(): void {
    if (this.profileForm.valid) {
      if (this.profileForm.get('toDate')?.value === null) {
        this.profileForm
          .get('toDate')
          ?.setValue(this.profileForm.get('fromDate')?.value);
      }

      var dateF = this.profileForm.get('fromDate')?.value;
      var dateT = this.profileForm.get('toDate')?.value;

      dateF.setHours(6);
      dateT.setHours(6);
      dateF.setMinutes(0);
      dateT.setMinutes(0);

      this.profileForm.patchValue({
        fromDate: dateF,
        toDate: dateT,
      });

      this.periodReportService
        .getPeriodReport$(this.profileForm.getRawValue())
        .subscribe((res) => {
          console.log('form', res);
          this.visibleReport = true;
        });
    }
  }

  print(): void {
    this.periodReportService.print(this.renderer);
  }
}
