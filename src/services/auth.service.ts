import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, Subject } from "rxjs";
import { environment } from "../environments/environment.development";
import { ApiPath } from "../app/core/constants/api-url.constant";
import { Router } from "@angular/router";
import { LoginModel, LoginResponse } from "../app/models/login.model";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  roleChange: Subject<string | null> = new Subject<string | null>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onLogin(obj: LoginModel): Observable<LoginResponse> {
    const url: string = (environment.basePath).concat(ApiPath.LOGIN);
    return this.http.post<LoginResponse>(url, obj).pipe(map(response => {
      this.storeToken(response.token);
      this.storeUserIdAndRole(response.userId, response.role);
      this.roleChange.next(response.role); // Notify subscribers about role change
      return response;
    }));
  }

  onLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.roleChange.next(null); // Notify subscribers about logout
    this.router.navigate(['home']);
    this.toastr.success('System logout successful', 'LogOut', { timeOut: 1500 });
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  storeUserIdAndRole(userId: number, role: string) {
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('role', role);
    this.roleChange.next(role); // Notify subscribers about role change
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
