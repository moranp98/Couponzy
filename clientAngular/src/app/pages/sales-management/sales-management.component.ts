import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageOrdersService } from 'src/app/services/manage-orders.service';
import { ManageCouponsService } from '../../services/manage-coupons.service';
import { ManageBranchesService } from '../../services/manage-branches.service';

import { Router } from '@angular/router';
import { Users } from '../../models/users';
import { Orders } from '../../models/orders';
import { Coupons } from '../../models/coupons';
import { Branches } from '../../models/branches';

import { ChartType } from 'chart.js';

export var data = [];

@Component({
  selector: 'sales-management',
  templateUrl: './sales-management.component.html',
  styleUrls: ['./sales-management.component.scss']
})
export class PageSalesManagementComponent implements OnInit {
  pageTitle: string = 'נתוני מכירות';

  currentUser: Users;
  orders: Orders[] = [];
  ordersListDisplay: any[] = [];
  coupons: Coupons[] = [];
  branches: Branches[] = [];

  dataMapReduceChartsPieGrid: any[];
  resultCouponName: any[];
  amountCouponsRevenueToDisplayIntoTable: any[];

  dataMapReduceDoughnutChart: any[];
  resultBranchName: any[];
  amountBranchesRevenueToDisplayIntoTable: any[];
  // <------- For ngx-charts-pie-grid ------->
  data: any[] = []
  view: any[] = [];
  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  // events
  onSelect(event) {
    this.view = [innerWidth / 1.2];
    console.log(event);
  }

  // <-------   For doughnut Chart   ------->
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[] = [];

  public donutColors=[
    {
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        '#FFB1F6',
        '#BCD0EB',
        '#ADFFB0',
        '#E8D292',
        '#FFDBDB',
        '#FAE6FF',
        '#FCEDED',
        '#E8A595',
        '#EDA4D6',
        '#FEE1CE',
        '#7574FF',
        '#14E3FF'
    ]
    }
  ];
  // <-------------- To get RandomColor: Not used yet -------------->
  /*getRandomColor() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while(length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }*/

  public doughnutChartType: ChartType = 'doughnut';
  // events
  public chartClicked(e:any):void {
    this.view = [innerWidth / 1.2]; // use doughnut Chart to update the dimensions of the Pie-Grid chart
    console.log(e);
  }

  constructor(private _sharedService: SharedService,
    private _manageorders: ManageOrdersService,
    private ShowCouponsService: ManageCouponsService,
    private ShowBranchesService: ManageBranchesService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
    this._sharedService.emitChange(this.pageTitle);
    Object.assign(this, { data });
    this.view = [innerWidth / 1.2];
  }

  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)

    if (localStorage.getItem('user') == null || this.currentUser.role !== 'shopManager') {
      this.router.navigate(['/roadstart-layout/sign-in-social']);
    } else {
      this.view = [innerWidth / 1.2];
      this.showCoupons(this.currentUser.employerId);
      this.showBranches(this.currentUser.employerId);
      this.showOrders(this.currentUser.employerId);
    }
  }

  showCoupons(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this.ShowCouponsService.getCoupons().subscribe((coupons) => {
          this.coupons = coupons.filter(coupon => (coupon.isExists !== false && coupon.shop.id === shopId));
          console.log(this.coupons)
        });
        break;
      default: // role --> 'admin'

        break;
    }
  }

  showBranches(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this.ShowBranchesService.getBranches().subscribe((branches) => {
          this.branches = branches.filter(branch => (branch.isExists !== false && branch.shop.id === shopId));
          console.log(this.branches)
        });
        break;
      default: // role --> 'admin'

        break;
    }
  }

  showOrders(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this._manageorders.getAllOrders().subscribe((orders) => {
          this.orders = orders.filter(order => order.branch['shopId'] === shopId);
          console.log(this.orders);

          this.ordersListDisplay = this.orders.map(order => {
            return { ...order, date: new Date(order.orderDate['_seconds'] * 1000) }
          })

          // <-------------- For shopManager ngx-charts-pie-grid -------------->
          this.dataMapReduceChartsPieGrid = this.orders
            .map(order => { return { couponName: order.coupon['couponName'], price: order.coupon['newPrice'] } })
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.couponName]) {
                obj[orderC.couponName] = orderC.price;
              } else {
                obj[orderC.couponName] += orderC.price;
              }
              return obj;
            }, []);

          const checkCouponNameReleventToShop = this.orders
            .map(order => { return { name: order.coupon['couponName'] } })

          this.resultCouponName = Array.from(checkCouponNameReleventToShop
            .reduce((m, t) => m.set(t.name, t), new Map())
            .values());

          this.data = this.resultCouponName.map(coupon => { return { 'name': coupon['name'], 'value': this.dataMapReduceChartsPieGrid[coupon['name']] } })

          //For shopManager All Coupons Table
          this.coupons.map(coupon => {
            var isExists = this.resultCouponName.find(couponName => couponName['name'] === coupon.couponName)
            if (!isExists) {
              this.data.push({ 'name': coupon.couponName, 'value': 0 })
              return this.resultCouponName.find(couponName => couponName['name'] === coupon.couponName)
            } else {
              return this.resultCouponName.find(couponName => couponName['name'] === coupon.couponName)
            }
          });

          // Revenue amount from all Coupons
          this.amountCouponsRevenueToDisplayIntoTable = this.data
            .map(coupon => { return { couponName: coupon['name'], total: coupon['value'] } })
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.couponName]) {
                obj[orderC.couponName] = orderC.total;
              } else {
                obj[orderC.couponName] += orderC.total;
              }
              return obj;
            }, []);
          
          // <-------------- For shopManager For doughnut Chart -------------->
          this.dataMapReduceDoughnutChart = this.orders
            .map(order => { return { branchName: order.branch['branchName'], price: order.coupon['newPrice'] } })
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.branchName]) {
                obj[orderC.branchName] = orderC.price;
              } else {
                obj[orderC.branchName] += orderC.price;
              }
              return obj;
            }, []);
          console.log(this.dataMapReduceDoughnutChart)
          const checkBranchNameReleventToShop = this.orders
            .map(order => { return { name: order.branch['branchName'] } })

          this.resultBranchName = Array.from(checkBranchNameReleventToShop
            .reduce((m, t) => m.set(t.name, t), new Map())
            .values());
          console.log(this.resultBranchName)
          //this.data = this.resultCouponName.map(coupon => { return { 'name': coupon['name'], 'value': this.dataMapReduceChartsPieGrid[coupon['name']] } })
            const dataDoughnutChart = this.resultBranchName.map(branch => { return { 'name': branch['name'], 'value': this.dataMapReduceDoughnutChart[branch['name']] } })
          
            //For shopManager All Branches Table
          this.branches.map(branch => {
            var isExists = this.resultBranchName.find(branchName => branchName['name'] === branch.branchName)
            if (!isExists) {
              dataDoughnutChart.push({ 'name': branch.branchName, 'value': 0 })
              return this.resultBranchName.find(branchName => branchName['name'] === branch.branchName)
            } else {
              return this.resultBranchName.find(branchName => branchName['name'] === branch.branchName)
            }
          });
          console.log(dataDoughnutChart)

          dataDoughnutChart.forEach(branch => {
            this.doughnutChartLabels.push(branch.name)
            this.doughnutChartData.push(branch.value)
          })
          // Revenue amount from all Coupons
          this.amountBranchesRevenueToDisplayIntoTable = dataDoughnutChart
            .map(branch => { return { branchName: branch['name'], total: branch['value'] } })
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.branchName]) {
                obj[orderC.branchName] = orderC.total;
              } else {
                obj[orderC.branchName] += orderC.total;
              }
              return obj;
            }, []);

            console.log(this.amountBranchesRevenueToDisplayIntoTable)
            console.log(this.doughnutChartLabels)
            console.log(this.doughnutChartData)
        });
        break;
      default: // role --> 'admin'

        break;
    }
  }
}