import { ProductParams } from "src/app/_models/ProductParams";
import { Category } from "./../_models/category";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { Product } from "../_models/product";
import { PaginationProduct } from "../_models/PaginationGeneric";
import { map } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class ProductService {
  baseUrl = environment.apiUrl;
  products: Product[] = [];
  pagination = new PaginationProduct();

  constructor(private http: HttpClient) {}

  getCategoryList() {
    //return this.http.get<Category[]>(this.baseUrl + "categories");
    return this.http.get<Category[]>(
      this.baseUrl + "categories/categoriesList"
    );
  }

  getSuppliersList() {
    // return this.http.get(this.baseUrl + "supplier");
    return this.http.get(this.baseUrl + "supplier/supplierList");
  }

  getNcmsList() {
    // return this.http.get(this.baseUrl + "ncm");
    return this.http.get(this.baseUrl + "ncm/ncmList");
  }

  createProduct(product: Product) {
    return this.http.post(this.baseUrl + "product", product);
  }

  getProducts(productParams: ProductParams) {
    let params = new HttpParams();

    if (productParams.search) {
      params = params.append("search", productParams.search);
    }

    params = params.append("sort", productParams.sort);
    params = params.append("pageIndex", productParams.pageIndex.toString());
    params = params.append("pageSize", productParams.pageSize.toString());

    return this.http
      .get<PaginationProduct>(this.baseUrl + "product", {
        observe: "response",
        params,
      })
      .pipe(
        map((response) => {
          this.products = [...this.products, ...response.body.data];
          this.pagination = response.body;

          return this.pagination;
        })
      );
  }

  getProductListForOrder() {
    return this.http.get(this.baseUrl + "product/GetProductListForOrder");
  }

  getProductsWithNoParams() {
    return this.http.get(this.baseUrl + "product/noparams");
  }

  getProductById(id: number) {
    return this.http.get(this.baseUrl + "product/" + id);
  }

  editProduct(product: Product) {
    return this.http.put(this.baseUrl + "product", product);
  }

  checkIfExists(name: string) {
    return this.http.get(this.baseUrl + "product/exists?name=" + name);
  }

  getPriceEvolutionPerProduct(productId: number) {
    return this.http.get(this.baseUrl + "orders/orderItem/" + productId);
  }
}
