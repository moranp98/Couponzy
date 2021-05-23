import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { RealtimeService } from '../../services/realtime.service';
import { FirebaseService } from '../../services/firebase.service';

import { ManageUsersService } from '../../services/manage-users.service';
import { ManageCouponsService } from 'src/app/services/manage-coupons.service';
import { ManageBranchesService } from 'src/app/services/manage-branches.service';
import { ManageOrdersService } from 'src/app/services/manage-orders.service';
import { ManageShopsService } from 'src/app/services/manage-shops.service';

import { Orders } from '../../models/orders';
import { Shops } from 'src/app/models/shops';
import { Router } from '@angular/router';
import { Users } from '../../models/users';
import { Branches } from 'src/app/models/branches';

@Component({
  selector: 'page-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit {
  pageTitle: string = 'עמוד ראשי';

  @Input() borderW: number = 1;

  // Amount of users connected
  counter: Number;
  countAllUsers: Number;
  countAllBranches: Number;
  countIsOpenBranches: Number;
  countAllCoupons: Number;
  countValidCoupons: Number;

  // For shopManager
  countOfBranchesByShopId: Number;
  quantityCouponsSoldToday: Number;
  revenueCouponsSoldToday: Number;

  lastUsers: Users[] = [];

  orders: Orders[] = [];
  shops: Shops[] = [];
  
  branches: Branches[] = [];
  currentUser: Users;

  dataMapReduceBarChart: any[];
  RevenueFromSalesByShopBranch: number[] = [];
  RevenueFromSalesByCouponType: number[] = [];
  
  dataMapReduceRadarChart: any[];

  recentPurchases: any[] = [];
  recentPurchasesDate: any[] = [];

  @Output() isLogout = new EventEmitter<void>()

  // Constractor
  constructor(private _sharedService: SharedService,
    private _realtime: RealtimeService,
    private _manageusers: ManageUsersService,
    private _managebranches: ManageBranchesService,
    private _managecoupons: ManageCouponsService,
    private _manageorders: ManageOrdersService,
    private _manageshops: ManageShopsService,
    public firebaseService: FirebaseService,
    private router: Router) {

      var currentUser2 = localStorage.getItem('userDetails');
      this.currentUser = JSON.parse(currentUser2)
      console.log(this.currentUser);

    this.countAllBranches = 0;
    this._sharedService.emitChange(this.pageTitle);
    this._realtime.listen('count').subscribe((res: any) => {
      this.counter = res
    });
  }

  async ngOnInit() {
    

    if (localStorage.getItem('user') == null || this.currentUser.role === 'seller') {
      this.router.navigate(['/roadstart-layout/sign-in-social']);
    } else {
      switch (this.currentUser.role) {
        case 'shopManager':
          this._managebranches.getCountBranchesByShopId(this.currentUser.employerId).subscribe(countOfBranchesByShopId => this.countOfBranchesByShopId = countOfBranchesByShopId);
          break;
        default: // role --> 'admin'
          this._manageusers.getCountUsers().subscribe(countAllUsers => this.countAllUsers = countAllUsers);
          this._managebranches.getCountBranches().subscribe(countAllBranches => this.countAllBranches = countAllBranches);
          this._managebranches.getCountIsOpenBranches().subscribe(countIsOpenBranches => this.countIsOpenBranches = countIsOpenBranches);
          this._managecoupons.getCountCoupons().subscribe(countAllCoupons => this.countAllCoupons = countAllCoupons);
          this._managecoupons.getCountValidCoupons().subscribe(countValidCoupons => this.countValidCoupons = countValidCoupons);
          break;
      }

      this.showUsers(this.currentUser.employerId);
      this.showBarChartLabels(this.currentUser.employerId);
    } 
  }

  showUsers(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this._manageusers.getLastUsers().subscribe((lastUsers) => {
          this.lastUsers = lastUsers.filter(user => user.employerId === shopId);
        });
        break;
      default: // role --> 'admin'
        this._manageusers.getLastUsers().subscribe((lastUsers) => {
          this.lastUsers = lastUsers;
          console.log(this.lastUsers)
        });
        break;
    }
  }

  logout() {
    this.firebaseService.logout()
    this.isLogout.emit()
  }

  showBarChartLabels(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this._managebranches.getAllBranchesByShopId(shopId).subscribe((branches) => {
          this.branches = branches.filter(branch => branch.isExists !== false);
          this.barChartLabels = this.branches.map((branch) => branch.branchName);
          this.showOrders(this.currentUser.employerId);
        });
        break;
      default: // role --> 'admin'
        this._manageshops.getAllShops().subscribe((shops) => {
          this.shops = shops.filter(shop => shop.isExists !== false);
          this.barChartLabels = this.shops.map((shop) => shop.shopName);
          this.showOrders(this.currentUser.employerId);
        });
        break;
    }
  }

  showOrders(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this._manageorders.getAllOrders().subscribe((orders) => {
          this.orders = orders.filter(order => order.branch['shopId'] === shopId);
          console.log(this.orders)
          this.recentPurchasesDate = this.orders
            .map(order => { return new Date(order.orderDate['_seconds'] * 1000) })
            .reverse()
            .slice(0, 10);
          this.recentPurchases = this.orders
            .reverse()
            .slice(0, 10);

          //For shopManager barChart
          this.dataMapReduceBarChart = this.orders
            .map(order => { return { branchName: order.branch['branchName'], price: order.coupon['newPrice']}})
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.branchName]) {
                obj[orderC.branchName] = orderC.price;
              } else {
                obj[orderC.branchName] += Number(orderC.price);
              }
              return obj;
            }, []);
            
          this.barChartLabels.forEach(branch => {
            this.RevenueFromSalesByShopBranch.push(this.dataMapReduceBarChart[branch]);
          });
          this.barChartData["data"] = (this.RevenueFromSalesByShopBranch);
          
          //For shopManager Radar
          const checkCouponeTypeReleventToShop = this.orders.map(order => { return { shopId: order.branch['shopId'], couponTypeName: order.coupon['couponTypeName'] } })
          const resultCouponeTypeName = Array.from(checkCouponeTypeReleventToShop.
            reduce((m, t) => m.set(t.couponTypeName, t), new Map())
            .values());
          this.radarChartLabels = resultCouponeTypeName.map((couponType) => couponType.couponTypeName);

          this.dataMapReduceRadarChart = this.orders
            .map(order => { return { couponTypeName: order.coupon['couponTypeName'], price: order.coupon['newPrice'] } })
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.couponTypeName]) {
                obj[orderC.couponTypeName] = orderC.price;
              } else {
                obj[orderC.couponTypeName] += Number(orderC.price);
              }
              return obj;
            }, []);

          this.radarChartLabels.forEach(couponType => {
            this.RevenueFromSalesByCouponType.push(this.dataMapReduceRadarChart[couponType]);
          });
          this.radarChartData["data"] = (this.RevenueFromSalesByCouponType);

          //For shopManager dashboard Cards
          this.quantityCouponsSoldToday = this.orders.filter(order => new Date(order.orderDate['_seconds'] * 1000).getDate() === new Date().getDate()).length;
          this.revenueCouponsSoldToday = this.orders
            .filter(order => { return new Date(order.orderDate['_seconds'] * 1000).getDate() === new Date().getDate() })
            .reduce(function (accumulator, order) {
              return accumulator + Number(order.coupon['newPrice']);
            }, 0);
        });
        break;
      default: // role --> 'admin'
        this._manageorders.getAllOrders().subscribe((orders) => {
          this.orders = orders;
          this.recentPurchasesDate = this.orders
            .map(order => { return new Date(order.orderDate['_seconds'] * 1000) })
            .reverse()
            .slice(0, 10);
          this.recentPurchases = this.orders
            .reverse()
            .slice(0, 10);
          console.log(this.orders)

          //For admin barChart
          this.dataMapReduceBarChart = this.orders
            .map(order => { return { shopName: order.branch['shopName'], price: order.coupon['newPrice'] } })
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.shopName]) {
                obj[orderC.shopName] = 1;
              } else {
                obj[orderC.shopName] += Number(orderC.price);
              }
              return obj;
            }, []);
          this.barChartLabels.forEach(shop => {
            this.RevenueFromSalesByShopBranch.push(this.dataMapReduceBarChart[shop]);
          });
          this.barChartData["data"] = (this.RevenueFromSalesByShopBranch);

          //For shopManager Radar
          const checkCouponeTypeReleventToShop = this.orders.map(order => { return { shopId: order.branch['shopId'], couponTypeName: order.coupon['couponTypeName'] } })
          const resultCouponeTypeName = Array.from(checkCouponeTypeReleventToShop
            .reduce((m, t) => m.set(t.couponTypeName, t), new Map())
            .values());
          this.radarChartLabels = resultCouponeTypeName.map((couponType) => couponType.couponTypeName);
          
          this.dataMapReduceRadarChart = this.orders
            .map(order => { return { couponTypeName: order.coupon['couponTypeName'], price: order.coupon['newPrice'] } })
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.couponTypeName]) {
                obj[orderC.couponTypeName] = orderC.price;
              } else {
                obj[orderC.couponTypeName] += Number(orderC.price);
              }
              return obj;
            }, []);
            console.log(this.dataMapReduceRadarChart)
          this.radarChartLabels.forEach(couponType => {
            if(this.dataMapReduceRadarChart[couponType]){
              this.RevenueFromSalesByCouponType.push(this.dataMapReduceRadarChart[couponType]);
            } else {
              this.RevenueFromSalesByCouponType.push(0);
            }        
          });
          console.log(this.radarChartLabels)
          this.radarChartData["data"] = (this.RevenueFromSalesByCouponType);
          console.log(this.RevenueFromSalesByCouponType)
        });
        break;
    }
  }

  // <----- barChart: Revenue From Sales By Branches/Shops ----->
  public barChartData: any[] = [
    {
      data: this.RevenueFromSalesByShopBranch,
      label: 'הכנסות מכל התקופות',
      borderWidth: this.borderW,
      pointRadius: 1
    }
  ];
  public barChartLabels: string[] = [];
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    responsiveAnimationDuration: 500
  };
  public barChartLegend: boolean = true;
  public barChartType: string = 'bar';

  // <----- Radar: Revenue From Sales By couponTypes ----->
  public radarChartData: any = [
    {
      data: this.RevenueFromSalesByCouponType,
      label: 'הכנסות מכל התקופות',
      borderWidth: 1,
      pointRadius: 1
    }
  ];
  public radarChartLabels: string[] = [];
  public radarChartType: string = 'radar';
  public radarChartColors: any[] = [
    {
      backgroundColor: 'rgba(93,173,224,0.2)',
      borderColor: '#5dade0',
      pointBackgroundColor: '#5dade0',
      pointBorderColor: '#0e7cc5',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#000'
    }
  ];
}