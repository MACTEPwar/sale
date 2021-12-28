import { AuthenticationMockService } from './authentication-mock.service';
import { AuthenticationService } from './authentication.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [{ provide: AuthenticationService }],
})
export class AuthenticationModule {}
