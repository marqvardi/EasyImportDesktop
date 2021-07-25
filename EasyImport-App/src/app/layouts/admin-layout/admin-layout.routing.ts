import { PaymentsComponent } from "./../../pages/order/payments/Payments.component";
import { OrderSummaryComponent } from "./../../pages/order/order-summary/order-summary.component";
import { ChangePasswordComponent } from "./../../pages/user/change-password/change-password.component";
import { UserCreateComponent } from "./../../pages/user/user-create/user-create.component";
import { ProfileComponent } from "./../../components/navbar/profile/profile.component";
import { AddItemToOrderComponent } from "./../../pages/addItemToOrder/addItemToOrder.component";
import { OrderOverviewComponent } from "./../../pages/order/order-overview/order-overview.component";
import { OrderComponent } from "./../../pages/order/order.component";
import { BasketComponent } from "./../../basket/basket.component";
import { ProductEditComponent } from "./../../pages/product/product-edit/product-edit.component";
import { SupplierComponent } from "./../../pages/supplier/supplier.component";
import { NcmComponent } from "./../../pages/ncm/ncm.component";
import { AuthGuardGuard } from "./../../guards/auth.guards";
import { RegisterComponent } from "./../../pages/user/register/register.component";
import { LoginComponent } from "./../../pages/user/login/login.component";
import { AdminPanelComponent } from "./../../admin/admin-panel/admin-panel.component";
import { CategoryComponent } from "./../../pages/category/category.component";
import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { ProductComponent } from "src/app/pages/product/product.component";
import { AdminLayoutComponent } from "./admin-layout.component";

export const AdminLayoutRoutes: Routes = [
  // {
  //   path: "",
  //   component: OrderComponent,
  //   canActivate: [AuthGuardGuard],
  //   data: { allowedRoles: ["Admin", "SimpleUser"] },
  // },
  {
    path: "basket",
    component: BasketComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },

  {
    path: "order",
    component: OrderComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "order/:id/view",
    component: OrderOverviewComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "orderSummary",
    component: OrderSummaryComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "addItem",
    component: AddItemToOrderComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "user",
    component: UserComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin"] },
  },

  {
    path: "user-create",
    component: UserCreateComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin"] },
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "category",
    component: CategoryComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "ncm",
    component: NcmComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "supplier",
    component: SupplierComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "product",
    component: ProductComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "product/:id/edit",
    component: ProductEditComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },

  {
    path: "payments",
    component: PaymentsComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },

  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin"] },
  },
  {
    path: "icons",
    component: IconsComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  // { path: "maps", component: MapComponent },
  {
    path: "notifications",
    component: NotificationsComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin"] },
  },
  {
    path: "tables",
    component: TablesComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "typography",
    component: TypographyComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "SimpleUser"] },
  },
  {
    path: "admin",
    component: AdminPanelComponent,
    canActivate: [AuthGuardGuard],
    data: { allowedRoles: ["Admin", "Supplier"] },
  },
  {
    path: "login",
    component: LoginComponent,
  },
  // {
  //   path: "**",
  //   component: OrderComponent
  // }

  // { path: "rtl", component: RtlComponent }
];
