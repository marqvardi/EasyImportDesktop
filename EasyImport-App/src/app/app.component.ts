import { BasketService } from "./basket/basket.service";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "./_services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public sidebarColor: string = "blue";

  constructor(
    private authService: AuthService,
    private basketService: BasketService
  ) {}

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
    const basketId = localStorage.getItem("basket_id");
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe(
        () => {
          // console.log("basketId initialized : ", basketId);
        },
        (error) => {
          // console.log(error);
        }
      );
    }
  }
}
