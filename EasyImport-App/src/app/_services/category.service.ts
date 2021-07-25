import { environment } from "./../../environments/environment";
import { HttpClientModule, HttpClient, HttpParams } from "@angular/common/http";
import { Category } from "./../_models/category";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CategoryParams } from "../_models/categoryParams";
import { PaginationCategory } from "../_models/PaginationGeneric";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  //baseUrl = "https://localhost:5001/api/categories/";
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  category: Category;
  categories: Category[] = [];
  pagination = new PaginationCategory();

  getCategories(categoryParams: CategoryParams) {
    let params = new HttpParams();

    //Just an example coz for that case "sort" wouldnt need checkign
    // if (categoryParams.sort) {
    //   params = params.append("sort", categoryParams.sort);
    // }

    if (categoryParams.search) {
      params = params.append("search", categoryParams.search);
    }

    params = params.append("sort", categoryParams.sort);
    params = params.append("pageIndex", categoryParams.pageIndex.toString());
    params = params.append("pageSize", categoryParams.pageSize.toString());

    return this.http
      .get<PaginationCategory>(this.baseUrl + "categories", {
        observe: "response",
        params,
      })
      .pipe(
        map((response) => {
          this.categories = [...this.categories, ...response.body.data];
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  createCategory(category: Category) {
    return this.http.post(this.baseUrl + "categories", category);
  }

  deleteCategory(id: number) {
    return this.http.delete(this.baseUrl + "categories/" + id);
  }

  putCategory(category: Category) {
    return this.http.put(this.baseUrl + "categories", category);
  }

  checkIfExists(name: string) {
    return this.http.get(this.baseUrl + "categories/exists?name=" + name);
  }
}
