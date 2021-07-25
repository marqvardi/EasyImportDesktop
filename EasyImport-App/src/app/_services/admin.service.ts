import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  baseUrl = environment.apiUrl;
  jwtHelper = new JwtHelperService();
  decodeToken: any;

  constructor(private http: HttpClient) {}

  getRoleNames() {
    return this.http.get(this.baseUrl + "admin/getRoleNames");
  }
}
