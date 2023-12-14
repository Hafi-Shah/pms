import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { UserRegComponent } from './user-reg/user-reg.component';
import { CompanyRegModule } from './company-reg/company-reg.module';
import { TokenInterceptor } from '../core/interceptors/token.interceptor';

const routes: Routes = [
  { path: '', component: AuthComponent },
];

@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    UserRegComponent,
  ],
  imports: [
    CommonModule,
    CompanyRegModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule { }
