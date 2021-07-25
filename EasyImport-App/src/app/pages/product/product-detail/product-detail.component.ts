import { BasketService } from "./../../../basket/basket.service";
import { Component, OnInit, Input } from "@angular/core";
import { Product } from "src/app/_models/product";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.css"],
})
export class ProductDetailComponent implements OnInit {
  @Input() products: Product[];
  product: Product;
  quantity: number = 0;
  defaultImage = "../../../assets/img/noimage.jpg";

  constructor(private basketService: BasketService) {}

  ngOnInit() {}

  addItemToBasket(product: Product, quantity: number) {
    this.basketService.addItemToBasket(product, quantity);
  }
}
