import { BasketService } from "./../../../basket/basket.service";
import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { IBasketTotals } from "src/app/_models/basket";

@Component({
  selector: "app-order-total",
  templateUrl: "./order-total.component.html",
  styleUrls: ["./order-total.component.css"],
})
export class OrderTotalComponent implements OnInit {
  basketTotal$: Observable<IBasketTotals>;

  constructor(private basketService: BasketService) { }

  ngOnInit() {
    this.basketTotal$ = this.basketService.basketTotal$;
  }
}
