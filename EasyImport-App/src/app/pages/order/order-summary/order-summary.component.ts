import { Component, OnInit, Input } from "@angular/core";
import {
  OrderItemOverview,
  OrderOverview,
} from "src/app/_models/OrderOverview";

@Component({
  selector: "app-order-summary",
  templateUrl: "./order-summary.component.html",
  styleUrls: ["./order-summary.component.scss"],
})
export class OrderSummaryComponent implements OnInit {
  totalCbm: number;
  totalTaxes: number;
  totalOrder: number;
  totalKgs: number = 0;

  @Input() orderOverview: OrderOverview;

  constructor() { }

  ngOnInit() {
    this.calculateCbm(this.orderOverview.orderItems);
    this.calculateTotalOrder(this.orderOverview.orderItems);
    this.calculateTotalTaxes(this.orderOverview.orderItems);
    this.calculateGrossWeight(this.orderOverview.orderItems);
  }

  ngOnChanges() {
    this.calculateCbm(this.orderOverview.orderItems);
    this.calculateTotalOrder(this.orderOverview.orderItems);
    this.calculateTotalTaxes(this.orderOverview.orderItems);
    this.calculateGrossWeight(this.orderOverview.orderItems);
    // this.calculateTotalItems(this.orderOverview.orderItems)
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
        b.price * b.quantity * b.pis +
        b.price * b.quantity * b.cofins +
        a,
      0
    );
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
}
