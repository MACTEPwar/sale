import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TFiscal } from '@common/types';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    fiscal: new FormControl(null),
  });

  isAuthinticate: Observable<boolean>;
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.isAuthinticate = this.authenticationService.isAuthinticate;
  }

  listFiscals: Array<TFiscal> = new Array<TFiscal>();

  ngOnInit(): void {}

  clickBtnLogin(): void {
    if (this.profileForm.valid) {
      this.authenticationService
        .login$(this.profileForm.getRawValue())
        .subscribe((res) => {
          this.listFiscals = res.map((m: any) => ({
            id: m.id,
            fiscalNumber: m.fiscalNumber,
          }));
        });
    }
  }

  signIn(): void {
    let result = confirm(
      `Вы хотите залогинется под номером ${
        this.profileForm.get('fiscal')?.value
      }`
    );

    if (result) {
      this.authenticationService
        .login$(this.profileForm.getRawValue())
        .subscribe((res) => {
          // this.saleService.getCurrentReceipt();
          this.router.navigate(['/sale']);
        });
    }
  }
}
