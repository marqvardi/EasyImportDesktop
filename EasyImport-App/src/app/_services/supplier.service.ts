import { Supplier } from "./../_models/supplier";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginationSupplier } from "../_models/PaginationGeneric";
import { SupplierParams } from "../_models/SupplierParams";

@Injectable({
  providedIn: "root",
})
export class SupplierService {
  baseUrl = environment.apiUrl;
  suppliers: Supplier[] = [];
  pagination = new PaginationSupplier();

  constructor(private http: HttpClient) {}

  getSuppliers(supplierParams: SupplierParams) {
    let params = new HttpParams();

    if (supplierParams.search) {
      params = params.append("search", supplierParams.search);
    }

    params = params.append("sort", supplierParams.sort);
    params = params.append("pageIndex", supplierParams.pageIndex.toString());
    params = params.append("pageSize", supplierParams.pageSize.toString());

    return this.http
      .get<PaginationSupplier>(this.baseUrl + "supplier", {
        observe: "response",
        params,
      })
      .pipe(
        map((response) => {
          this.suppliers = [...this.suppliers, ...response.body.data];
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  createSupplier(supplier: Supplier) {
    return this.http.post(this.baseUrl + "supplier", supplier);
  }

  putSupplier(supplier: Supplier) {
    return this.http.put(this.baseUrl + "supplier", supplier);
  }

  deleteSupplier(id: number) {
    return this.http.delete(this.baseUrl + "supplier/" + id);
  }

  checkIfExists(name: string) {
    return this.http.get(this.baseUrl + "supplier/exists?name=" + name);
  }
}
