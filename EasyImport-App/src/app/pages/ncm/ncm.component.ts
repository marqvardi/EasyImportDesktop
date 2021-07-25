import { Ncm } from "./../../_models/ncm";
import { BsModalRef } from "ngx-bootstrap/modal";
import { PaginationNcm } from "./../../_models/PaginationGeneric";
import { NcmParams } from "./../../_models/NcmParams";
import { ToastrService } from "ngx-toastr";
import { NcmService } from "./../../_services/ncm.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AsyncValidatorFn,
} from "@angular/forms";
import { timer, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";

@Component({
  selector: "app-ncm",
  templateUrl: "./ncm.component.html",
  styleUrls: ["./ncm.component.scss"],
})
export class NcmComponent implements OnInit {
  ncms: Ncm[];
  ncm: Ncm = new Ncm();
  ncmParams = new NcmParams();
  totalCount: number;
  pagination: PaginationNcm;
  bsModalRef: BsModalRef;
  saveMode = "post";
  registerForm: FormGroup;
  bodyDeleteNcm = "";
  currentNCM: string;

  @ViewChild("search", { static: true }) searchTerm: ElementRef;
  sortOptions = [
    { name: "Asc", value: "ncmAsc" },
    { name: "Desc", value: "ncmDesc" },
  ];

  constructor(
    private ncmService: NcmService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getNcms();
    this.createRegisterForm();
  }

  create(template: any) {
    this.saveMode = "post";
    this.bsModalRef = this.modalService.show(template);
    this.createRegisterForm();
  }

  edit(ncm: Ncm, template: any) {
    (this.saveMode = "put"), (ncm.ii = ncm.ii * 100);
    ncm.ipi = ncm.ipi * 100;
    ncm.pis = ncm.pis * 100;
    ncm.cofins = ncm.cofins * 100;

    this.bsModalRef = this.modalService.show(template);
    this.ncm = Object.assign({}, ncm);
    this.currentNCM = this.ncm.ncmCode;

    //this.registerForm.get("ncmCode").clearAsyncValidators();

    this.registerForm.patchValue(this.ncm);
  }

  save(template: any) {
    if (this.registerForm.valid) {
      if (this.saveMode == "post") {
        this.ncm = Object.assign({}, this.registerForm.value);
        this.ncm.ii = this.ncm.ii / 100;
        this.ncm.ipi = this.ncm.ipi / 100;
        this.ncm.pis = this.ncm.pis / 100;
        this.ncm.cofins = this.ncm.cofins / 100;

        this.ncmService.createNcm(this.ncm).subscribe(
          () => {
            this.toastr.success("NCM successfully registered.");
            this.bsModalRef.hide();
            this.getNcms();
          },
          (error) => {
            this.toastr.error("Failed to register..");
            this.bsModalRef.hide();
          }
        );
        this.registerForm.reset();
      } else {
        this.ncm = Object.assign({ id: this.ncm.id }, this.registerForm.value);
        this.ncm.ii = this.ncm.ii / 100;
        this.ncm.ipi = this.ncm.ipi / 100;
        this.ncm.pis = this.ncm.pis / 100;
        this.ncm.cofins = this.ncm.cofins / 100;
        this.ncmService.putNcm(this.ncm).subscribe(
          () => {
            this.toastr.success("Edited successfully");
            this.bsModalRef.hide();
            this.getNcms();
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
      ncmCode: [
        "",
        [Validators.required, Validators.minLength(8)],
        [this.checkIfExists()],
      ],
      ii: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      ipi: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      pis: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      cofins: [
        "",
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  checkIfExists(): AsyncValidatorFn {
    return (control) => {
      return timer(1).pipe(
        switchMap(() => {
          if (!control.value || this.currentNCM == control.value) {
            return of(null);
          }
          return this.ncmService.checkIfExists(control.value).pipe(
            map((res) => {
              return res ? { exists: true } : null;
            })
          );
        })
      );
    };
  }

  delete(ncm: Ncm, template: any) {
    template.show();
    this.ncm = ncm;
    this.bodyDeleteNcm = `Are you sure you want to delete that NCM? ${ncm.ncmCode}`;
  }

  confirmDelete(template: any) {
    this.ncmService.deleteNcm(this.ncm.id).subscribe(
      () => {
        template.hide();
        this.getNcms();
        this.toastr.success("Successfully deleted");
      },
      (error) => {
        this.toastr.error(error.error);
        template.hide();
      }
    );
  }

  onSearch() {
    this.ncmParams.search = this.searchTerm.nativeElement.value;
    this.getNcms();
  }

  onReset() {
    this.searchTerm.nativeElement.value = "";
    this.ncmParams = new NcmParams();
    this.getNcms();
  }

  onPageChange(event: any) {
    this.ncmParams.pageIndex = event;
    this.getNcms();
  }

  getNcms() {
    this.ncmService.getNcms(this.ncmParams).subscribe(
      (response: PaginationNcm) => {
        this.ncms = response.data;
        this.ncmParams.pageIndex = response.pageIndex;
        this.ncmParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      (error) => {}
    );
  }

  onSortSelected(sort: string) {
    this.ncmParams.sort = sort;
    this.getNcms();
  }
}
