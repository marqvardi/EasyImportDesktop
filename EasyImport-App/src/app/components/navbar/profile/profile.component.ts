import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserEdit } from "./../../../_models/UserEdit";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, BehaviorSubject } from "rxjs";
import { UserTeste } from "./../../../_models/UserTeste";
import { AuthService } from "./../../../_services/auth.service";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Role } from "src/app/_models/Role";
import { FileUploader } from "ng2-file-upload";
import { environment } from "src/environments/environment";
import { Photo } from "src/app/_models/photo";
import { PhotoService } from "src/app/_services/photo.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  user: UserTeste;
  user$: Observable<UserTeste>;
  registerForm: FormGroup;
  roles: Role[];
  userEdit = new UserEdit();
  @ViewChild("fileInput") fileInput: ElementRef;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  baseUrl = environment.apiUrl;
  id: number;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private photoService: PhotoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.user;

    // this.getRoles();
    // this.createRegisterForm();
    this.registerForm = this.buildForm(this.user);
    // this.registerForm.patchValue(this.user);
    this.initializeUploader();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + "user/" + localStorage.getItem("userId") + "/photos",
      authToken: "Bearer " + localStorage.getItem("token"),
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    this.uploader.onAfterAddingFile = (file) => {
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          url: res.url,
          description: res.description,
        };
        this.user.imageUrl = photo.url;
        // this.editForm.patchValue({ image: this.product.image });
      }
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  getRoles() {
    this.authService.getRoles().subscribe(
      (response: Role[]) => {
        this.roles = response;
      },
      (error) => {}
    );
  }

  save() {
    if (this.registerForm.valid) {
      this.userEdit = Object.assign({}, this.registerForm.value);

      this.authService.editUserProfile(this.userEdit).subscribe(
        () => {
          this.toastr.success("Information updated.");
          this.authService.getUserById();
          this.router.navigateByUrl("/order");
        },
        (error) => {
          this.toastr.error(error.error);
        }
      );
    }
  }

  buildForm(data: any) {
    let form = this.fb.group({
      id: [data ? data.id : ""],
      firstName: [
        data ? data.firstName : "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ],
      ],
      lastName: [
        data ? data.lastName : "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ],
      ],
      email: [data ? data.email : "", [Validators.required, Validators.email]],
    });
    return form;
  }

  // createRegisterForm() {
  //   this.registerForm = this.fb.group({
  //     id: [""],
  //     firstName: [
  //       "",
  //       [
  //         Validators.required,
  //         Validators.minLength(4),
  //         Validators.maxLength(15),
  //       ],
  //     ],
  //     lastName: [
  //       "",
  //       [
  //         Validators.required,
  //         Validators.minLength(4),
  //         Validators.maxLength(15),
  //       ],
  //     ],
  //     email: ["", [Validators.required, Validators.email]],
  //   });
  // }

  // getUser() {
  //   const userId = localStorage.getItem("userId");
  //   this.authService.getUserById(userId).subscribe(
  //     (response: UserTeste) => {

  //       this.user = response;
  //       console.log(response);
  //     },
  //     (error) => {}
  //   );
  // }
}
