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
  showLastUsers: any[] = [];

  orders: Orders[] = [];
  shops: Shops[] = [];
  dataMapReduce: any[];
  branches: Branches[] = [];

  currentUser: Users;

  RevenueFromSales: number[] = [];
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
    this.countAllBranches = 0;
    this._sharedService.emitChange(this.pageTitle);
    this._realtime.listen('count').subscribe((res: any) => {
      this.counter = res
    });
  }

  ngOnInit() {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)

    if (localStorage.getItem('user') == null || this.currentUser.role === 'seller') {
      this.router.navigate(['/roadstart-layout/sign-in-social']);
    }

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
    this.showOrders(this.currentUser.employerId);
  }

  showUsers(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this._manageusers.getLastUsers().subscribe((lastUsers) => {
          this.lastUsers = lastUsers.filter(user => user.employerId === shopId);
          this.showLastUsers = this.lastUsers.map(user => {
            return {
              profile_User: user.profile_User,
              /*firstName: user.userName.firstName,
              lastName: user.userName.lastName,*/
              email: user.email,
              //city: user.address.city,
              role: user.role,
              phoneNumber: user.phoneNumber
            }
          });
        });
        break;
      default: // role --> 'admin'
        this._manageusers.getLastUsers().subscribe((lastUsers) => {
          this.lastUsers = lastUsers;
          console.log(this.lastUsers)
          this.showLastUsers = this.lastUsers.map(user => {
            return {
              profile_User: user.profile_User,
              /*firstName: user.userName.firstName,
              lastName: user.userName.lastName,*/
              email: user.email,
              //city: user.address.city,
              role: user.role,
              phoneNumber: user.phoneNumber
            }
          });
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
        });
        break;
      default: // role --> 'admin'
        this._manageshops.getAllShops().subscribe((shops) => {
          this.shops = shops.filter(shop => shop.isExists !== false);
          this.barChartLabels = this.shops.map((shop) => shop.shopName);
        });
        break;
    }
  }

  showOrders(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this._manageorders.getAllOrders().subscribe((orders) => {
          this.orders = orders.filter(order => order.branch['shopId'] === shopId);

          this.recentPurchasesDate = this.orders
            .map(order => { return new Date(order.orderDate['_seconds'] * 1000) }).reverse().slice(0, 5);
          this.recentPurchases = this.orders.reverse().slice(0, 5);
          this.dataMapReduce = this.orders
            .map(order => { return { branchName: order.branch['branchName'], price: order.coupon['newPrice'] } })
            .reduce(function (obj, shopc, arr) {
              if (!obj[shopc.branchName]) {
                obj[shopc.branchName] = 1;
              } else {
                obj[shopc.branchName] += Number(shopc.price);
              }
              return obj;
            }, []);
          this.barChartLabels.forEach(branch => {
            this.RevenueFromSales.push(this.dataMapReduce[branch]);
          });
          this.barChartData["data"] = (this.RevenueFromSales);

          //For shopManager dashboard Cards
          this.quantityCouponsSoldToday = this.orders.filter(order => new Date(order.orderDate['_seconds'] * 1000).getDate() === new Date().getDate()).length;
          this.revenueCouponsSoldToday = this.orders
            .filter(order => { return new Date(order.orderDate['_seconds'] * 1000).getDate() === new Date().getDate()})
            .reduce(function (accumulator, order) {
              return accumulator + Number(order.coupon['newPrice']);
            }, 0);
        });
        break;
      default: // role --> 'admin'
        this._manageorders.getAllOrders().subscribe((orders) => {
          this.orders = orders;
          this.recentPurchasesDate = this.orders
            .map(order => { return new Date(order.orderDate['_seconds'] * 1000) }).reverse().slice(0, 5);
          this.recentPurchases = this.orders.reverse().slice(0, 5);
          this.dataMapReduce = this.orders
            .map(order => { return { shopName: order.branch['shopName'], price: order.coupon['newPrice'] } })
            .reduce(function (obj, shopc, arr) {
              if (!obj[shopc.shopName]) {
                obj[shopc.shopName] = 1;
              } else {
                obj[shopc.shopName] += Number(shopc.price);
              }
              return obj;
            }, []);
          this.barChartLabels.forEach(shop => {
            this.RevenueFromSales.push(this.dataMapReduce[shop]);
          });
          this.barChartData["data"] = (this.RevenueFromSales);
        });
        break;
    }
  }

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    responsiveAnimationDuration: 500
  };

  // All shops
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    {
      data: this.RevenueFromSales,
      label: 'הכנסות ממכירת קופונים לפי רשתות/חנויות',
      borderWidth: this.borderW,
      pointRadius: 1
    }
  ];
}