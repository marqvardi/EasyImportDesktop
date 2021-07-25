import { Router } from "@angular/router";
import { AuthService } from "./../../_services/auth.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
  public sidebarColor: string = "blue";
  userloggedIn = false;

  constructor(private authService: AuthService, private router: Router) { }

  loggedIn() {
    //this.userloggedIn = this.authService.loggedIn();
    this.userloggedIn = true;
    if (this.userloggedIn) {
      //this.router.navigate(["/order"]);
    } else {
      this.router.navigate(["/login"]);
    }
  }

  changeSidebarColor(color) {
    var sidebar = document.getElementsByClassName("sidebar")[0];
    var mainPanel = document.getElementsByClassName("main-panel")[0];

    this.sidebarColor = color;

    if (sidebar != undefined) {
      sidebar.setAttribute("data", color);
    }
    if (mainPanel != undefined) {
      mainPanel.setAttribute("data", color);
    }
  }
  changeDashboardColor(color) {
    var body = document.getElementsByTagName("body")[0];
    if (body && color === "white-content") {
      body.classList.add(color);
    } else if (body.classList.contains("white-content")) {
      body.classList.remove("white-content");
    }
  }
  ngOnInit() {
    this.loggedIn();
    this.changeDashboardColor("white-content");
  }
}
