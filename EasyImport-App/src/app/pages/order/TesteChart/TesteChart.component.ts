import { PriceEvolution } from "./../../../_models/PriceEvolution";
import { Component, Input, OnInit } from "@angular/core";
import Chart from "chart.js";

@Component({
  selector: "app-TesteChart",
  templateUrl: "./TesteChart.component.html",
  styleUrls: ["./TesteChart.component.scss"],
})
export class TesteChartComponent implements OnInit {
  public canvas: any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  @Input() priceEvolution: PriceEvolution;

  constructor() {}

  ngOnInit() {
    this.canvas = document.getElementById("chartLineRed");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(233,32,16,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(233,32,16,0.0)");
    gradientStroke.addColorStop(0, "rgba(233,32,16,0)"); //red colors

    const testeData = [1.06, 1.55, 1.36, 1.55];
    const testeLabel = ["252", "270", "295", "320"];
    const testeLabelInside = ["labe1", "label2", "label3", "label4"];

    var data = {
      // labels: testeLabel,
      labels: this.priceEvolution.references,

      datasets: [
        {
          label: "Preco",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#ec250d",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#ec250d",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#ec250d",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 7,
          // data: testeData,
          data: this.priceEvolution.prices,
        },
      ],
    };

    var myChart = new Chart(this.ctx, {
      type: "line",
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipRed,
    });

    this.myChartData = myChart;

    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: true,
      },

      tooltips: {
        // callbacks: {
        //   title: function (tooltipItem, data) {
        //     return data["labels"][tooltipItem[0]["index"]];
        //   },
        //   label: function (tooltipItem, data) {
        //     return data["datasets"][0]["data"][tooltipItem["index"]];
        //   },
        //   afterLabel: function (tooltipItem, data) {
        //     var dataset = data["datasets"][0];
        //     var percent = Math.round(
        //       (dataset["data"][tooltipItem["index"]] /
        //         dataset["_meta"][0]["total"]) *
        //         100
        //     );
        //     return "(" + percent + "%)";
        //   },
        // },
        backgroundColor: "#f5f5f5",
        bodyFontSize: 24,
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent",
            },
            ticks: {
              suggestedMin: 60,
              suggestedMax: 125,
              padding: 20,
              fontColor: "#9a9a9a",
            },
          },
        ],

        xAxes: [
          {
            // scaleLabel: {
            //   display: true,
            //   labelString: "probability",
            // },
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(233,32,16,0.1)",
              zeroLineColor: "transparent",
            },
            ticks: {
              callback: function (label) {
                var month = label.price;

                return month;
              },

              // padding: 20,
              // fontColor: "#9a9a9a",
            },
          },
        ],
      },
    };
  }
}
