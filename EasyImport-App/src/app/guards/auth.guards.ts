import { ToastrService } from "ngx-toastr";
import { AuthService } from "./../_services/auth.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const allowedRoles = next.data.allowedRoles;

    const isAuthorized = this.authService.isAuthorized(allowedRoles);

    if (!isAuthorized) {
      this.toastr.error("Not authorize to access this area.");
      // if not authorized, show access denied message
      this.router.navigate(["/home"]);
    }


    return isAuthorized;
  }
}
