import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "./../../../_services/auth.service";
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/_models/user";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: User;
  loginForm: FormGroup;
  returnUrl: string;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.authService.logout();

    this.returnUrl =
      this.activatedRoute.snapshot.queryParams["returnUrl"] || "/";
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"),
      ]),
      password: new FormControl("", Validators.required),
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(
      () => {
        //this.router.navigateByUrl(this.returnUrl);

        //this.router.navigate(["admin"]);
        this.router.navigateByUrl("/order");
        // this.router.navigate([this.returnUrl]);
        this.toastr.success("Logged in!");
      },
      (error) => {
        this.toastr.error("Failed to login");
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}
