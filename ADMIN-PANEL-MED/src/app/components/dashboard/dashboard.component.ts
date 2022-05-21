import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as chartData from '../../shared/data/chart';
import {
  doughnutData, pieData,
  single,
  vedio_single,
  profit_single,
  medcoin_data,
  total_revenue_data,
  ramUsageOne,
  ramUsageTwo,
  facebook,
  insta,
  youtube,
  whatsapp,
  social,
  others,
  Vedio_Play
} from '../../shared/data/chart';
import { Router, Route } from '@angular/router';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Width } from 'ngx-owl-carousel-o/lib/services/carousel.service';
// import EmployeeService from 'src/app/services/employee.service';
// import Employee from 'src/app/models/employee.model';
import { DashboardServiceService } from '../../services/dashboard-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public employee;
  customColors = (value) => {
    console.log(value);
    return "#ff0000";
  }

  saleData = [
    { name: "Mobiles", value: 80 },
  ];

  single: any[];
  vedio_single: any[];
  profit_single: any[];
  medcoin_data: any[];
  source_of_enter: any[];
  ramUsageOne: any[];
  ramUsageTwo: any[];
  facebook: any[];
  insta: any[];
  youtube: any[];
  whatsapp: any[];
  social: any[];
  others: any[];
  Vedio_Play: any[];


  view: any[] = [300, 200];
  totalcomplaint_view: any[] = [295, 180];
  video_view: any[] = [500, 400];
  profit_view: any[] = [195, 100];
  medcoinview: any[] = [300, 270];
  ramUsageOne_view: any[] = [400, 300];
  source_of_enter_view: any[] = [195, 100];
  fb_view: any[] = [95, 85];
  vedio_play_view: any[] = [170, 150];

  // options
  showLegend: boolean = false;
  showLabels: boolean = false;
  gradient: boolean = false;

  legend: boolean = true;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#ff0077', '#ffffff']
  };

  fb_colorScheme = {
    domain: ['#00a2ff', '#cfdce3']
  };

  ramUsageOne_colorScheme = {
    domain: ['#ffffff', '#00f812', '#e6f904', '#ff3030']
  };

  vedio_colorScheme = {
    domain: ['#7aa3e5',]
  };

  profit_colorScheme = {
    domain: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']
  };

  total_revenue_colorScheme = {
    domain: ['#00ad2f', '#ffffff', '#66ff76']
  }

  medcoin_colorScheme = {
    domain: ['#ffffff', '#00aaff', '#00ff11']
  }

  public form: FormGroup;
  rating3: number;

  constructor(public _router: Router,
    private fb: FormBuilder,
    private DashBoard_Service: DashboardServiceService
  ) {
    Object.assign(this, {
      single, vedio_single, profit_single,
      medcoin_data, total_revenue_data,
      ramUsageOne, ramUsageTwo, facebook, insta,
      youtube,
      whatsapp,
      social,
      others, Vedio_Play
    })

    this.rating3 = 3;
    this.form = this.fb.group({
      rating1: ['', Validators.required],
      rating2: [3]
    });

    this.employee = sessionStorage.getItem('id');
  }

  format() {

    var x = '2,00,000'.toString();
    return x;
  }

  formatValue(value) {
    var x = value + '%';
    return x;
  }

  vedioFormatValue(value) {
    var x = value + ' mins';
    return x;
  }
  gaugeValueFormatting(value) {
    return '';
  }

  user: any

  public Todays_TotalOrdersCount: any = ''
  public Todays_TotalOrdersPercentage: any = ''
  public TotalOrdersCount: any = ''
  public TotalOrdersPercentage: any = ''
  public TotalProductsCount: any = ''
  public TotalProductsPercentage: any = ''
  public TotalPendingOrderCount: any = ''
  public TotalPendingOrderPercentage: any = ''
  public TotalRevenueCount: any = ''
  public TotalRevenuePercentage: any = ''
  public TotalProfitCount: any = ''
  public TotalProfitPercentage: any = ''
  public TotalPrimeMembersCount: any = ''
  public TotalPrimeMembersPercentage: any = ''

 
  
  





  public HealthCareGraphArray: any = []
  public MedimallGraphArray: any = []
  public TotalOrdersGraphArray: any = []
  public TotalProductsGraphArray: any = []
  public TotalPendingOrdersGraphArray: any = []
  public TotalRevenueGraphArray: any = []
  public TotalProfitGraphArray: any = []
  public TotalPrimeMembersGraphArray: any = []

  

  ngOnInit() {

    this.get_Dashboard_details()

    //Health care Chart 1

    // var myChart = new Chart("myChart", {
    //   type: 'line',
    //   data: {
    //     labels: ['January', 'February','March','April','May','June'],
    //       datasets: [
    //         {
    //         label: 'Health Care',
    //         data: this.HealthCareGraphArray,
    //         // data: [250, 120, 80, 35, 56, 10, 100],
    //         fill: false,
    //         borderColor: '#cc0088',
    //         order: 2,
    //         pointRadius:3,
    //         borderJoinStyle: 'bevel',  
    //         pointBorderColor: '#cc0088',
    //         pointBackgroundColor: '#cc0088',
    //         pointBorderWidth: 1,
    //         pointStyle:'circle',
    //       },
    //       {
    //         label: 'Medimall',
    //         data:this.MedimallGraphArray,
    //         // data: [9, 30, 20,  155, 56, 55, 40],
    //         fill: false,
    //         borderColor: '#ffffff',
    //         order: 2,
    //         pointRadius:3,
    //         borderJoinStyle: 'bevel', 
    //         pointBorderColor: '#ffffff',
    //         pointBackgroundColor: '#ffffff',
    //         pointBorderWidth: 1,
    //         pointStyle:'circle',
    //       }

    //     ],
    //   },
    //   options: {
    //     layout: {
    //       padding: {
    //           right: 10,
    //           bottom:5
    //       }
    //   },
    //     legend: {
    //     position: 'left',
    //     align:'start',
    //     labels: {
    //       boxWidth: 30,      
    //       fontColor: "white",
    //     }
    //     },
    //     scales: {
    //       yAxes: [{
    //         display: false,
    //         gridLines: {
    //           drawBorder: false,
    //           drawOnChartArea: false
    //         },
    //       }],
    //       xAxes: [{
    //         display: false,
    //         gridLines: {
    //           display: false,
    //           drawOnChartArea: false
    //         },
    //       }],
    //     },
    //   },
    // });


    //Total Order Doughnut Chart

    // var deliveredData = {
    //   labels: [
    //     "Total Orders"
    //   ],
    //   datasets: [
    //     {
    //       data: [90, 15],
    //       backgroundColor: [
    //         "#69a78c",
    //         "#dddddd"
    //       ],

    //       borderWidth: [
    //         0, 1
    //       ]
    //     }]
    // };

    // var deliveredOpt = {
    //   // layout: {
    //   //   padding: 1
    //   // },
    //   cutoutPercentage: 80,
    //   curvature: 8,
    //   rotation: 180,
    //   animation: {
    //     animationRotate: true,
    //     duration: 2000
    //   },
    //   legend: {
    //     display: false
    //   },
    //   tooltips: {
    //     enabled: true
    //   }
    // };

    // var totalOrderdoughnutChart = new Chart("totalOrderdoughnutChart", {
    //   type: 'doughnut',
    //   data: deliveredData,
    //   options: deliveredOpt
    // });





    //Medimall Bar chart 2

    // var medimallBarChart = new Chart("medimallBarChart", {
    //   type: 'bar',
    //   data: {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    //     datasets: [
    //       {
    //         label: 'Pharmacy',
    //         data: [100, 60, 40, 60, 55, 40, 65, 80, 25, 33],
    //         fill: true,
    //         backgroundColor: '#ffffff',
    //       },
    //       {
    //         label: 'Health Care',
    //         data: [50, 30, 20, 30, 40, 10, 25, 10, 75, 67],
    //         fill: true,
    //         borderColor: '#ffffff',
    //         backgroundColor: '#99850a'
    //       }


    //     ],
    //   },
    //   options: {
    //     legend: {
    //       position: 'left',
    //       labels: {
    //         boxWidth: 10,
    //         fontColor: "white",
    //         padding: 8
    //       }
    //     },
    //     scales: {
    //       yAxes: [{
    //         display: false,
    //         gridLines: {
    //           drawBorder: false,
    //           drawOnChartArea: true
    //         },
    //       }],
    //       xAxes: [{
    //         display: false,
    //         gridLines: {
    //           display: false,
    //           drawOnChartArea: true
    //         },
    //       }],
    //     },
    //   },
    // });


    //Total revenue Chart 1
    // var data1 = [0, 15, 0];
    // var data2 = [0, 0, 25, 0];
    // var totalRevenueChart = new Chart("totalRevenueChart", {
    //   type: 'line',
    //   data: {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    //     datasets: [
    //       {
    //         label: 'Medimall',
    //         fill: true,
    //         backgroundColor: '#00ad2f',
    //         pointRadius: 0,
    //         pointHitRadius: 10,
    //         showLine: true,
    //         data: data1,
    //         spanGaps: true
    //       },

    //       {
    //         label: 'Subscription',
    //         fill: true,
    //         backgroundColor: '#ffffff',
    //         pointRadius: 0,
    //         pointHitRadius: 10,
    //         data: data2,
    //       },

    //       {
    //         label: 'Membership',
    //         data: [0, 0, 0, 35, 0],
    //         fill: true,
    //         backgroundColor: '#66ff76',
    //         pointRadius: 0,
    //         pointHitRadius: 10,
    //       },

    //       // {
    //       //   data: [0, 0 ,0,0 ,20, 0 ],
    //       //   fill: true,
    //       //   backgroundColor: '#ffffff',
    //       //   pointRadius: 0,
    //       //   pointHitRadius: 10,
    //       // },



    //     ],
    //   },
    //   options: {
    //     layout: {
    //       padding: {
    //         bottom: 15
    //       }
    //     },
    //     plugins: {
    //       filler: {
    //         propagate: false
    //       }
    //     },
    //     legend: {
    //       position: 'left',
    //       labels: {
    //         boxWidth: 10,
    //         fontColor: "white",
    //         padding: 8
    //       }
    //     },
    //     scales: {
    //       yAxes: [{
    //         display: false,
    //         gridLines: {
    //           drawBorder: false,
    //           drawOnChartArea: false
    //         },
    //       }],
    //       xAxes: [{
    //         display: false,
    //         gridLines: {
    //           display: false,
    //           drawOnChartArea: false
    //         },
    //       }],

    //     },
    //   },
    // });


    //Profit Bar chart 

    // var profitBarChart = new Chart("profitBarChart", {
    //   type: 'bar',
    //   data: {
    //     labels: ['', '', '', '', '', '', ''],
    //     datasets: [
    //       {
    //         barThickness: 15,
    //         data: [55, 65, 54, 60, 70, 60, 65],
    //         fill: true,
    //         backgroundColor: '#ffffff',
    //       },

    //     ],
    //   },
    //   plugins: [ChartDataLabels],
    //   options: {
    //     plugins: {
    //       datalabels: {
    //         display: true,
    //         color: '#ffffff',
    //         anchor: 'end',
    //         clamp: true,
    //         align: 'top',
    //         // formatter: (val, ctx) => {
    //         //   return ctx.chart.data.labels[ctx.dataIndex];
    //         // },
    //       }
    //     },
    //     legend: {
    //       position: 'right',
    //       display: false,
    //       labels: {
    //         boxWidth: 13,
    //       }
    //     },
    //     scales: {
    //       yAxes: [{
    //         display: false,
    //         gridLines: {
    //           drawBorder: false,
    //           drawOnChartArea: false
    //         },
    //       }],
    //       xAxes: [{
    //         display: false,
    //         gridLines: {
    //           display: false,
    //           drawOnChartArea: false
    //         },
    //       }],
    //     },

    //   },
    // });



    //Subscription Chart 1

    var mySubscriptionChart = new Chart("mySubscriptionChart", {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'medimall',
            data: [10, 30, 20, 81, 56, 55, 40],
            fill: false,
            borderColor: '#ffffff',
            order: 2,
            pointBorderColor: '#fe43ef',
            pointBackgroundColor: '#ffffff',
            pointBorderWidth: 3,
            pointHoverBorderWidth: 3,
            pointHoverBackgroundColor: '#00d7f9',
            pointStyle: 'circle',
            pointRadius: 4,

          }

        ],
      },
      options: {
        layout: {
          padding: {
            left: 10,
            right: 10
          }
        },
        elements: {
          line: {
            borderJoinStyle: 'round'
          },
          point: {
            radius: 1
          }
        },
        showLines: true,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            display: false,
            gridLines: {

              drawBorder: false,
              drawOnChartArea: false
            },
          }],
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
              drawOnChartArea: false
            },
          }],
        },
      },
    });


    //Average Order Value Chart 1

    var averageOrderValueChart = new Chart("averageOrderValueChart", {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            data: [10, 90, 30, 81, 56, 75, 100],
            fill: false,
            borderColor: '#ffffff',
            order: 1,
            pointBorderColor: '#ffffff',
            pointBackgroundColor: '#ffffff',
            pointBorderWidth: 3,
            pointHoverBorderWidth: 3,
            pointHoverBackgroundColor: '#ffffff',
            pointStyle: 'circle',
            pointRadius: 4,
          }

        ],
      },
      options: {
        layout: {
          padding: {
            left: 10,
            right: 10
          }
        },
        elements: {
          line: {
            borderJoinStyle: 'round'
          }
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            display: false,
            gridLines: {

              drawBorder: false,
              drawOnChartArea: false
            },
          }],
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
              drawOnChartArea: false
            },
          }],
        },
      },
    });


    //Prime Members Line Bar chart 2

    // var primeLineBarChart = new Chart("primeLineBarChart", {
    //   data: {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    //     datasets: [
    //       {
    //         type: 'bar',
    //         label: 'Prime Members',
    //         data: [60, 40, 60, 55, 40, 65, 80, 25, 33],
    //         fill: true,
    //         backgroundColor: '#cacaca',
    //         order: 2
    //       },
    //       {
    //         type: 'bar',
    //         label: 'Non-Prime Members',
    //         data: [60, 40, 60, 55, 40, 65, 80, 25, 33],
    //         fill: true,
    //         borderColor: '#ffffff',
    //         backgroundColor: '#00000026',
    //         order: 3
    //       },
    //       //   {
    //       //     type: 'line',
    //       //   label: 'Health Care',
    //       //   data: [60, 40, 60, 55, 40, 65,80,25,33],
    //       //   fill: true,
    //       //   borderColor: '#1aa9af',
    //       //   pointRadius:0,
    //       //   order:1
    //       // },



    //     ],
    //   },
    //   options: {
    //     legend: {
    //       //display:false,
    //       position: 'right',
    //       labels: {
    //         boxWidth: 10,
    //         fontColor: "white",
    //         padding: 8
    //       }
    //     },
    //     tooltips: {
    //       enabled: false
    //     },
    //     scales: {
    //       yAxes: [{
    //         display: false,
    //         gridLines: {
    //           drawBorder: false,
    //           drawOnChartArea: false
    //         },
    //       }],
    //       xAxes: [{
    //         display: false,
    //         gridLines: {
    //           display: false,
    //           drawOnChartArea: false
    //         },
    //       }],
    //     },
    //   },
    // });


    //  var primeLineBarChart = new Chart("primeLineBarChart", {
    //   data: {
    //     datasets: [ 
    //       {
    //         type: 'line',
    //         label: 'Total Prime Members',
    //         data: [10, 90, 30,  81, 56, 75, 100, 10, 90, 30],
    //         fill:true,
    //         borderColor: '#1aa9af',
    //         pointRadius: 1,
    //         pointHitRadius: 10,
    //         steppedLine:false

    //     }
    //   ],
    //     labels: ['January', 'February', 'March', 'April']
    // },
    //   options: {
    //     plugins:{
    //       filler: {
    //         propagate: true
    //     }
    //     },
    //     legend:{
    //       display:false
    //     },
    //     scales: {
    //       yAxes: [{
    //         display: false,
    //         gridLines: {
    //           drawBorder: false,
    //           drawOnChartArea: true
    //         },
    //       }],
    //       xAxes: [{
    //         display: false,
    //         gridLines: {
    //           display: false,
    //           drawOnChartArea: true
    //         },
    //       }],
    //     },
    //   },
    // });


    //Total Users Line Chart 

    var totalUsersLineChart = new Chart("totalUsersLineChart", {
      type: 'line',
      data: {
        labels: ['', '', '', '', '', ''],
        datasets: [
          {
            data: [30, 60, 20, 89, 10, 100, 40],
            fill: false,
            borderColor: '#ffffff',
            order: 1,
          }

        ],
      },
      options: {
        layout: {
          padding: 10
        },
        elements: {
          line: {
            tension: 0
          }
        },
        legend: {

          position: 'left',
          display: false,
        },
        scales: {
          yAxes: [{
            display: false,
            gridLines: {

              drawBorder: false,
              drawOnChartArea: false
            },
          }],
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
              drawOnChartArea: false
            },
          }],
        },
      },
    });


    //Goal Overview Doughnut Chart
    var goaldoughnutChart = new Chart("goaldoughnutChart", {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In progress'],
        datasets: [{
          label: "Gauge",
          data: [60, 40],
          backgroundColor: ['#00ff91', '#fefefe'],
          borderWidth: 1,
          weight: 2,
          borderDashOffset: 2,
          rotation: 10,
          borderJoinStyle: 'round'
        }]
      },
      options: {
        layout: {
          padding: 8
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        circumference: Math.PI * 1,
        rotation: Math.PI * 1,
        aspectRatio: 1,
        cutoutPercentage: 80,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Doughnut Chart'
          }
        }
      },
    });


    //Gender Pie Chart 
    var ctx = document.getElementById("genderPieChart");
    var genderPieChart = new Chart("genderPieChart", {
      type: 'pie',
      data: {
        labels: [
          'Male',
          'Other',
          'Female'
        ],
        datasets: [{
          label: 'Gender',
          data: [780, 150, 400],
          backgroundColor: [
            '#ffb600',
            '#9785ac',
            '#ff7900'
          ],
          borderWidth: 2,
          borderAlign: 'center',
        }],

      },
      plugins: [ChartDataLabels],
      options: {
        rotation: 180,
        tooltips: {
          enabled: false
        },
        plugins: {
          datalabels: {
            display: true,
            color: '#ffffff',
            anchor: 'center',
            // formatter: (val, ctx) => {
            //   return ctx.chart.data.labels[ctx.dataIndex];
            // },
          }
        },
        animation: {
          animateScale: true,
          duration: 2000
        },
        legend: {
          display: true,
          position: 'left',
          labels: {
            fontColor: '#ffffff',
            padding: 14,
            usePointStyle: true,
          }
        }
      },

    });

    //Marital Status Pie Chart 

    var maritalPieChart = new Chart("maritalPieChart", {
      type: 'pie',
      data: {
        labels: [
          'Married',
          'Unmarried',
        ],
        datasets: [{
          label: 'Marital Status',
          data: [780, 400],
          backgroundColor: [
            '#ffb600',
            '#ff7900'
          ],
          borderAlign: 'center'
        }]

      },
      plugins: [ChartDataLabels],
      options: {
        plugins: {
          datalabels: {
            display: true,
            color: '#ffffff',
            anchor: 'center',
            // formatter: (val, ctx) => {
            //   return ctx.chart.data.labels[ctx.dataIndex];
            // },
          }
        },
        rotation: 380,
        tooltips: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            fontColor: '#ffffff',
            padding: 16,
            usePointStyle: true,

          },
        },

      }
    });




    //Age  Bar chart 2
    var ageBarChart = new Chart("ageBarChart", {
      type: 'bar',
      data: {
        labels: ['10-20', '20-30', '30-40', '40-50', '50-60', '60 Above'],
        datasets: [
          {
            label: 'Age',
            data: [70001, 84560, 75040, 65860, 81255, 113940],
            fill: true,
            backgroundColor: '#00a8ff',
            borderWidth: 0,
            barPercentage: 1,
            borderJoinStyle: 'round',
            barThickness: 35,
            borderAlign: 'inner',
            pointBorderWidth: 10,
            pointRadius: 4,
          },
        ],
      },
      plugins: [ChartDataLabels],
      options: {
        plugins: {
          datalabels: {
            display: true,
            color: '#ffffff',
            opacity: 0.5,
            anchor: 'end',
            clamp: true,
            align: 'top',
            // formatter: (val, ctx) => {
            //   return ctx.chart.data.labels[ctx.dataIndex];
            // },
          }
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            display: true,
            gridLines: {
              drawBorder: true,
              drawOnChartArea: false,
              color: '#ffffff',
            },
            ticks: {
              min: 25000,
              max: 125000,
              fontColor: '#ffffff',
              padding: 15,
              stepSize: 25000
            }
          }],
          xAxes: [{
            display: true,
            gridLines: {
              drawBorder: true,
              drawOnChartArea: false,
              color: '#ffffff'
            },
            ticks: {
              min: 0,
              max: 2000,
              fontColor: '#ffffff',
              padding: 10
            }
          }],

        },

        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }

      },
    });


    //User Engagement MultiLine Chart 

    var usersMultiLineChart = new Chart("usersMultiLineChart", {
      type: 'line',
      data: {
        labels: ['0', '5 am', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
          {
            label: 'Medimall',
            data: [15, 1300, 480, 590, 850, 490, 12],
            fill: false,
            borderColor: '#00d7f9',
            order: 1,
            pointRadius: 0,
          },

          {
            label: 'Explore',
            data: [150, 700, 856, 80, 100, 324, 765],
            fill: false,
            borderColor: '#f8d903',
            order: 1,
            pointRadius: 0,
          },

          {
            label: 'Fitness & Wellness',
            data: [150, 90, 150, 250, 380, 420, 91],
            fill: false,
            borderColor: '#00da16',
            order: 1,
            pointRadius: 0,
          },

          {
            label: 'Other',
            data: [150, 10, 240, 159, 66, 91, 449],
            fill: false,
            borderColor: '#ef048a',
            order: 1,
            pointRadius: 0,
          }

        ],
      },
      options: {
        legend: {
          position: 'bottom',
          labels: {
            fontColor: '#ffffff',
            boxWidth: 10,
            padding: 60
          }
        },
        scales: {
          yAxes: [{
            type: 'linear',
            display: true,
            gridLines: {
              drawBorder: true,
              drawOnChartArea: false,
              color: '#ffffff'
            },
            ticks: {
              min: 0,
              max: 2000,
              fontColor: '#ffffff',
              stepSize: 500
            }
          }],
          xAxes: [{
            type: 'category',
            display: true,
            gridLines: {
              drawBorder: true,
              drawOnChartArea: false,
              color: '#ffffff'
            },
            ticks: {
              min: 0,
              max: 12,
              fontColor: '#ffffff'
            }

          }],
        },
      },
    });



    //Pednding Orders Pie Chart 
    // let segment;
    // let selectedIndex;
    // var pendingOrderPieChart = new Chart("pendingOrderPieChart", {
    //   type: 'pie',
    //   data: {
    //     labels: [
    //       'Delivered',
    //       'Pending'
    //     ],
    //     datasets: [{
    //       data: [80, 20],
    //       backgroundColor: [
    //         '#ffffff',
    //         '#007bff'
    //       ],
    //       borderWidth: 3,
    //       //borderColor:'#007bff'
    //     }]
    //   },
    //   plugins: [ChartDataLabels],
    //   options: {
    //     layout: {
    //       padding: {
    //         left: 10,
    //         bottom: 20
    //       }
    //     },
    //     elements: {
    //       arc: {
    //         borderWidth: 2
    //       }
    //     },
    //     legend: {
    //       position: 'left',
    //       labels: {
    //         boxWidth: 20,
    //         fontColor: "white",
    //         padding: 8
    //       }
    //     },
    //     plugins: {
    //       datalabels: {
    //         display: true,
    //         padding: 5,
    //         anchor: 'center',
    //         align: 'center',
    //         color: ['#00a8ff', '#ffffff'],
    //         formatter: (val, ctx) => {
    //           return val + '%';
    //         },
    //       }
    //     },
    //   },


    // });


    // var addRadiusMargin = 10;

    // $('#pendingOrderPieChart').on('click', function (event) {
    //   var activePoints = pendingOrderPieChart.getElementsAtEvent(event);
    //   console.log(activePoints)
    //   if (activePoints.length > 0) {
    //     // update the newly selected piece
    //     // activePoints[0]['_model'].innerRadius = activePoints[0]['_model'].innerRadius;
    //     activePoints[0]['_model'].outerRadius = activePoints[0]['_model'].outerRadius + 20;
    //   }

    //   pendingOrderPieChart.render(
    //     {
    //       duration: 800,
    //       lazy: true,
    //       easing: 'easeOutBounce'
    //     }
    //   );
    // });



    //Promocode Chart 

    var promocodeChart = new Chart("promocodeChart", {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            data: [10, 250, 150, 81, 156, 75, 300],
            fill: false,
            borderColor: '#ffffff',
            order: 1,
            pointBorderColor: '#ffffff',
            pointBackgroundColor: '#ffffff',
            pointBorderWidth: 4,
            pointHoverBorderWidth: 3,
            pointHoverBackgroundColor: '#ffffff',
            pointStyle: 'circle',
            pointRadius: 4,
          }

        ],
      },
      options: {
        layout: {
          padding: {
            left: 15,
            right: 10,
            bottom: 5
          }
        },
        legend: {
          display: false,
          position: 'top',
          labels: {
            boxWidth: 8,
          }
        },
        scales: {
          yAxes: [{
            display: false,
            gridLines: {

              drawBorder: false,
              drawOnChartArea: false
            },
          }],
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
              drawOnChartArea: false
            },
          }],
        },
      },
    });


    // RAM Guages  Chart
    var ramgaugeChart = new Chart("ramgaugeChart", {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In progress', 'bad'],
        datasets: [{
          label: "Gauge",
          data: [60, 40, 30],
          backgroundColor: ['#ffffff', '#00f613', '#ff3030'],
          borderWidth: 1,
          weight: 2,
          borderDashOffset: 2,
          rotation: 10,
          borderJoinStyle: 'round'
        }]
      },
      options: {
        legend: {
          display: false
        },
        elements: {

        },
        circumference: Math.PI * 1,
        rotation: Math.PI * 1,
        aspectRatio: 1,
        cutoutPercentage: 80,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Doughnut Chart'
          }
        }
      },
    });


    //Vedio View Line Chart 1

    var vedioViewLineChart = new Chart("vedioViewLineChart", {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            data: [10, 130, 20, 190, 81, 250, 75, 30],
            fill: false,
            borderColor: '#05ff93',
            order: 1,
            pointRadius: 0
          }

        ],
      },
      options: {
        layout: {
          padding: {
            right: 10,
            top: 10
          }
        },
        legend: {
          display: false,
          position: 'top',
          labels: {
            boxWidth: 8,
          }
        },
        scales: {
          yAxes: [{
            display: false,
            gridLines: {

              drawBorder: false,
              drawOnChartArea: false
            },
          }],
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
              drawOnChartArea: false
            },
          }],
        },
      },
    });




    //Vedio Play Doughnut Chart
    var vedioplaydoughnutChart = new Chart("vedioplaydoughnutChart", {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In progress'],
        datasets: [{
          label: "Gauge",
          data: [90, 10],
          backgroundColor: ['#00ff91', '#fefefe'],
          borderWidth: 0,
          weight: 100,
          borderDashOffset: 2,
          rotation: 10,
          borderJoinStyle: 'round'
        }]
      },
      options: {
        elements: {

        },
        circumference: Math.PI,
        rotation: Math.PI * -0.5,
        cutoutPercentage: 80,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Doughnut Chart'
          }
        }
      },
    });



    var chartProgress = document.getElementById("chartProgress");
    if (chartProgress) {
      var myChartCircle = new Chart("chartProgress", {
        type: 'doughnut',
        data: {
          labels: ["Facebook", 'null'],
          datasets: [{
            label: "Population (millions)",
            backgroundColor: ["#5283ff"],
            data: [68, 48]
          }]
        },
        plugins: [{
          beforeDraw: function (chart: any) {
            var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;

            ctx.restore();
            var fontSize = (height / 100).toFixed(2);
            ctx.font = fontSize + "em sans-serif";
            ctx.fillStyle = "#9b9b9b";
            ctx.textBaseline = "middle";

            var text = "50%",
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;

            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        }],
        options: {
          legend: {
            display: false,
          },
          responsive: true,
          maintainAspectRatio: false,
          cutoutPercentage: 85
        }
      });
    }



    //ram Use One Semi Doughnut Chart
    var p = 0;
    var ramChartOne = new Chart("ramChartOne", {
      type: 'doughnut',
      data: {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [{
          label: "Gauge",
          data: [40, 20, 40, 30, 40, 10],
          backgroundColor: ['#ffffff', '#00f812', '#e6f904', '#ef6210', '#ff3030', '#ff3030'],
          borderWidth: 1,
          weight: 2,
          borderDashOffset: 2,
          rotation: 10,
          borderJoinStyle: 'round'
        }
        ]
      },
      plugins: [ChartDataLabels],
      options: {

        layout: {
          padding: 5
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        circumference: Math.PI * 1,
        rotation: Math.PI * 1,
        aspectRatio: 1,
        cutoutPercentage: 80,
        responsive: false,
        plugins: {
          datalabels: {
            display: true,
            color: '#ffffff',
            opacity: 0.5,
            anchor: 'end',
            clamp: true,
            align: 'top',
            formatter: function (value, context) {
              return context.chart.data.labels[context.dataIndex];
            }
          },
        }
      },
    });


    //ram Use One Semi Doughnut Chart
    var ramChartTwo = new Chart("ramChartTwo", {
      type: 'doughnut',
      data: {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [{
          label: "Gauge",
          data: [40, 20, 40, 30, 40, 10],
          backgroundColor: ['#ffffff', '#00f812', '#e6f904', '#ef6210', '#ff3030', '#ff3030'],
          borderWidth: 1,
          weight: 2,
          borderDashOffset: 2,
          rotation: 10,
          borderJoinStyle: 'round'
        }
        ]
      },
      plugins: [ChartDataLabels],
      options: {

        layout: {
          padding: 5
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        circumference: Math.PI * 1,
        rotation: Math.PI * 1,
        aspectRatio: 1,
        cutoutPercentage: 80,
        responsive: false,
        plugins: {
          datalabels: {
            display: true,
            color: '#ffffff',
            opacity: 0.5,
            anchor: 'end',
            clamp: true,
            align: 'top',
            formatter: function (value, context) {
              return context.chart.data.labels[context.dataIndex];
            }
          },
        }
      },
    });




  }


  get_Dashboard_details() {
    this.DashBoard_Service.get_Dashboard_details().subscribe((res: any) => {
      console.log(res, "dashboard api res check");
      this.Todays_TotalOrdersCount = ''
      this.Todays_TotalOrdersPercentage = ''
      this.MedimallGraphArray = []
      this.HealthCareGraphArray = []

      this.TotalOrdersCount = ''
      this.TotalOrdersPercentage = ''
      this.TotalOrdersGraphArray = []

      this.TotalProductsCount = ''
      this.TotalProductsPercentage = ''
      this.TotalProductsGraphArray = []

      this.TotalPendingOrderCount = ''
      this.TotalPendingOrderPercentage = ''
      this.TotalPendingOrdersGraphArray = []

      this.TotalRevenueCount = ''
      this.TotalRevenuePercentage = ''
      this.TotalRevenueGraphArray = []

      this.TotalProfitCount = ''
      this.TotalProfitPercentage = ''
      this.TotalProfitGraphArray = []

      this.TotalPrimeMembersCount = ''
      this.TotalPrimeMembersPercentage = ''
      this.TotalPrimeMembersGraphArray = []

      




      this.Todays_TotalOrdersCount = res.data.todayOrders.totalOrders
      this.Todays_TotalOrdersPercentage = res.data.todayOrders.grossPercentage
      this.HealthCareGraphArray = res.data.todayOrders.healthCareGraph
      this.MedimallGraphArray = res.data.todayOrders.medimallGraph

      this.TotalOrdersCount = res.data.totalOrders.totalOrders
      this.TotalOrdersPercentage = res.data.totalOrders.grossPercentage
      this.TotalOrdersGraphArray = res.data.totalOrders.graph

      this.TotalProductsCount = res.data.totalProducts.totalProducts
      this.TotalProductsPercentage = res.data.totalProducts.grossPercentage
      this.TotalProductsGraphArray = res.data.totalProducts.graph

      this.TotalPendingOrderCount = res.data.pendingOrders.totalPendingOrders
      this.TotalPendingOrderPercentage = res.data.pendingOrders.grossPercentage
      this.TotalPendingOrdersGraphArray = res.data.pendingOrders.graph

      this.TotalRevenueCount = res.data.totalRevenue.totalRevenue
      this.TotalRevenuePercentage = res.data.totalRevenue.grossPercentage
      this.TotalRevenueGraphArray = res.data.totalRevenue.graph

      this.TotalProfitCount = res.data.totalProfit.totalProfit
      this.TotalProfitPercentage = res.data.totalProfit.grossPercentage
      this.TotalProfitGraphArray = res.data.totalProfit.graph

      this.TotalPrimeMembersCount = res.data.totalPrimeMembers.totalPrimeMembers
      this.TotalPrimeMembersPercentage = res.data.totalPrimeMembers.grossPercentage
      this.TotalPrimeMembersGraphArray = res.data.totalPrimeMembers.graph

    

   

      //GRAPH DATA FOR DEVELOPER TESTING - DATA FETCH FROM API
      //Health care Chart 1

      var myChart = new Chart("myChart", {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              label: 'Health Care',
              data: this.HealthCareGraphArray,
              // data: [250, 120, 80, 35, 56, 10, 100],
              fill: false,
              borderColor: '#cc0088',
              order: 2,
              pointRadius: 3,
              borderJoinStyle: 'bevel',
              pointBorderColor: '#cc0088',
              pointBackgroundColor: '#cc0088',
              pointBorderWidth: 1,
              pointStyle: 'circle',
            },
            {
              label: 'Medimall',
              data: this.MedimallGraphArray,
              // data: [9, 30, 20,  155, 56, 55, 40],
              fill: false,
              borderColor: '#ffffff',
              order: 2,
              pointRadius: 3,
              borderJoinStyle: 'bevel',
              pointBorderColor: '#ffffff',
              pointBackgroundColor: '#ffffff',
              pointBorderWidth: 1,
              pointStyle: 'circle',
            }

          ],
        },
        options: {
          layout: {
            padding: {
              right: 10,
              bottom: 5
            }
          },
          legend: {
            position: 'left',
            align: 'start',
            labels: {
              boxWidth: 30,
              fontColor: "white",
            }
          },
          scales: {
            yAxes: [{
              display: false,
              gridLines: {
                drawBorder: false,
                drawOnChartArea: false
              },
            }],
            xAxes: [{
              display: false,
              gridLines: {
                display: false,
                drawOnChartArea: false
              },
            }],
          },
        },
      });


      //Total Order Doughnut Chart
      var deliveredData = {
        labels: [
          "Total Orders"
        ],
        datasets: [
          {
            data: this.TotalOrdersGraphArray,
            // data: [90, 15],
            backgroundColor: [
              "#69a78c",
              "#dddddd"
            ],

            borderWidth: [
              0, 1
            ]
          }]
      };

      var deliveredOpt = {
        // layout: {
        //   padding: 1
        // },
        cutoutPercentage: 80,
        curvature: 8,
        rotation: 180,
        animation: {
          animationRotate: true,
          duration: 2000
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      };

      var totalOrderdoughnutChart = new Chart("totalOrderdoughnutChart", {
        type: 'doughnut',
        data: deliveredData,
        options: deliveredOpt
      });




      //Medimall Bar chart 2

      var medimallBarChart = new Chart("medimallBarChart", {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              label: 'Total Products',
              // label: 'Pharmacy',
              data: this.TotalProductsGraphArray,
              // data: [100, 60, 40, 60, 55, 40, 65, 80, 25, 33],
              fill: true,
              backgroundColor: '#ffffff',
            }
            // ,
            // {
            //   label: 'Health Care',
            //   data: [50, 30, 20, 30, 40, 10, 25, 10, 75, 67],
            //   fill: true,
            //   borderColor: '#ffffff',
            //   backgroundColor: '#99850a'
            // }


          ],
        },
        options: {
          legend: {
            position: 'left',
            labels: {
              boxWidth: 10,
              fontColor: "white",
              padding: 8
            }
          },
          scales: {
            yAxes: [{
              display: false,
              gridLines: {
                drawBorder: false,
                drawOnChartArea: true
              },
            }],
            xAxes: [{
              display: false,
              gridLines: {
                display: false,
                drawOnChartArea: true
              },
            }],
          },
        },
      });





      //Pednding Orders Pie Chart 
      let segment;
      let selectedIndex;
      var pendingOrderPieChart = new Chart("pendingOrderPieChart", {
        type: 'pie',
        data: {
          labels: [
            'Delivered',
            'Pending'
          ],
          datasets: [{
            data: this.TotalPendingOrdersGraphArray,
            // data: [80, 20],
            backgroundColor: [
              '#ffffff',
              '#007bff'
            ],
            borderWidth: 3,
            //borderColor:'#007bff'
          }]
        },
        plugins: [ChartDataLabels],
        options: {
          layout: {
            padding: {
              left: 10,
              bottom: 20
            }
          },
          elements: {
            arc: {
              borderWidth: 2
            }
          },
          legend: {
            position: 'left',
            labels: {
              boxWidth: 20,
              fontColor: "white",
              padding: 8
            }
          },
          plugins: {
            datalabels: {
              display: true,
              padding: 5,
              anchor: 'center',
              align: 'center',
              color: ['#00a8ff', '#ffffff'],
              formatter: (val, ctx) => {
                return val + '%';
              },
            }
          },
        },


      });


      var addRadiusMargin = 10;

      $('#pendingOrderPieChart').on('click', function (event) {
        var activePoints = pendingOrderPieChart.getElementsAtEvent(event);
        console.log(activePoints)
        if (activePoints.length > 0) {
          // update the newly selected piece
          // activePoints[0]['_model'].innerRadius = activePoints[0]['_model'].innerRadius;
          activePoints[0]['_model'].outerRadius = activePoints[0]['_model'].outerRadius + 20;
        }

        pendingOrderPieChart.render(
          {
            duration: 800,
            lazy: true,
            easing: 'easeOutBounce'
          }
        );
      });


      //Total revenue Chart 1
      // var data1 = [0, 15, 0];
      // var data2 = [0, 0, 25, 0];
      var totalRevenueChart = new Chart("totalRevenueChart", {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              label: 'Medimall',
              fill: true,
              backgroundColor: '#00ad2f',
              pointRadius: 0,
              pointHitRadius: 10,
              showLine: true,
              data: this.TotalRevenueGraphArray,
              // data: data1,
              spanGaps: true
            },

            // {
            //   label: 'Subscription',
            //   fill: true,
            //   backgroundColor: '#ffffff',
            //   pointRadius: 0,
            //   pointHitRadius: 10,
            //   data: data2,
            // },

            // {
            //   label: 'Membership',
            //   data: [0, 0, 0, 35, 0],
            //   fill: true,
            //   backgroundColor: '#66ff76',
            //   pointRadius: 0,
            //   pointHitRadius: 10,
            // },

            // {
            //   data: [0, 0 ,0,0 ,20, 0 ],
            //   fill: true,
            //   backgroundColor: '#ffffff',
            //   pointRadius: 0,
            //   pointHitRadius: 10,
            // },



          ],
        },
        options: {
          layout: {
            padding: {
              bottom: 15
            }
          },
          plugins: {
            filler: {
              propagate: false
            }
          },
          legend: {
            position: 'left',
            labels: {
              boxWidth: 10,
              fontColor: "white",
              padding: 8
            }
          },
          scales: {
            yAxes: [{
              display: false,
              gridLines: {
                drawBorder: false,
                drawOnChartArea: false
              },
            }],
            xAxes: [{
              display: false,
              gridLines: {
                display: false,
                drawOnChartArea: false
              },
            }],

          },
        },
      });




       //Profit Bar chart 

    var profitBarChart = new Chart("profitBarChart", {
      type: 'bar',
      data: {
        labels: ['', '', '', '', '', '', ''],
        datasets: [
          {
            barThickness: 15,
            data: this.TotalProfitGraphArray,
            // data: [55, 65, 54, 60, 70, 60, 65],
            fill: true,
            backgroundColor: '#ffffff',
          },

        ],
      },
      plugins: [ChartDataLabels],
      options: {
        plugins: {
          datalabels: {
            display: true,
            color: '#ffffff',
            anchor: 'end',
            clamp: true,
            align: 'top',
            // formatter: (val, ctx) => {
            //   return ctx.chart.data.labels[ctx.dataIndex];
            // },
          }
        },
        legend: {
          position: 'right',
          display: false,
          labels: {
            boxWidth: 13,
          }
        },
        scales: {
          yAxes: [{
            display: false,
            gridLines: {
              drawBorder: false,
              drawOnChartArea: false
            },
          }],
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
              drawOnChartArea: false
            },
          }],
        },

      },
    });




      //Prime Members Line Bar chart 2

      var primeLineBarChart = new Chart("primeLineBarChart", {
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              type: 'bar',
              label: 'Prime Members',
              data:this.TotalPrimeMembersGraphArray,
              // data: [60, 40, 60, 55, 40, 65, 80, 25, 33],
              fill: true,
              backgroundColor: '#cacaca',
              order: 2
            }
            // ,
            // {
            //   type: 'bar',
            //   label: 'Non-Prime Members',
            //   data: [60, 40, 60, 55, 40, 65, 80, 25, 33],
            //   fill: true,
            //   borderColor: '#ffffff',
            //   backgroundColor: '#00000026',
            //   order: 3
            // },
            //   {
            //     type: 'line',
            //   label: 'Health Care',
            //   data: [60, 40, 60, 55, 40, 65,80,25,33],
            //   fill: true,
            //   borderColor: '#1aa9af',
            //   pointRadius:0,
            //   order:1
            // },
  
  
  
          ],
        },
        options: {
          legend: {
            //display:false,
            position: 'right',
            labels: {
              boxWidth: 10,
              fontColor: "white",
              padding: 8
            }
          },
          tooltips: {
            enabled: false
          },
          scales: {
            yAxes: [{
              display: false,
              gridLines: {
                drawBorder: false,
                drawOnChartArea: false
              },
            }],
            xAxes: [{
              display: false,
              gridLines: {
                display: false,
                drawOnChartArea: false
              },
            }],
          },
        },
      });













    })
  }



  pageRedirectTo(type: any) {
    if (type === 'TodaysOrder') {
      this._router.navigate(['/orders/new-order']);
    }
    else if (type === 'TotalOrder') {
      this._router.navigate(['/orders']);
    }
    else if (type === 'TotalProducts') {
      this._router.navigate(['/inventory']);
    }
    else if (type === 'PendingOrder') {
      this._router.navigate(['/orders/new-order']);
    }
    else if (type === 'TotalRevenue') {
      this._router.navigate(['/orders/new-order']);
    }
    else if (type === 'TotalProfit') {
      this._router.navigate(['/orders/new-order']);
    }
    else if (type === 'TotalprimeMembers') {
      this._router.navigate(['/premium']);
    }
    else if (type === 'Subscriptions') {
      this._router.navigate(['/subscriptions']);
    }
    else if (type === 'AverageOrderValue') {
      this._router.navigate(['']);
    }

  }

  public chart5 = chartData.chart5;

  lat = 20.5937;
  lng = 78.9629;

  clat = 56.1304;
  clng = 106.3468;

  alat = 25.2744;
  alng = 133.7751;

  blat = 14.2350;
  blng = 51.9253;
  labelName = "900"
  iconUrl: string = "assets/images/map/icon-map.svg"

  locationChoose: boolean = false;


  onChooselocation(event: any) {
    console.log(event)
    this.locationChoose = true;
  }

}
