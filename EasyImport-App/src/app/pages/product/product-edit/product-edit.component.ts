import { AuthService } from "src/app/_services/auth.service";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Product } from "src/app/_models/product";
import { ActivatedRoute } from "@angular/router";
import { Ncm } from "src/app/_models/ncm";
import { Supplier } from "src/app/_models/supplier";
import { Category } from "src/app/_models/category";
import { ProductService } from "src/app/_services/product.service";
import {
  NgForm,
  FormBuilder,
  FormGroup,
  Validators,
  AsyncValidatorFn,
} from "@angular/forms";
import { timer, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { PhotoService } from "src/app/_services/photo.service";
import { FileUploader } from "ng2-file-upload";
import { Photo } from "src/app/_models/photo";
import { PriceEvolution } from "src/app/_models/PriceEvolution";

@Component({
  selector: "app-product",
  templateUrl: "./product-edit.component.html",
  styleUrls: ["./product-edit.component.css"],
})
export class ProductEditComponent implements OnInit {
  product = new Product();
  ncmList: Ncm[];
  supplierList: Supplier[];
  categoriesList: Category[];
  editForm: FormGroup;
  currentProductCode: string;
  @ViewChild("fileInput") fileInput: ElementRef;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  response: string;
  baseUrl = environment.apiUrl;
  userId = localStorage.getItem("userId");
  id: number;
  private sub: any;
  supplierSelected: string;
  priceEvolutionList: PriceEvolution;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private photoService: PhotoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getCategoryList();
    this.getSuppliersList();
    this.getNcmsList();
    this.validation();
    this.loadProduct();
    this.initializeUploader();
    this.getPriceEvolutionPerProduct();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        "product/" +
        localStorage.getItem("userId") +
        "/" +
        this.id +
        "/photos",
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
        this.product.image = photo.url;
        this.editForm.patchValue({ image: this.product.image });
      }
    };
  }

  // uploadPhoto() {
  //   var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
  //   this.photoService
  //     .upload(this.product.id, nativeElement.files[0])
  //     .subscribe((x) => console.log(x));
  // }

  getPriceEvolutionPerProduct() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.productService
        .getPriceEvolutionPerProduct(this.id)
        .subscribe((priceEvolution: PriceEvolution) => {
          this.priceEvolutionList = priceEvolution;
        });
    });
  }

  loadProduct() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.productService.getProductById(this.id).subscribe(
        (product: Product) => {
          this.product = Object.assign({}, product);
          this.currentProductCode = this.product.productCode;
          this.supplierSelected = this.product.supplierName;
          //this.editForm.get("productCode").clearAsyncValidators();
          this.editForm.patchValue(this.product);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  validation() {
    this.editForm = this.fb.group({
      id: [],
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
      image: [],
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
          if (!control.value || this.currentProductCode == control.value) {
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

  updateProduct(product: Product) {
    console.log(product);
    this.productService.editProduct(product).subscribe(
      () => {
        this.toastr.success("Successfuly updated");
        // this.editForm.reset();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  save() {
    this.product = Object.assign({ id: this.product.id }, this.editForm.value);

    this.productService.editProduct(this.product).subscribe(
      () => {
        this.toastr.success("Updated successfuly.");
      },
      (error) => {
        this.toastr.error(error);
      }
    );
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

  getProduct(id: number) {
    this.productService.getProductById(id).subscribe(
      (response: any) => {
        this.product = response;
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }
}
