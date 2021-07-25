import { PaginationNcm } from "./../_models/PaginationGeneric";
import { NcmParams } from "./../_models/ncmParams";
import { environment } from "./../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Ncm } from "../_models/ncm";

@Injectable({
  providedIn: "root",
})
export class NcmService {
  baseUrl = environment.apiUrl;
  ncms: Ncm[] = [];
  pagination = new PaginationNcm();

  constructor(private http: HttpClient) {}

  getNcms(ncmParams: NcmParams) {
    let params = new HttpParams();

    if (ncmParams.search) {
      params = params.append("search", ncmParams.search);
    }

    params = params.append("sort", ncmParams.sort);
    params = params.append("pageIndex", ncmParams.pageIndex.toString());
    params = params.append("pageSize", ncmParams.pageSize.toString());

    return this.http
      .get<PaginationNcm>(this.baseUrl + "ncm", {
        observe: "response",
        params,
      })
      .pipe(
        map((response) => {
          this.ncms = [...this.ncms, ...response.body.data];
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  createNcm(ncm: Ncm) {
    return this.http.post(this.baseUrl + "ncm", ncm);
  }

  putNcm(ncm: Ncm) {
    return this.http.put(this.baseUrl + "ncm", ncm);
  }

  deleteNcm(id: number) {
    return this.http.delete(this.baseUrl + "ncm/" + id);
  }

  checkIfExists(name: string) {
    return this.http.get(this.baseUrl + "ncm/exists?name=" + name);
  }
}
