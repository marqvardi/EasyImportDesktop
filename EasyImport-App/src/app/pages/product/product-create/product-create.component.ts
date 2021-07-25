import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AsyncValidatorFn,
} from "@angular/forms";
import { Ncm } from "src/app/_models/ncm";
import { Supplier } from "src/app/_models/supplier";
import { Category } from "src/app/_models/category";
import { Product } from "src/app/_models/product";
import { ProductService } from "src/app/_services/product.service";
import { ToastrService } from "ngx-toastr";
import { timer, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";

@Component({
  selector: "app-product-create",
  templateUrl: "./product-create.component.html",
  styleUrls: ["./product-create.component.css"],
})
export class ProductCreateComponent implements OnInit {
  registerForm: FormGroup;
  ncmList: Ncm[];
  supplierList: Supplier[];
  categoriesList: Category[];
  product: Product = new Product();
  @Output() productCreated: EventEmitter<any> = new EventEmitter<any>();
  @Output() getProducts: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.createRegisterForm();
    this.getCategoryList();
    this.getNcmsList();
    this.getSuppliersList();
  }

  save() {
    //console.log(this.registerForm.value);

    if (this.registerForm.valid) {
      this.product = Object.assign({}, this.registerForm.value);
      this.productService.createProduct(this.product).subscribe(
        () => {
          this.toastr.success("Product created successfuly");
          this.productCreated.emit();
          this.getProducts.emit();
          this.registerForm.reset();
        },
        (error) => {
          this.toastr.error("Error when creating a product");
        }
      );
    }
  }

  getCategoryList() {
    this.productService.getCategoryList().subscribe(
      (response: any) => {
        this.categoriesList = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getNcmsList() {
    this.productService.getNcmsList().subscribe(
      (response: any) => {
        this.ncmList = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSuppliersList() {
    this.productService.getSuppliersList().subscribe(
      (response: any) => {
        this.supplierList = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      productCode: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
        [this.checkIfExists()],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(150),
        ],
      ],
      active: [true],
      image: [""],
      cartonWidth: [0, [Validators.min(0), Validators.max(500)]],
      cartonHeight: [0, [Validators.min(0), Validators.max(500)]],
      cartonDeepness: [0, [Validators.min(0), Validators.max(500)]],
      netKgs: [0, [Validators.min(0), Validators.max(5000)]],
      grossKgs: [0, [Validators.min(0), Validators.max(5000)]],
      price: [0, [Validators.min(0), Validators.max(50000)]],
      qtyPerCarton: [0, [Validators.min(0), Validators.max(50000)]],
      supplierId: ["", Validators.required],
      categoryId: ["", Validators.required],
      ncmId: ["", Validators.required],
    });
  }

  checkIfExists(): AsyncValidatorFn {
    return (control) => {
      return timer(1).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.productService.checkIfExists(control.value).pipe(
            map((res) => {
              return res ? { exists: true } : null;
            })
          );
        })
      );
    };
  }
}
