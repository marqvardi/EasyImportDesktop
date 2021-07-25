import { ToastrService } from "ngx-toastr";
import { OrderHandleItem } from "./../../../_models/orderHandleItem";
import { ActivatedRoute, Router } from "@angular/router";
import {
  OrderOverview,
  OrderItemOverview,
} from "./../../../_models/OrderOverview";
import { OrderService } from "./../../../_services/order.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { defineLocale, enGbLocale } from "ngx-bootstrap/chronos";
import { Supplier } from "src/app/_models/supplier";
import { ProductService } from "src/app/_services/product.service";
import { OrderStatus } from "src/app/_models/orderStatus";
import {
  calculateAll,
  calculateTotalTaxesForSingleItem,
} from "src/app/common/calculateOrderValues";

@Component({
  selector: "app-order-overview",
  templateUrl: "./order-overview.component.html",
  styleUrls: ["./order-overview.component.css"],
})
export class OrderOverviewComponent implements OnInit {
  orderOverview: OrderOverview = new OrderOverview();
  orderForm: FormGroup;
  locale = "en-gb";
  bsConfig: Partial<BsDatepickerConfig>;
  supplierList: Supplier[];
  orderStatusList: OrderStatus[];
  id: number;
  private sub: any;
  minDate: Date;
  totalCbm: number;
  totalTaxes: number;
  totalOrder: number;
  totalKgs: number = 0;
  totalOfItems: number;
  arrivalDateSetTo = false;
  defaultImage = "../../../assets/img/noimage.jpg";

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    // (this.minDate = new Date()), this.minDate.setDate(this.minDate.getDate());
  }

  ngOnInit() {
    this.loadPage();
  }

  onChangeOrderStatus($statusValue) {
    if ($statusValue.target.value === "4: 4") {
      // var e = new Date(this.orderOverview.arrivalDate);
      // e.setMinutes(e.getMinutes() + 480);
      // this.orderOverview.arrivalDate = e;
      this.arrivalDateSetTo = true;
      return;
    } else {
      this.arrivalDateSetTo = false;
      return;
    }
  }




  loadPage() {
    this.getSuppliersList();
    this.getOrderStatusList();
    this.createOrderForm();
    this.arrivalDateSetTo = false;
    this.localeService.use(this.locale);
    defineLocale("en-gb", enGbLocale);
    this.bsConfig = {
      containerClass: "theme-dark-blue",
    };
    this.loadOrderById();
    this.orderForm.reset();
  }

  getOrderStatusList() {
    this.orderService.getOrderStatus().subscribe(
      (response: OrderStatus[]) => {
        this.orderStatusList = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createOrderForm() {
    this.orderForm = this.fb.group({
      invoiceNumber: [""],
      supplierId: ["", Validators.required],
      orderStatusId: ["", Validators.required],
      referenceNumber: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(6)],
      ],
      deliveryDate: [null, [Validators.required]],
      arrivalDate: [null],
      orderCreated: [null],
    });
  }



  loadOrderById() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = +params["id"];
      this.orderService.getOrderById(this.id).subscribe(
        (response: OrderOverview) => {
          // this.orderOverview = response;
          this.orderOverview = Object.assign({}, response);
          this.calculateOrderNumbers(this.orderOverview.orderItems);
          // this.calculateCbm(this.orderOverview.orderItems);
          // this.calculateTotalOrder(this.orderOverview.orderItems);
          // this.calculateTotalTaxes(this.orderOverview.orderItems);
          // this.calculateGrossWeight(this.orderOverview.orderItems);
          this.orderForm.patchValue(this.orderOverview);
        },
        (error) => { }
      );
    });
  }

  calculateTotalItems(orderItems: OrderItemOverview[]) {
    this.totalOfItems = orderItems.length;
  }

  async calculateOrderNumbers(orderItems: OrderItemOverview[]) {
    const orderNumbers = await calculateAll(orderItems);
    this.totalCbm = orderNumbers.totalCBM;
    this.totalKgs = orderNumbers.totalKgs;
    this.totalOrder = orderNumbers.totalOrder;
    this.totalTaxes = orderNumbers.totalTaxes;
    this.totalOfItems = orderNumbers.totalItems;
  }

  calculateGrossWeight(orderItems: OrderItemOverview[]) {
    this.totalKgs = orderItems.reduce(
      (a, b) => (b.quantity / b.qtyPerCarton) * b.grossKgs + a,
      0
    );
  }

  calculateTotalTaxes(orderItems: OrderItemOverview[]) {
    this.totalTaxes = orderItems.reduce(
      (a, b) =>
        b.price * b.quantity * b.ii +
        (b.price * b.quantity + b.price * b.quantity * b.ii) * b.ipi +
        b.price * b.quantity * b.pis +
        b.price * b.quantity * b.cofins +
        a,
      0
    );

    const totalOrderPlusTaxes = this.totalOrder + this.totalTaxes;

    const baseIcms = totalOrderPlusTaxes / 0.82;

    const icms = baseIcms * 0.18;

    this.totalTaxes = this.totalTaxes + icms;
  }

  calculateTotalTaxesForSingleItem(orderItems: OrderItemOverview): number {
    let ii = orderItems.price * orderItems.quantity * orderItems.ii;
    let ipi =
      (orderItems.price * orderItems.quantity +
        orderItems.price * orderItems.quantity * orderItems.ii) *
      orderItems.ipi;
    let pis = orderItems.price * orderItems.quantity * orderItems.pis;
    let cofins = orderItems.price * orderItems.quantity * orderItems.cofins;
    let totalAmountForProduct = orderItems.price * orderItems.quantity;

    const totalOrderPlusTaxes = totalAmountForProduct + ii + ipi + pis + cofins;

    const baseIcms = totalOrderPlusTaxes / 0.82;

    const icms = baseIcms * 0.18;

    return ii + ipi + pis + cofins + icms;
  }

  calculateTotalOrder(orderItems: OrderItemOverview[]) {
    this.totalOrder = orderItems.reduce((a, b) => b.price * b.quantity + a, 0);
  }

  calculateCbm(orderItems: OrderItemOverview[]) {
    this.totalCbm = orderItems.reduce(
      (a, b) =>
        ((b.cartonDeepness * b.cartonHeight * b.cartonWidth) / 1000000) *
        (b.quantity / b.qtyPerCarton) +
        a,
      0
    );
  }

  changeQuantity(item: OrderItemOverview, quantity: number) {
    if (quantity <= 0) {
      this.toastr.error("Quantity can not be less than zero.");
      return;
    }

    const orderHandleItem: OrderHandleItem = new OrderHandleItem();

    orderHandleItem.productId = item.productId;
    orderHandleItem.orderId = item.orderId;
    orderHandleItem.quantity = quantity;

    this.orderService.modifyItemQuantity(orderHandleItem).subscribe(
      () => {
        this.toastr.success("Item saved");
        this.orderForm.reset();

        this.ngOnInit();
      },
      (error) => {
        this.toastr.error("Failed to save.");
      }
    );
  }

  changePrice(item: OrderItemOverview, price: number) {
    if (price <= 0) {
      this.toastr.error("Price can not be less than zero.");
      return;
    }

    const orderHandleItem: OrderHandleItem = new OrderHandleItem();

    orderHandleItem.productId = item.productId;
    orderHandleItem.orderId = item.orderId;
    orderHandleItem.price = price;

    this.orderService.modifyItemPrice(orderHandleItem).subscribe(
      () => {
        this.toastr.success("Item saved");
        this.orderForm.reset();

        this.ngOnInit();
      },
      (error) => {
        this.toastr.error("Failed to save.");
      }
    );
  }

  remove(item: OrderItemOverview, orderOverview: OrderOverview) {
    const orderHandleItem: OrderHandleItem = new OrderHandleItem();
    orderHandleItem.orderId = item.orderId;
    orderHandleItem.productId = item.productId;

    this.orderService.deleteItemInOrder(item).subscribe(
      () => {
        this.toastr.success("Item deleted");
        if (orderOverview.orderItems.length == 1) {
          this.orderService.deleteOrder(orderOverview.id).subscribe(() => {
            this.router.navigateByUrl("/order");
            this.toastr.warning("Orderm deleted.");
          });
        } else {
          this.orderForm.reset();
          this.ngOnInit();
        }
      },
      (error) => {
        this.toastr.error("Failed to delete item.");
      }
    );
  }

  save() {
    this.orderOverview = Object.assign(
      { id: this.orderOverview.id },
      this.orderForm.value
    );

    var d = new Date(this.orderOverview.deliveryDate);
    d.setMinutes(d.getMinutes() + 480);
    this.orderOverview.deliveryDate = d;

    if (this.orderOverview.orderStatusId === 4) {
      var e = new Date(this.orderOverview.arrivalDate);
      e.setMinutes(e.getMinutes() + 0);
      this.orderOverview.arrivalDate = e;
    } else {
      this.orderOverview.arrivalDate = null;
    }

    this.orderService.editExporterDetails(this.orderOverview).subscribe(
      () => {
        this.toastr.success("Details updated");
        this.orderForm.reset();
        this.router.navigateByUrl("/order");
        // this.ngOnInit();
      },
      (error) => { }
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
}
