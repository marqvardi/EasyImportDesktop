import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/_services/auth.service";
import { ToastrService } from "ngx-toastr";
import { UserChangePassword } from "src/app/_models/UserChangePassword";
import { UserTeste } from "src/app/_models/UserTeste";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  registerForm: FormGroup;
  userChangePassword: UserChangePassword;
  user: UserTeste;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createRegisterForm();
    this.user = this.authService.user;
  }

  createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        id: [],
        oldPassword: [
          "",
          [
            Validators.required,
            // Validators.minLength(4),
            // Validators.maxLength(8),
          ],
        ],
        newPassword: [
          "",
          [
            Validators.required,
            // Validators.minLength(4),
            // Validators.maxLength(8),
          ],
        ],
        confirmPassword: ["", Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  save() {
    if (this.registerForm.valid) {
      this.userChangePassword = this.registerForm.value;
      this.userChangePassword.id = this.user.id;

      this.authService.userChangePassword(this.userChangePassword).subscribe(
        () => {
          this.toastr.success("Password successfully changed.");
          this.router.navigateByUrl("/order");
        },
        (error) => {
          this.toastr.error("Failed to save new password");
        }
      );
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("newPassword").value === g.get("confirmPassword").value
      ? null
      : { mismatch: true };
  }
}
