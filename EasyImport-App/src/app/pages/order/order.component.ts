import { ToastrService } from "ngx-toastr";
import { OrderService } from "./../../_services/order.service";
import { OrderDetails } from "./../../_models/OrderDetails";
import { OrderParams } from "./../../_models/OrderParams";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
} from "@angular/core";
import { PaginationOrder } from "src/app/_models/PaginationGeneric";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { orderStatusList } from "src/app/_models/orderStatus";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  bodyDelete = "";
  modalRef: BsModalRef;
  totalAmountForAllOrders: number = 0;
  totalAmountForTaxesAllOrders: number = 0;

  totalValueForAllOrders: number;
  totalTaxesValueForAllOrders: number;

  orderParams = new OrderParams();
  order: OrderDetails;
  orders: OrderDetails[];
  pagination: PaginationOrder;
  totalCount: number;
  showArrivalDate = false;
  @ViewChild("search", { static: true }) searchTerm: ElementRef;
  sortOptions = [
    { name: "Delivery date: Asc", value: "deliveryDateAsc" },
    { name: "Delivery date: Desc", value: "deliveryDateDesc" },
    { name: "Supplier: A to Z", value: "supplierAsc" },
    { name: "Supplier: Z to A", value: "supplierDesc" },
    { name: "Order completed: Asc date", value: "arrivalDateAsc" },
    { name: "Order completed: Desc date", value: "arrivalDateDesc" },
  ];

  constructor(
    private orderService: OrderService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    if (
      this.orderParams.sort === "arrivalDateAsc" ||
      this.orderParams.sort === "arrivalDateDesc"
    ) {
      this.orderParams.orderStatusId = 4;
      this.showArrivalDate = true;
    } else {
      this.showArrivalDate = false;
    }
    this.totalAmountForAllOrders = 0;
    this.totalAmountForTaxesAllOrders = 0;

    this.orderService.getOrders(this.orderParams).subscribe(
      (response: PaginationOrder) => {
        this.orders = response.data;
        this.orders.forEach((element) => {
          const orderstatus = orderStatusList.filter(
            (x) => x.id === element.orderStatusId
          )[0];
          element.orderStatusName = orderstatus.status;
        });

        this.orders.forEach((element) => {
          element.total = element.orderItems.reduce(
            (a, b) => b.price * b.quantity + a,
            0
          );
          this.totalAmountForAllOrders += element.total;

          this.totalValueForAllOrders = response.totalValueForAllOrders;
          this.totalTaxesValueForAllOrders =
            response.totalTaxesValueForAllOrders;

          element.cbm = element.orderItems.reduce(
            (a, b) =>
              ((b.cartonDeepness * b.cartonHeight * b.cartonWidth) / 1000000) *
                (b.quantity / b.qtyPerCarton) +
              a,
            0
          );

          element.totalTaxes = element.orderItems.reduce(
            (a, b) =>
              b.price * b.quantity * b.ii +
              (b.price * b.quantity + b.price * b.quantity * b.ii) * b.ipi +
              b.price * b.quantity * b.pis +
              b.price * b.quantity * b.cofins +
              a,
            0
          );

          let totalOrderPlusTotalTaxes = element.totalTaxes + element.total;
          let baseIcms = totalOrderPlusTotalTaxes / 0.82;
          let icms = baseIcms * 0.18;
          element.totalTaxes += icms;

          this.totalAmountForTaxesAllOrders += element.totalTaxes;
        });

        this.orderParams.pageIndex = response.pageIndex;
        this.orderParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        this.orderParams.orderStatusId = 1;
        // console.log("Order from getOrders: ", this.orders);
      },
      (error) => {}
    );
  }

  calculateWithIcms(
    totalAmountForAllOrders: number,
    totalAmountForTaxesAllOrders: number
  ): number {
    const totalOrderPlusTaxes =
      totalAmountForAllOrders + totalAmountForTaxesAllOrders;

    const baseIcms = totalOrderPlusTaxes / 0.82;

    const icms = baseIcms * 0.18;

    totalAmountForTaxesAllOrders += icms;

    return totalAmountForTaxesAllOrders;
  }

  confirmDelete(order: OrderDetails, template: any) {
    this.orderService.deleteOrder(order.id).subscribe(
      () => {
        template.hide();
        this.getOrders();
        this.toastr.success("Successfully deleted");
      },
      (error) => {
        this.toastr.error(error.error);
        template.hide();
        this.toastr.error("Failed to delete order.");
      }
    );
  }

  delete(order: OrderDetails, template: any) {
    template.show();
    this.order = order;
    this.bodyDelete = `Are you sure you want to delete that order? ${order.referenceNumber}`;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onSearch() {
    this.orderParams.search = this.searchTerm.nativeElement.value;
    this.getOrders();
  }

  onReset() {
    this.searchTerm.nativeElement.value = "";
    this.orderParams = new OrderParams();
    this.getOrders();
  }

  onSortSelected(sort: string) {
    this.orderParams.sort = sort;
    this.getOrders();
    this.totalAmountForAllOrders = 0;
    this.totalAmountForTaxesAllOrders = 0;
  }

  onPageChange(event: any) {
    this.orderParams.pageIndex = event;
    this.getOrders();
  }
}
