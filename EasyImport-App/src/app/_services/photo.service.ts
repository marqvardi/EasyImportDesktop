import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PhotoService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // upload(productId, photo) {
  //   var formData = new FormData();
  //   formData.append("file", photo);
  //   return this.http.post(
  //     this.baseUrl + "product/" + productId + "/photo",
  //     formData
  //   );
  // }

  // uploadUserPhoto(userId, photo) {
  //   var formData = new FormData();
  //   formData.append("file", photo);
  //   return this.http.post(this.baseUrl + "auth" + userId + "/photo", formData);
  // }
}
