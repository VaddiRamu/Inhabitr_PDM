import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../services/items.service';
import { SearchService } from '../services/search.service';

import { DashboardService } from '../services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  showMenu = false;
  dashboardCounts: any = {};
  dashboardData:any = {};
  mySubscription: any;
  cards = [];
  constructor(private auth: AuthenticateService,
              private spinner: NgxSpinnerService,
              private shop: ItemsService,
              private route: Router,
              private dashboardservice: DashboardService,
             ) {
                // tslint:disable-next-line: only-arrow-functions
                this.route.routeReuseStrategy.shouldReuseRoute = function() {
                  return false;
                };
                this.mySubscription = this.route.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    // Trick the Route into believing it's last link wasn't previously loaded
                    this.route.navigated = false;
                  }
                }); }
  ngOnInit() {
    this.auth.currentMessage.subscribe(message => this.showMenu = message);
    // this.getCounts();
    this.getDashboardCounts();
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  // getCounts() {
  //   this.spinner.show();
  //   this.shop.getCounts().subscribe(
  //     resp => {
  //       this.spinner.hide();
  //       this.dashboardCounts = resp;
  //     },
  //     err => {
  //       this.spinner.hide();
  //     }
  //   );
  // }

  getDashboardCounts() {
    this.spinner.show();
    this.dashboardservice.getDashboardData().subscribe(
      resp => {
        this.spinner.hide();
        this.dashboardData = resp;
        this.cards = [{
            url: '/admin/products/list',
            image: 'assets/img/dashboard/Total_products.png',
            data: this.numberWithCommas(this.dashboardData.totalProduct),
            title: 'Total Products',
            class: 'tb',
            class2: 'pr-0 pointer',
            class3: 'ml-3',
            class4: 'pt-3'
          },
          {
            url: '/admin/products/list',
            // params: {publish: true},
            image: 'assets/img/dashboard/total-supplier.png',
            data: this.numberWithCommas(this.dashboardData.totalSupplier),
            title: 'Total Suppliers',
            class: 'pp',
            class2: 'pr-0 pointer',
            class3: 'ml-4 pl-1',
            class4: 'pt-3'
          },
          {
            url: '/admin/products/list',
            // params: { unpublish: true },
            image: 'assets/img/dashboard/warehouse.png',
            data: this.numberWithCommas(this.dashboardData.totalWarehouse),
            title: 'Warehouses',
            class: 'up',
            class2: 'pr-0 pointer',
            class3: 'ml-2',
            class4: 'pt-3'
          },
          {
            url: '/admin/quote/list/all',
            image: 'assets/img/dashboard/customer.png',
            data: this.numberWithCommas(this.dashboardData.totalCustomer),
            title: 'Total Customers',
            class: 'mb',
            class2: 'pr-0 pointer',
            class3: 'ml-3',
            class4: ''
          },
          {
            url: '/admin/moodboard/list/all',
            image: 'assets/img/dashboard/Published_Quotes.png',
            data: this.numberWithCommas(this.dashboardData.totalMoodboard),
            title: 'Total Moodboards',
            class: 'pq',
            class2: 'pr-0 pointer',
            class3: 'ml-3',
            class4: ''
          },
          {
            url: '/admin/quote/orders/all',
            image: 'assets/img/dashboard/Order_Created.png',
            data: this.numberWithCommas(this.dashboardData.totalOrder),
            title: 'Total Orders',
            class: 'orc',
            class2: 'pr-0 pointer',
            class3: 'ml-3 pl-1',
            class4: ''
          },
          {
            url: '/admin/supplierHistory',
            image: 'assets/img/dashboard/history.png',
            // data: this.numberWithCommas(this.dashboardData.totalOrder),
            title: 'Dashboard History for Supplier Load ',
            class: 'orc',
            class2: 'pr-0 pointer',
            class3: 'ml-3 pl-1',
            class4: ''
          },
          {
            url: '/admin/projects/list',
            image: 'assets/img/dashboard/project-management.png',
            data: this.numberWithCommas(this.dashboardData.totalProject),
            title: 'Total Projects',
            class: 'pq',
            class2: 'pr-0 pointer',
            class3: 'ml-3',
            class4: ''
          }
        ];
      },
      err => {
        this.spinner.hide();
      }
    );
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
}
