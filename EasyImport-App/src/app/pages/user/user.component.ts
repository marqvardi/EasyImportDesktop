import { UserTeste } from "./../../_models/UserTeste";
import { AuthService } from "src/app/_services/auth.service";
import { User } from "./../../_models/user";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { PaginationUser } from "src/app/_models/PaginationGeneric";
import { UserParams } from "src/app/_models/UserParams";
import { ToastrService } from "ngx-toastr";
import { Role } from "src/app/_models/Role";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  users: UserTeste[];
  user: UserTeste;
  registerForm: FormGroup;
  modoSalvar = "post";
  modalRef: BsModalRef;
  bodyDeleteCategory = "";
  pagination: PaginationUser;
  userParams = new UserParams();
  totalCount: number;
  @ViewChild("search", { static: true }) searchTerm: ElementRef;
  sortOptions = [
    { name: "A to Z", value: "nameAsc" },
    { name: "Z to A", value: "nameDesc" },
  ];
  currentUser: string;
  roles: Role[];
  defaultImage = "../../../assets/img/default-avatar.png";

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getUsers();
    this.getRoles();
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.modoSalvar = "post";
    this.registerForm = this.fb.group({
      username: [
        "",
        [
          // Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ],
      ],
      firstName: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      roleId: ["", Validators.required],
    });
  }

  createRegisterForm(template: any) {
    this.modoSalvar = "post";
    this.modalRef = this.modalService.show(template);
    this.registerForm = this.fb.group({
      username: [
        "",
        [
          //  Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ],
      ],
      firstName: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      roleId: ["", Validators.required],
    });
  }

  getRoles() {
    this.authService.getRoles().subscribe(
      (response: Role[]) => {
        this.roles = response;
      },
      (error) => {}
    );
  }

  create(template) {
    this.modoSalvar = "post";
    this.createRegisterForm(template);
  }

  edit(user: UserTeste, template: any) {
    (this.modoSalvar = "put"), this.openModal(template);
    // this.user = Object.assign({}, user);
    this.user = user;
    this.currentUser = this.user.username;
    //console.log(this.user);
    this.registerForm.patchValue(this.user);
  }

  delete(user: UserTeste, template: any) {
    if (user.username === "Admin") {
      this.toastr.warning("User can not be deleted.");
      return;
    }

    template.show();
    this.user = user;
    this.bodyDeleteCategory = `Are you sure you want to delete that category? ${user.firstName}`;
  }

  confirmDelete(template: any) {
    this.authService.deleteUser(this.user.id).subscribe(
      () => {
        template.hide();
        this.getUsers();
        this.toastr.success("Successfully deleted");
      },
      (error) => {
        this.toastr.error(error.error);
        template.hide();
      }
    );
  }

  save(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar == "post") {
        this.user = Object.assign({}, this.registerForm.value);
        this.authService.createUser(this.user).subscribe(
          () => {
            this.toastr.success("User created successfuly");
            this.getUsers();
            this.registerForm.reset();
            this.modalRef.hide();
          },
          (error) => {
            this.toastr.error("Error when creating the user", error.error);
          }
        );
        // this.registerForm.reset();
      } else {
        this.user = Object.assign(
          { id: this.user.id },
          this.registerForm.value
        );

        this.authService.editUser(this.user).subscribe(
          () => {
            this.toastr.success("User created successfuly");
            this.registerForm.reset();
            this.modalRef.hide();
            this.getUsers();
          },
          (error) => {
            this.toastr.error("Error when creating the user");
          }
        );
        // this.registerForm.reset();
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onSearch() {
    this.userParams.search = this.searchTerm.nativeElement.value;
    this.getUsers();
  }

  onReset() {
    this.searchTerm.nativeElement.value = "";
    this.userParams = new UserParams();
    this.getUsers();
  }

  onSortSelected(sort: string) {
    this.userParams.sort = sort;
    this.getUsers();
  }

  onPageChange(event: any) {
    this.userParams.pageIndex = event;
    this.getUsers();
  }

  getUsers() {
    this.authService.getUsers(this.userParams).subscribe(
      (response: PaginationUser) => {
        this.users = response.data;
        this.userParams.pageIndex = response.pageIndex;
        this.userParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      (error) => {}
    );
  }
}
