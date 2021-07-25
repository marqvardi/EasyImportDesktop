import { UserChangePassword } from "./../_models/UserChangePassword";
import { UserEdit } from "./../_models/UserEdit";
import { User } from "./../_models/user";
import { UserTeste } from "./../_models/UserTeste";
import { UserParams } from "./../_models/UserParams";
import { environment } from "./../../environments/environment";
import { Router } from "@angular/router";
import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map } from "rxjs/operators";

import { PaginationUser } from "../_models/PaginationGeneric";
import { BehaviorSubject } from "rxjs";
import { report } from "process";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // baseUrl = "https://localhost:5001/api/auth/";
  baseUrl = environment.apiUrl;
  jwtHelper = new JwtHelperService();
  decodeToken: any;
  pagination = new PaginationUser();
  users: UserTeste[];
  private userSource = new BehaviorSubject<UserTeste>(null);
  user$ = this.userSource.asObservable();
  user: UserTeste;

  constructor(private http: HttpClient, private router: Router) {}

  // httpOptions = {
  //   headers: new HttpHeaders({ "Content-Type": "application/json" }),
  //};

  login(model: any) {
    return this.http.post(this.baseUrl + "auth/login", model).pipe(
      map((response: any) => {
        const user = response;

        if (user) {
          localStorage.setItem("token", user.token);
          localStorage.setItem("userId", user.user.id);
          // this.decodeToken = this.jwtHelper.decodeToken(user.token);
          // sessionStorage.setItem("username", this.decodeToken.unique_name);
        }
      })
    );
  }

  getUsers(userParams: UserParams) {
    let params = new HttpParams();

    if (userParams.search) {
      params = params.append("search", userParams.search);
    }

    params = params.append("sort", userParams.sort);
    params = params.append("pageIndex", userParams.pageIndex.toString());
    params = params.append("pageSize", userParams.pageSize.toString());

    return this.http
      .get<PaginationUser>(this.baseUrl + "auth", {
        observe: "response",
        params,
      })
      .pipe(
        map((response) => {
          // this.users = [...this.users, ...response.body.data];
          // this.pagination = response.body;
          this.users = response.body.data;
          this.pagination = response.body;

          return this.pagination;
        })
      );
  }

  getUserById() {
    const id = localStorage.getItem("userId");
    return this.http
      .get<UserTeste>(this.baseUrl + "auth/GetUserById/" + id)
      .subscribe(
        (response: UserTeste) => {
          this.userSource.next(response);
          this.user = response;
        },
        (error) => {}
      );
  }

  // This one edit from Admin pov
  editUser(user: UserTeste) {
    return this.http.put(this.baseUrl + "auth", user);
  }

  //This one edit from user pov
  editUserProfile(user: UserEdit) {
    return this.http.post(this.baseUrl + "auth/userEditProfile", user);
  }

  userChangePassword(user: UserChangePassword) {
    return this.http.post(this.baseUrl + "auth/changePassword", user);
  }

  createUser(user: UserTeste) {
    return this.http.post(this.baseUrl + "auth/register", user);
  }

  getRoles() {
    return this.http.get(this.baseUrl + "admin/getRoleNames");
  }

  deleteUser(id: string) {
    return this.http.delete(this.baseUrl + "auth/" + id);
  }

  // roleMatch(allowedRoles): boolean {
  //   let isMatch = false;
  //   const userRoles = this.decodeToken.role as Array<string>;
  //   allowedRoles.forEach((element) => {
  //     if (userRoles.includes(element)) {
  //       isMatch = true;
  //       return;
  //     }
  //   });
  //   return isMatch;
  // }

  isAuthorized(allowedRoles: string[]): boolean {
    // check if the list of allowed roles is empty, if empty, authorize the user to access the page
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }

    // get token from local storage or state management
    const token = localStorage.getItem("token");

    // decode token to read the payload details
    const decodeToken = this.jwtHelper.decodeToken(token);

    // check if it was decoded successfully, if not the token is not valid, deny access
    if (!decodeToken) {
      //console.log("Invalid token");
      return false;
    }

    // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
    return allowedRoles.includes(decodeToken["role"]);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + "auth/register", model);
  }

  loggedIn() {
    const token = localStorage.getItem("token");

    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // this.router.navigateByUrl("/home");
  }
}
