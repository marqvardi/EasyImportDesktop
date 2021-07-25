import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Supplier } from "src/app/_models/supplier";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AsyncValidatorFn,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SupplierParams } from "src/app/_models/SupplierParams";
import { PaginationSupplier } from "src/app/_models/PaginationGeneric";
import { SupplierService } from "src/app/_services/supplier.service";
import { timer, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";

@Component({
  selector: "app-supplier",
  templateUrl: "./supplier.component.html",
  styleUrls: ["./supplier.component.css"],
})
export class SupplierComponent implements OnInit {
  suppliers: Supplier[];
  supplier: Supplier = new Supplier();
  supplierParams = new SupplierParams();
  totalCount: number;
  pagination: PaginationSupplier;
  bsModalRef: BsModalRef;
  saveMode = "post";
  registerForm: FormGroup;
  bodyDeleteSupplier = "";
  currentSupplier: string;

  @ViewChild("search", { static: true }) searchTerm: ElementRef;
  sortOptions = [
    { name: "A - Z", value: "companyAsc" },
    { name: "Z - A", value: "companyDesc" },
  ];

  constructor(
    private supplierService: SupplierService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getSuppliers();
    this.createRegisterForm();
  }

  create(template: any) {
    this.saveMode = "post";
    this.bsModalRef = this.modalService.show(template);
    this.createRegisterForm();
  }

  edit(supplier: Supplier, template: any) {
    this.saveMode = "put";

    this.bsModalRef = this.modalService.show(template);
    this.supplier = Object.assign({}, supplier);
    this.currentSupplier = this.supplier.companyName;
    // this.registerForm.get("companyName").clearAsyncValidators();

    this.registerForm.patchValue(this.supplier);
  }

  save(template: any) {
    if (this.registerForm.valid) {
      if (this.saveMode == "post") {
        this.supplier = Object.assign({}, this.registerForm.value);

        this.supplierService.createSupplier(this.supplier).subscribe(
          () => {
            this.toastr.success("Supplier successfully registered.");
            this.bsModalRef.hide();
            this.getSuppliers();
          },
          (error) => {
            this.toastr.error("Failed to register..");
            this.bsModalRef.hide();
          }
        );
        this.registerForm.reset();
      } else {
        this.supplier = Object.assign(
          { id: this.supplier.id },
          this.registerForm.value
        );

        this.supplierService.putSupplier(this.supplier).subscribe(
          () => {
            this.toastr.success("Edited successfully");
            this.bsModalRef.hide();
            this.getSuppliers();
          },
          (error) => {
            this.toastr.error("Failed to edit");
          }
        );
      }

      this.registerForm.reset();
    }
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      companyName: [
        "",
        [Validators.required, Validators.minLength(8)],
        [this.checkIfExists()],
      ],
      email: ["", [Validators.required, Validators.email]],
      contact: ["", [Validators.required, Validators.minLength(5)]],
    });
  }

  checkIfExists(): AsyncValidatorFn {
    return (control) => {
      return timer(1).pipe(
        switchMap(() => {
          if (!control.value || this.currentSupplier == control.value) {
            return of(null);
          }
          return this.supplierService.checkIfExists(control.value).pipe(
            map((res) => {
              return res ? { exists: true } : null;
            })
          );
        })
      );
    };
  }

  delete(supplier: Supplier, template: any) {
    template.show();
    this.supplier = supplier;
    this.bodyDeleteSupplier = `Are you sure you want to delete that supplier? ${supplier.companyName}`;
  }

  confirmDelete(template: any) {
    this.supplierService.deleteSupplier(this.supplier.id).subscribe(
      () => {
        template.hide();
        this.getSuppliers();
        this.toastr.success("Successfully deleted");
      },
      (error) => {
        this.toastr.error(error.error);
        template.hide();
      }
    );
  }

  onSearch() {
    this.supplierParams.search = this.searchTerm.nativeElement.value;
    this.getSuppliers();
  }

  onReset() {
    this.searchTerm.nativeElement.value = "";
    this.supplierParams = new SupplierParams();
    this.getSuppliers();
  }

  onPageChange(event: any) {
    this.supplierParams.pageIndex = event;
    this.getSuppliers();
  }

  getSuppliers() {
    this.supplierService.getSuppliers(this.supplierParams).subscribe(
      (response: PaginationSupplier) => {
        this.suppliers = response.data;
        this.supplierParams.pageIndex = response.pageIndex;
        this.supplierParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      (error) => {}
    );
  }

  onSortSelected(sort: string) {
    this.supplierParams.sort = sort;
    this.getSuppliers();
  }
}
