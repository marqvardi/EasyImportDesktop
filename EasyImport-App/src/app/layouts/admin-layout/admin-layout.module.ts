import { TesteChartComponent } from "./../../pages/order/TesteChart/TesteChart.component";
import { PaymentsComponent } from "./../../pages/order/payments/Payments.component";
import { OrderSummaryComponent } from "./../../pages/order/order-summary/order-summary.component";
import { ChangePasswordComponent } from "./../../pages/user/change-password/change-password.component";
import { UserCreateComponent } from "./../../pages/user/user-create/user-create.component";
import { ProfileComponent } from "./../../components/navbar/profile/profile.component";
import { AddItemToOrderComponent } from "./../../pages/addItemToOrder/addItemToOrder.component";
import { OrderOverviewComponent } from "./../../pages/order/order-overview/order-overview.component";
import { OrderComponent } from "./../../pages/order/order.component";
import { OrderTotalComponent } from "./../../pages/order/order-total/order-total.component";
import { BasketComponent } from "./../../basket/basket.component";
import { ProductDetailComponent } from "./../../pages/product/product-detail/product-detail.component";
import { ProductCreateComponent } from "src/app/pages/product/product-create/product-create.component";
import { ProductComponent } from "src/app/pages/product/product.component";
import { SupplierComponent } from "./../../pages/supplier/supplier.component";
import { PagerComponent } from "./../../shared/pager/pager.component";
import { PagingHeaderComponent } from "./../../shared/paging-header/paging-header.component";

import { TextInputComponent } from "./../../shared/text-input/text-input.component";
import { RegisterComponent } from "./../../pages/user/register/register.component";
import { LoginComponent } from "./../../pages/user/login/login.component";

import { CategoryComponent } from "./../../pages/category/category.component";
import { NcmComponent } from "./../../pages/ncm/ncm.component";

import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxMaskModule, IConfig } from "ngx-mask";
import { TabsModule } from "ngx-bootstrap/tabs";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProductEditComponent } from "src/app/pages/product/product-edit/product-edit.component";
import { FileUploadModule } from "ng2-file-upload";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { HasRoleDirective } from "src/app/_directives/hasRole.directive";
import { ComponentsModule } from "src/app/components/components.module";

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  imports: [
    //  BrowserAnimationsModule,
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    NgxMaskModule.forRoot(maskConfig),
    FileUploadModule,
    ComponentsModule,
    //BasketModule,
    // ToastrModule.forRoot({
    //   timeOut: 2000,
    //   positionClass: "toast-bottom-right",
    //   preventDuplicates: true,
    // }),
  ],
  declarations: [
    // HasRoleDirective,
    DashboardComponent,
    UserComponent,
    TablesComponent,
    IconsComponent,
    TypographyComponent,
    NotificationsComponent,
    CategoryComponent,
    LoginComponent,
    RegisterComponent,
    TextInputComponent,
    PagingHeaderComponent,
    PagerComponent,
    NcmComponent,
    SupplierComponent,
    ProductDetailComponent,
    ProductComponent,
    ProductCreateComponent,
    ProductEditComponent,
    BasketComponent,
    OrderComponent,
    OrderTotalComponent,
    OrderOverviewComponent,
    OrderSummaryComponent,
    AddItemToOrderComponent,
    ProfileComponent,
    UserComponent,
    UserCreateComponent,
    ChangePasswordComponent,
    PaymentsComponent,
    TesteChartComponent,
  ],
  exports: [
    TextInputComponent,
    LoginComponent,
    PagingHeaderComponent,
    PagerComponent,
  ],
})
export class AdminLayoutModule {}
