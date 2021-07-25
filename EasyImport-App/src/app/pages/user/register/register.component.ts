import { AdminService } from "./../../../_services/admin.service";
import { AuthService } from "./../../../_services/auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  roles: any[];

  constructor(
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.getRoleNames();
  }

  getRoleNames() {
    return this.adminService.getRoleNames().subscribe(
      (rolesFromServer: any[]) => {
        this.roles = rolesFromServer;
        console.log(this.roles);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
