import { Product } from "./../../_models/product";
import { ToastrService } from "ngx-toastr";
import { ProductService } from "./../../_services/product.service";
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  ElementRef,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";

import { BsModalService, ModalDirective } from "ngx-bootstrap/modal";
import { PaginationProduct } from "src/app/_models/PaginationGeneric";
import { ProductParams } from "src/app/_models/ProductParams";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit {
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  products: Product[];

  product: Product = new Product();
  productParams = new ProductParams();
  totalCount: number;
  pagination: PaginationProduct;
  @ViewChild("search", { static: true }) searchTerm: ElementRef;

  //bsModalRef: BsModalRef;
  //saveMode = "post";
  //registerForm: FormGroup;

  sortOptions = [
    { name: "By code: A to Z", value: "productAsc" },
    { name: "By code: Z to A", value: "productDesc" },
    { name: "Price: Asc", value: "priceAsc" },
    { name: "Price: Desc", value: "priceDesc" },
  ];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getProducts();
  }

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  getProducts() {
    this.productService.getProducts(this.productParams).subscribe(
      (response: PaginationProduct) => {
        this.products = response.data;
        this.productParams.pageIndex = response.pageIndex;
        this.productParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSearch() {
    this.productParams.search = this.searchTerm.nativeElement.value;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = "";
    this.productParams = new ProductParams();
    this.getProducts();
  }

  onPageChange(event: any) {
    this.productParams.pageIndex = event;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    this.productParams.sort = sort;
    this.getProducts();
  }
}
