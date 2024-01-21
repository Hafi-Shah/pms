import { Component } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { Observable, of } from "rxjs";
import { LoginResponse } from "../../models/login.model";
import { Router } from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {RoleBaseComponentAccess} from "../../shared/role-base-component-acess";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn$: Observable<boolean>;

  userId: number = 0;
  role: string = '';

  constructor(
    private service: AuthService,
    private router: Router,
    private access: RoleBaseComponentAccess
  ) {
    this.isLoggedIn$ = of(this.service.isLoggedIn());

    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? parseInt(storedUserId, 10) : 0;

    const storedRole = localStorage.getItem('role');
    this.role = storedRole ? storedRole : '';
  }

  assignRole() {
    debugger;
    if (this.role === "user") {
      this.router.navigate(['my-user-profile', this.userId, this.role]);
    } else if (this.role === "company") {
      this.router.navigate(['my-company-profile', this.userId, this.role]);
    } else {
      this.router.navigate(['myProfile']);
    }
  }

  notificationRoute(){
    this.router.navigate(['notification']);
  }

  roleBaseAccess():boolean{
    return this.access.isRoleCompanyTrue();
  }

  logOut() {
    this.service.onLogout();
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  }
}
