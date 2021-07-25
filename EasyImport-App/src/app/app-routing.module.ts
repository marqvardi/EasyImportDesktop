import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./pages/user/login/login.component";


export const routes: Routes = [
  {
    path: "",
    redirectTo: "order",
    pathMatch: "full"
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren:
          "./layouts/admin-layout/admin-layout.module#AdminLayoutModule"
      }
    ]
  },
  { path: "login", component: LoginComponent },
  { path: "**", component: LoginComponent },
  {
    path: "**",
    redirectTo: "order"
  }









  // {
  //   path: "",
  //   component: AdminLayoutComponent,
  //   loadChildren:
  //     "./layouts/admin-layout/admin-layout.module#AdminLayoutModule",
  // },

  // // {
  // //   path: "basket",

  // //   loadChildren: "./basket/basket.module#BasketModule",
  // // },
  // { path: "login", component: LoginComponent },
  // { path: "**", component: LoginComponent },



];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
