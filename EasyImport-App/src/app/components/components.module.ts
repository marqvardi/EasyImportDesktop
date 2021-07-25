import { HasRoleDirective } from "./../_directives/hasRole.directive";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    HasRoleDirective,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    HasRoleDirective,
  ],
})
export class ComponentsModule {}
