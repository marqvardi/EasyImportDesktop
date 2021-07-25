import { BusyService } from "./common/busy.service";
import { PaymentService } from "./_services/payment.service";
import { OrderService } from "./_services/order.service";
import { PhotoService } from "./_services/photo.service";
import { ProductService } from "src/app/_services/product.service";
import { AdminService } from "./_services/admin.service";
import { AuthService } from "./_services/auth.service";
import { AdminLayoutModule } from "./layouts/admin-layout/admin-layout.module";
import { CategoryService } from "./_services/category.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule, routes } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";

import { JwtInterceptor } from "./interceptors/JwtInterceptor";
import { ToastrModule } from "ngx-toastr";
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadingInterceptor } from "./common/loading.interceptor";

@NgModule({
  imports: [
    NgxSpinnerModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    // AdminLayoutModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: "toast-top-center",
      preventDuplicates: true,
    }),
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent],
  providers: [
    CategoryService,
    AuthService,
    AdminService,
    ProductService,
    PhotoService,
    OrderService,
    PaymentService,
    BusyService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
