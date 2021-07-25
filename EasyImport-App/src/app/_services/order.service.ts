import { OrderHandleItem } from "./../_models/orderHandleItem";
import { OrderOverview } from "./../_models/OrderOverview";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { OrderParams } from "./../_models/OrderParams";
import { PaginationOrder } from "./../_models/PaginationGeneric";
import { OrderDetails } from "./../_models/OrderDetails";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  baseUrl = environment.apiUrl;
  order: OrderDetails;
  orders: OrderDetails[] = [];
  pagination = new PaginationOrder();
  orderOverview: OrderOverview;

  constructor(private http: HttpClient) {}

  getOrderById(id: number) {
    return this.http.get(this.baseUrl + "orders/" + id);
  }

  getOrderStatus() {
    return this.http.get(this.baseUrl + "orders/getOrderStatus");
  }

  addItemIntoOrder(order: OrderHandleItem) {
    return this.http.post(this.baseUrl + "orders/addItem", order);
  }

  editExporterDetails(order: OrderOverview) {
    return this.http.put(this.baseUrl + "orders", order);
  }

  deleteItemInOrder(orderHandleItem: OrderHandleItem) {
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
      body: orderHandleItem,
    };
    return this.http.delete(this.baseUrl + "orders/deleteItem", options);
  }

  modifyItemPrice(orderHandleItem: OrderHandleItem) {
    return this.http.post(
      this.baseUrl + "orders/ModifyItemPrice",
      orderHandleItem
    );
  }

  modifyItemQuantity(orderHandleItem: OrderHandleItem) {
    return this.http.post(
      this.baseUrl + "orders/ModifyItemQuantity",
      orderHandleItem
    );
  }

  deleteOrder(id: number) {
    return this.http.delete(this.baseUrl + "orders/" + id);
  }

  getOrders(OrderParams: OrderParams) {
    let params = new HttpParams();

    if (OrderParams.search) {
      params = params.append("search", OrderParams.search);
    }

    params = params.append("sort", OrderParams.sort);
    params = params.append("pageIndex", OrderParams.pageIndex.toString());
    params = params.append("pageSize", OrderParams.pageSize.toString());
    params = params.append(
      "orderStatusId",
      OrderParams.orderStatusId.toString()
    );

    return this.http
      .get<PaginationOrder>(this.baseUrl + "orders", {
        observe: "response",
        params,
      })
      .pipe(
        map((response) => {
          this.orders = [...this.orders, ...response.body.data];
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }
}
