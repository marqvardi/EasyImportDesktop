import {
  IPaginationGeneric,
  PaginationCategory,
} from "./../../_models/PaginationGeneric";
import { ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Category } from "./../../_models/category";
import { CategoryService } from "./../../_services/category.service";
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AsyncValidatorFn,
} from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CategoryParams } from "src/app/_models/categoryParams";
import { timer, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit {
  categories: Category[];
  category: Category;
  registerForm: FormGroup;
  modoSalvar = "post";
  modalRef: BsModalRef;
  bodyDeleteCategory = "";
  pagination: PaginationCategory;
  categoryParams = new CategoryParams();
  totalCount: number;
  @ViewChild("search", { static: true }) searchTerm: ElementRef;
  sortOptions = [
    { name: "A to Z", value: "categoryAsc" },
    { name: "Z to A", value: "categoryDesc" },
  ];
  currentCategory: string;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getCategories();
    this.registerForm = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.minLength(4)],
        [this.checkIfExists()],
      ],
    });
  }

  onSearch() {
    this.categoryParams.search = this.searchTerm.nativeElement.value;
    this.getCategories();
  }

  onReset() {
    this.searchTerm.nativeElement.value = "";
    this.categoryParams = new CategoryParams();
    this.getCategories();
  }

  onSortSelected(sort: string) {
    this.categoryParams.sort = sort;
    this.getCategories();
  }

  create(template) {
    this.modoSalvar = "post";
    //this.modalRef = this.modalService.show(template);
    this.createRegisterForm(template);
    // this.registerForm = this.fb.group({
    //   name: ["", [Validators.required, Validators.minLength(4)]],
    // });
  }

  edit(category: Category, template: any) {
    (this.modoSalvar = "put"), this.openModal(template);
    this.category = Object.assign({}, category);
    this.currentCategory = this.category.name;

    //this.registerForm.get("name").clearAsyncValidators();

    this.registerForm.patchValue(this.category);
  }

  save(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar == "post") {
        this.category = Object.assign({}, this.registerForm.value);
        this.categoryService.createCategory(this.category).subscribe(
          () => {
            this.toastr.success("Category successfully registered.");
            this.modalRef.hide();
            this.getCategories();
          },
          (error) => {
            this.toastr.error("Failed to register..");
            this.modalRef.hide();
          }
        );
        this.registerForm.reset();
      } else {
        this.category = Object.assign(
          { id: this.category.id },
          this.registerForm.value
        );

        this.categoryService.putCategory(this.category).subscribe(
          () => {
            this.toastr.success("Edited successfully");
            this.modalRef.hide();
            this.getCategories();
          },
          (error) => {
            this.toastr.error("Failed to edit");
          }
        );
        this.registerForm.reset();
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  createRegisterForm(template: any) {
    this.modoSalvar = "post";
    this.modalRef = this.modalService.show(template);
    this.registerForm = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.minLength(4)],
        [this.checkIfExists()],
      ],
    });
  }

  checkIfExists(): AsyncValidatorFn {
    return (control) => {
      return timer(1).pipe(
        switchMap(() => {
          if (!control.value || this.currentCategory == control.value) {
            return of(null);
          }
          return this.categoryService.checkIfExists(control.value).pipe(
            map((res) => {
              return res ? { exists: true } : null;
            })
          );
        })
      );
    };
  }

  getCategories() {
    this.categoryService.getCategories(this.categoryParams).subscribe(
      (response: PaginationCategory) => {
        this.categories = response.data;
        this.categoryParams.pageIndex = response.pageIndex;
        this.categoryParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      (error) => {}
    );
  }

  onPageChange(event: any) {
    this.categoryParams.pageIndex = event;
    this.getCategories();
  }

  delete(category: Category, template: any) {
    template.show();
    this.category = category;
    this.bodyDeleteCategory = `Are you sure you want to delete that category? ${category.name}`;
  }

  confirmDelete(template: any) {
    this.categoryService.deleteCategory(this.category.id).subscribe(
      () => {
        template.hide();
        this.getCategories();
        this.toastr.success("Successfully deleted");
      },
      (error) => {
        this.toastr.error(error.error);
        template.hide();
      }
    );
  }
}
