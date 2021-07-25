import { OrderTotalComponent } from "./../pages/order/order-total/order-total.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BasketComponent } from "./basket.component";

@NgModule({
  imports: [CommonModule, RouterModule],

  declarations: [BasketComponent, OrderTotalComponent],
  exports: [BasketModule],
})
export class BasketModule {}
