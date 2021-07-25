import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IBasket } from "src/app/_models/basket";
import { ProductService } from "src/app/_services/product.service";
import { IBasketItem, Basket, IBasketTotals } from "./../_models/basket";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Product } from "../_models/product";
import { OrderDetails } from "../_models/OrderDetails";
import { Order } from "../_models/order";

@Injectable({
  providedIn: "root",
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  createOrder(orderDetails: OrderDetails, basket: IBasket) {
    const order = new Order();
    order.basket = basket;
    order.orderDetails = orderDetails;
    return this.http.post(this.baseUrl + "orders", order).subscribe(
      () => {
        localStorage.removeItem("basket_id");
        this.router.navigateByUrl("/order");
        this.deleteBasket(basket);
        this.toastr.success("Order created.");
        // console.log("Before submit: ", order.orderDetails.deliveryDate);
        // console.log("Sucess from createOrder in BasketService");
      },
      (error) => {
        // console.log("Error in basketService");
      }
    );
  }

  getBasket(id: string) {
    return this.http.get(this.baseUrl + "basket?id=" + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
        // console.log("getting basketId", this.getCurrentBasketValue());
      })
    );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + "basket", basket).subscribe(
      (response: IBasket) => {
        this.basketSource.next(response);
        this.calculateTotals();
        // console.log("Setting basket :", response);
      },
      (error) => {
        // console.log(error);
      }
    );
  }

  deleteItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some((x) => x.productId === item.productId)) {
      basket.items = basket.items.filter((i) => i.productId != item.productId);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem("basket_id");
    this.http.delete(this.baseUrl + "basket?id=" + basket.id).subscribe(() => {
      // console.log("basket deleted:", basket.id);
    });
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: Product, quantity: number) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
      item,
      quantity
    );
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
    this.toastr.success("Item added to cart.");
  }

  updateItemInbasket(item: IBasketItem, quantity: number) {
    const basket = this.getCurrentBasketValue();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);
    this.setBasket(basket);
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const total = basket.items.reduce((a, b) => b.price * b.quantity + a, 0);
    const taxesWithoutICMS = basket.items.reduce(
      (a, b) =>
        b.price * b.quantity * b.ii +
        b.price * b.quantity * b.pis +
        (b.price * b.quantity + b.price * b.quantity * b.ii) * b.ipi +
        b.price * b.quantity * b.cofins +
        a,
      0
    );

    const totalOrderPlusTaxes = total + taxesWithoutICMS;
    const baseIcms = totalOrderPlusTaxes / 0.82;
    const icms = baseIcms * 0.18;

    const taxes = taxesWithoutICMS + icms;

    const cbm = basket.items.reduce(
      (a, b) =>
        ((b.cartonDeepness * b.cartonHeight * b.cartonWidth) / 1000000) *
        (b.quantity / b.qtyPerCarton) +
        a,
      0
    );

    const totalGrossKgs = basket.items.reduce(
      (a, b) => (b.quantity / b.qtyPerCarton) * b.grossKgs + a,
      0
    );

    const totalItems = basket.items.length

    this.basketTotalSource.next({ cbm, taxes, total, totalGrossKgs, totalItems });
  }

  private addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = items.findIndex((i) => i.productId === itemToAdd.productId);

    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity = quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem("basket_id", basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(
    item: Product,
    quantity: number
  ): IBasketItem {
    const ret = {
      //id: item.id,
      productId: item.id,
      productCode: item.productCode,
      supplierId: item.supplierId,
      price: item.price,
      pictureUrl: item.image,
      grossKgs: item.grossKgs,
      quantity,
      category: item.categoryName,
      ncm: item.ncmCode,
      supplier: item.supplierName,
      description: item.description,
      cartonDeepness: item.cartonDeepness,
      cartonHeight: item.cartonHeight,
      cartonWidth: item.cartonWidth,
      qtyPerCarton: item.qtyPerCarton,
      ipi: item.ipi,
      ii: item.ii,
      pis: item.pis,
      cofins: item.cofins,
    };

    return ret;
  }
}
