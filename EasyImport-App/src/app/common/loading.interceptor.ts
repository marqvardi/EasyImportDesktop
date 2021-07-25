import { BusyService } from "./busy.service";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { delay, finalize } from "rxjs/operators";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private busyService: BusyService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes("orders/orderItem/")) {
      return next.handle(req);
    }

    if (req.url.includes("supplier/supplierList")) {
      return next.handle(req);
    }

    if (req.url.includes("orders/getOrderStatus")) {
      return next.handle(req);
    }

    if (req.url.includes("product/exists?name=")) {
      return next.handle(req);
    }

    if (req.url.includes("categories/exists?name=")) {
      return next.handle(req);
    }

    if (req.url.includes("supplier/exists?name=")) {
      return next.handle(req);
    }

    if (req.url.includes("ncm/exists?name=")) {
      return next.handle(req);
    }

    this.busyService.busy();
    return next.handle(req).pipe(
      // delay(3000),
      finalize(() => {
        this.busyService.idle();
      })
    );
  }
}
