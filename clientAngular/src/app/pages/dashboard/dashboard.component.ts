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
import { lastUsers } from '../../models/lastUsers';
import { Shops } from 'src/app/models/shops';
import { Router } from '@angular/router';

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
  countOfUsers: Number;
  countOfBranches: Number;
  countIsOpenBranches: Number;
  countCoupons: Number;
  countValidCoupons: Number;

  lastUsers: lastUsers[] = [];
  showLastUsers: any[] = [];

  orders: Orders[] = [];
  shops: Shops[] = [];
  chartBar: any[] = [];
  shopK: any[];
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
    this.countOfBranches = 0;
    this._sharedService.emitChange(this.pageTitle);
    this._realtime.listen('count').subscribe((res: any) => {
      this.counter = res
    });
    this._manageusers.getCountUsers().subscribe(countOfUsers => this.countOfUsers = countOfUsers);
    this._managebranches.getCountBranches().subscribe(countOfBranches => this.countOfBranches = countOfBranches);
    this._managebranches.getCountIsOpenBranches().subscribe(countIsOpenBranches => this.countIsOpenBranches = countIsOpenBranches);
    this._managecoupons.getCountCoupons().subscribe(countCoupons => this.countCoupons = countCoupons);
    this._managecoupons.getCountValidCoupons().subscribe(countValidCoupons => this.countValidCoupons = countValidCoupons);
  }

  ngOnInit() {
    this.showUsers();
    this.showOrders();
    this.showShops();
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/roadstart-layout/sign-in-social']);
      }
  }

  showUsers() {
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
    })
  }

  logout(){
    this.firebaseService.logout()
    this.isLogout.emit()
  }

  showShops() {
    this._manageshops.getAllShops().subscribe((shops) => {
      this.shops = shops;
      this.barChartLabels = this.shops.map((shop) => shop.shopName);
    })
  }

  arr: number[] = [];
  Lastcoupons: any[] = [];
  LastDateCoupons: any[] = [];
 
  showOrders() {
    this._manageorders.getAllOrders().subscribe((orders) => {
      this.orders = orders.filter(order => {
        return order.coupon != null
      });

      this.chartBar = this.orders.map(order => { return order.coupon });
      this.LastDateCoupons = this.orders.map(order => { return order.orderDate }).reverse().slice(0, 5);
      this.Lastcoupons = this.chartBar.reverse().slice(0, 5);

      this.shopK = this.chartBar
      .map(z => {return { shopName: z.shop['shopName'], price: z.newPrice }})
      .reduce(function (obj, shopc, arr) {
        if (!obj[shopc.shopName]) {
          obj[shopc.shopName] = 1;
        } else {
          obj[shopc.shopName] += shopc.price;
        }
        return obj;
      }, []);
  
      this.barChartLabels.forEach(shop => {
        this.arr.push(this.shopK[shop]);
      });
      this.barChartData["data"] = (this.arr);
    });

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
      data: this.arr,
      label: 'מכירת קופונים ב48 שעות אחרונות',
      borderWidth: this.borderW,
      pointRadius: 1
    }
  ];

}