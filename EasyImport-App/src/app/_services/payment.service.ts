import { OrderParams } from "src/app/_models/OrderParams";
import { environment } from "../../environments/environment";
import { OrderDetails } from "../_models/OrderDetails";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaginationOrder } from "../_models/PaginationGeneric";
import { map } from "rxjs/operators";
import { PaymentParams } from "../_models/PaymentParams";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  baseUrl = environment.apiUrl;
  orders: OrderDetails[] = [];
  pagination = new PaginationOrder();

  constructor(private http: HttpClient) {}

  updatePaymentDetails(order: OrderDetails) {
    return this.http.post(this.baseUrl + "payment", order);
  }

  getPayments(paymentParams: PaymentParams) {
    let params = new HttpParams();

    if (paymentParams.search) {
      params = params.append("search", paymentParams.search);
    }

    params = params.append("sort", paymentParams.sort);
    params = params.append("pageIndex", paymentParams.pageIndex.toString());
    params = params.append("pageSize", paymentParams.pageSize.toString());

    return this.http
      .get<PaginationOrder>(this.baseUrl + "payment", {
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
