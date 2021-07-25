import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { OrderHandleItem } from "./../../_models/orderHandleItem";
import { OrderService } from "./../../_services/order.service";
import { ProductService } from "src/app/_services/product.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Product } from "src/app/_models/product";
import { ProductListForOrder } from "src/app/_models/productListForOrder";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { OrderOverview } from "src/app/_models/OrderOverview";

@Component({
  selector: "app-addItemToOrder",
  templateUrl: "./addItemToOrder.component.html",
  styleUrls: ["./addItemToOrder.component.css"],
})
export class AddItemToOrderComponent implements OnInit {
  selectedValue: string;
  selectedOption: any;
  products: ProductListForOrder[];
  product: any;
  @Input() orderOverview: OrderOverview;
  @Input() form: FormGroup;
  @Output() reloadOrder = new EventEmitter();
  defaultImage = "../../../assets/img/noimage.jpg";

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  reloadOrderOnParent() {
    this.reloadOrder.emit();
    this.form.reset();
  }

  getProducts() {
    this.productService.getProductListForOrder().subscribe(
      (response: ProductListForOrder[]) => {
        this.products = response;
        // console.log(this.products);
      },
      (error) => { }
    );
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    this.product = event.item;
    // console.log("product", this.product);
    // console.log("Order", this.orderOverview);
  }

  addItemToOrder(quantity: number, product: Product) {
    if (quantity <= 0) {
      this.toastr.error("Enter a positive number");
      return;
    }

    const order = new OrderHandleItem();
    order.orderId = this.orderOverview.id;
    order.productId = product.id;
    order.quantity = quantity;

    this.orderService.addItemIntoOrder(order).subscribe(
      () => {
        this.toastr.success("Item added.");
        this.product = null;
        this.selectedValue = ''
        this.reloadOrderOnParent();
      },
      (error) => {
        this.toastr.error(error.error);
      }
    );
  }
}
