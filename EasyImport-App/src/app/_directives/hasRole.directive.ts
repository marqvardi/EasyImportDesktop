import { AuthService } from "./../_services/auth.service";
import { TemplateRef, OnInit } from "@angular/core";
import { Directive, Input, ViewContainerRef } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";

@Directive({
  selector: "[appHasRole]",
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  isVisible = false;
  jwtHelper = new JwtHelperService();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService
  ) {}

  ngOnInit() {
    let rolesList: string[] = [];
    const token = localStorage.getItem("token");

    if (token) {
      const decodeToken = this.jwtHelper.decodeToken(token);

      rolesList = decodeToken.role as Array<string>;

      const isAuthorized = this.authService.isAuthorized(rolesList);

      // if no roles clear the viewContainerRef
      if (!isAuthorized) {
        this.viewContainerRef.clear();
      }

      // if user has role then render the element
      if (this.authService.isAuthorized(this.appHasRole)) {
        //use isAllowed

        if (!this.isVisible) {
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.isVisible = false;
          this.viewContainerRef.clear();
        }
      }
    }
  }
}
