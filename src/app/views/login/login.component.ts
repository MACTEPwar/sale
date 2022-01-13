import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TFiscal } from '@common/types';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // providers: [ConfirmationService],
})
export class LoginComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({
    // username: new FormControl('test', Validators.required),
    // password: new FormControl('flvbyrf2020!@', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    fiscal: new FormControl(null),
  });

  isAuthinticate: Observable<boolean>;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {
    this.isAuthinticate = this.authenticationService.isAuthinticate;
  }

  listFiscals: Array<TFiscal> = new Array<TFiscal>();

  ngOnInit(): void {}

  clickBtnLogin(): void {
    if (this.profileForm.valid) {
      this.authenticationService
        .login$(this.profileForm.getRawValue())
        .subscribe(
          (res) => {
            // alert(JSON.stringify(res, null, 4));
            this.listFiscals = res.map((m: any) => ({
              id: m.id,
              fiscalNumber: m.fiscalNumber,
            }));
          },
          (err) => {
            // alert(JSON.stringify(err, null, 4));
          }
        );
    }
  }

  // signIn(): void {
  //   let result = confirm(
  //     `Вы хотите залогинется под номером ${
  //       this.profileForm.get('fiscal')?.value
  //     }`
  //   );

  //   if (result) {
  //     this.authenticationService
  //       .login$(this.profileForm.getRawValue())
  //       .subscribe((res) => {
  //         // this.saleService.getCurrentReceipt();
  //         this.router.navigate(['/sale']);
  //       });
  //   }
  // }

  confirm() {
    this.confirmationService.confirm({
      message: `Ви бажаєте залогінитись під номером ${
        this.profileForm.get('fiscal')?.value
      } ?`,
      acceptLabel: 'Так',
      rejectLabel: 'Нi',
      header: 'Авторизацiя',
      accept: () => {
        // alert(JSON.stringify(this.profileForm.getRawValue(), null, 4));
        this.authenticationService
          .login$(this.profileForm.getRawValue())
          .subscribe((res) => {
            // this.saleService.getCurrentReceipt();
            this.router.navigate(['/sale']);
          });
      },
    });
  }
}
