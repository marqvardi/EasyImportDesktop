import { ToastrService } from "ngx-toastr";
import { Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { IBasketItem } from "./../_models/basket";
import { BasketService } from "./basket.service";
import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { IBasket } from "../_models/basket";
import { Product } from "../_models/product";
import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { defineLocale, enGbLocale } from "ngx-bootstrap/chronos";
import { deLocale } from "ngx-bootstrap/locale";
import { Supplier } from "../_models/supplier";
import { ProductService } from "../_services/product.service";
import { OrderDetails } from "../_models/OrderDetails";

@Component({
  selector: "app-basket",
  templateUrl: "./basket.component.html",
  styleUrls: ["./basket.component.css"],
})
export class BasketComponent implements OnInit {
  basket$: Observable<IBasket>;
  orderForm: FormGroup;
  locale = "en-gb";
  bsConfig: Partial<BsDatepickerConfig>;
  supplierList: Supplier[];
  orderDetails: OrderDetails;
  minDate: Date;
  defaultImage = "../../../assets/img/noimage.jpg";

  constructor(
    private basketService: BasketService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    // (this.minDate = new Date()), this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit() {
    this.getSuppliersList();
    this.basket$ = this.basketService.basket$;
    this.createOrderForm();
    this.localeService.use(this.locale);
    defineLocale("en-gb", enGbLocale);
    this.bsConfig = {
      containerClass: "theme-dark-blue",
    };
  }

  createOrderForm() {
    this.orderForm = this.fb.group({
      invoiceNumber: [""],
      supplierId: ["", Validators.required],
      referenceNumber: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(6)],
      ],
      deliveryDate: [null, [Validators.required]],
    });
  }

  save() {
    if (this.orderForm.valid) {
      this.orderDetails = Object.assign({}, this.orderForm.value);
      //  console.log(this.orderDetails);
      //console.log(this.basketService.getCurrentBasketValue());
      this.basketService.createOrder(
        this.orderDetails,
        this.basketService.getCurrentBasketValue()
      );
    }
  }

  calculateTotalTaxesForSingleItemBasket(item: IBasketItem): number {
    let ii = item.price * item.quantity * item.ii;
    let ipi =
      (item.price * item.quantity + item.price * item.quantity * item.ii) *
      item.ipi;
    let pis = item.price * item.quantity * item.pis;
    let cofins = item.price * item.quantity * item.cofins;
    let totalAmountForProduct = item.price * item.quantity;

    const totalOrderPlusTaxes = totalAmountForProduct + ii + ipi + pis + cofins;

    const baseIcms = totalOrderPlusTaxes / 0.82;

    const icms = baseIcms * 0.18;

    return ii + ipi + pis + cofins + icms;
  }

  remove(item: IBasketItem) {
    this.basketService.deleteItemFromBasket(item);
    this.toastr.success("Removed from basket");
  }

  changeQuantity(item: IBasketItem, quantity: number) {
    if (quantity <= 0) {
      this.toastr.error("Quantity must be greater than 0");
      return;
    }

    this.basketService.updateItemInbasket(item, quantity);
    this.toastr.success("Quantity changed");
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
}
