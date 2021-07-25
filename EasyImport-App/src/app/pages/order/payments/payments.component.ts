import { ToastrService } from "ngx-toastr";
import { PaymentService } from "../../../_services/payment.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { OrderDetails } from "src/app/_models/OrderDetails";
import { OrderParams } from "src/app/_models/OrderParams";
import { BsDatepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { defineLocale } from "ngx-bootstrap/chronos";
import { enGbLocale } from "ngx-bootstrap/locale";
import { PaginationOrder } from "src/app/_models/PaginationGeneric";
import { orderStatusList } from "src/app/_models/orderStatus";
import { PaymentParams } from "src/app/_models/PaymentParams";

@Component({
  selector: "app-teste",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"],
})
export class PaymentsComponent implements OnInit {
  orders: OrderDetails[];
  order: OrderDetails;
  paymentParams = new PaymentParams();
  totalAmountForAllOrders: number = 0;
  totalAmountPaidForAllOrders: number = 0;
  totalCount: number;
  bsConfig: Partial<BsDatepickerConfig>;
  locale = "en-gb";
  amountToPay: number = 0;
  amountPaid: number = 0;

  show = false;

  @ViewChild("search", { static: true }) searchTerm: ElementRef;
  sortOptions = [
    { name: "Pending payment", value: "pending" },
    { name: "Completed payment", value: "done" },
  ];

  constructor(
    private localeService: BsLocaleService,
    private paymentService: PaymentService,
    private toast: ToastrService
  ) {}

  loadCalendar() {
    this.localeService.use(this.locale);
    defineLocale("en-gb", enGbLocale);
    this.bsConfig = {
      containerClass: "theme-dark-blue",
    };
  }

  onSortSelected(sort: string) {
    this.paymentParams.sort = sort;
    this.getOrders();
    this.amountPaid = 0;
    this.amountToPay = 0;
    this.totalAmountForAllOrders = 0;
    // this.totalAmountForTaxesAllOrders = 0;
  }

  onSearch() {
    this.paymentParams.search = this.searchTerm.nativeElement.value;
    this.getOrders();
  }

  onReset() {
    this.searchTerm.nativeElement.value = "";
    this.paymentParams = new PaymentParams();
    this.getOrders();
  }

  onPageChange(event: any) {
    this.paymentParams.pageIndex = event;
    this.getOrders();
  }

  // checkAmountPaidAndToPay() {
  //   this.amountPaid = 0;
  //   this.orders.forEach((element) => {
  //     if (element.depositPaid === true) {
  //       this.amountPaid += element.depositAmount;
  //     } else {
  //       this.amountToPay += element.depositAmount;
  //     }

  //     if (element.balancePaid === true) {
  //       this.amountPaid += element.balanceAmount;
  //     } else {
  //       this.amountToPay += element.balanceAmount;
  //     }
  //   });
  // }

  editOrder(order: OrderDetails) {
    order.editable = !order.editable;

    if (order.editable === false) {
      this.paymentService.updatePaymentDetails(order).subscribe(
        () => {
          this.toast.success("Payment updated");
          this.ngOnInit();
        },
        (error) => {
          this.toast.error("Error when updating.");
        }
      );
    } else {
      // console.log("Edit");
    }
  }

  ngOnInit() {
    this.loadCalendar();
    this.amountPaid = 0;
    this.amountToPay = 0;
    this.totalAmountForAllOrders = 0;
    this.getOrders();

    // this.checkAmountPaidAndToPay();
    // console.log("paid: ", this.amountPaid);
    // console.log("to pay: ", this.amountToPay);
  }

  getOrders() {
    this.paymentService.getPayments(this.paymentParams).subscribe(
      (response: PaginationOrder) => {
        this.orders = response.data;

        // this.orders = this.orders.filter(
        //   (check) => !check.balancePaid || !check.depositPaid
        // );

        // this.orders.forEach((element) => {
        //   if (
        //     element.dateBalancePaid !== null ||
        //     element.dateDepositPaid !== null
        //   ) {
        //     // const date = element.dateDepositPaid.toISOString().split("T")[0];
        //     // element.dateDepositPaid = date;
        //     // const dateDeposit = combineDate(element.dateDepositPaid);
        //     // element.dateDepositPaid = dateDeposit;
        //     // console.log(dateDeposit);

        //     // const date = element.dateDepositPaid.getDate();
        //     // const month = element.dateDepositPaid.getMonth();
        //     // const year = element.dateDepositPaid.getFullYear();
        //     // const fullDateString = `"${date}/${month}/${year}"`;
        //     // var dt = new Date(fullDateString);
        //     // element.dateBalancePaid = dt;
        //     // console.log("date string", fullDateString);
        //     // console.log("date date", dt);
        //   }
        // });

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
          // this.totalAmountForAllOrders += element.total;
          element.cbm = element.orderItems.reduce(
            (a, b) =>
              ((b.cartonDeepness * b.cartonHeight * b.cartonWidth) / 1000000) *
                (b.quantity / b.qtyPerCarton) +
              a,
            0
          );
        });
        this.paymentParams.pageIndex = response.pageIndex;
        this.paymentParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        this.totalAmountPaidForAllOrders =
          response.totalValuesForOrders.totalValuePaid;
        this.totalAmountForAllOrders =
          response.totalValuesForOrders.totalValueForAllOrders;
        // this.checkAmountPaidAndToPay();
      },
      (error) => {}
    );
  }
}
