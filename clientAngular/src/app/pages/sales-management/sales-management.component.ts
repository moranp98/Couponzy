import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageOrdersService } from 'src/app/services/manage-orders.service';
import { ManageCouponsService } from '../../services/manage-coupons.service';

import { Router } from '@angular/router';
import { Users } from '../../models/users';
import { Orders } from '../../models/orders';
import { Coupons } from '../../models/coupons';

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

  resultCouponeName: any[];
  resultCouponeNameToDisplayIntoTable: any[];

  single: any[] = [];
  data: any[] = []
  view: any[] = [];

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  dataMapReduceChartsPieGrid: any[];

  constructor(private _sharedService: SharedService,
    private _manageorders: ManageOrdersService,
    private ShowCouponsService: ManageCouponsService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
      this._sharedService.emitChange(this.pageTitle);
      Object.assign(this, { data });
      this.view = [innerWidth/1.2];
    }

  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)
    
    if (localStorage.getItem('user') == null || this.currentUser.role === 'seller') {
      this.router.navigate(['/roadstart-layout/sign-in-social']);
    } else {
      this.view = [innerWidth/1.2];
      this.showCoupons(this.currentUser.employerId);
      this.showOrders(this.currentUser.employerId);
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onSelect(event) {
    this.view = [innerWidth/1.2];
    console.log(event);
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
  
  showOrders(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this._manageorders.getAllOrders().subscribe((orders) => {
          this.orders = orders.filter(order => order.branch['shopId'] === shopId);
          console.log(this.orders);

          this.ordersListDisplay = this.orders.map(order => {
            return {...order, date: new Date(order.orderDate['_seconds'] * 1000)}
          })

          //For shopManager barChart
          this.dataMapReduceChartsPieGrid = this.orders
            .map(order => { return { branchName: order.coupon['couponName'], price: order.coupon['newPrice']}})
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.branchName]) {
                obj[orderC.branchName] = 1;
              } else {
                obj[orderC.branchName] += Number(orderC.price);
              }
              return obj;
            }, []);
          
          const checkCouponNameReleventToShop = this.orders
            .map(order => { return { name: order.coupon['couponName'] } })
          this.resultCouponeName = Array.from(checkCouponNameReleventToShop
            .reduce((m, t) => m.set(t.name, t), new Map())
            .values());
            console.log(this.resultCouponeName)
            
          this.data = this.resultCouponeName.map(coupon => { return {'name': coupon['name'], 'value': this.dataMapReduceChartsPieGrid[coupon['name']]} })
          this.single = this.data

          /*const couponNameTotalSale = this.coupons.map(coupon => {
            return { couponName: coupon.couponName, total: 0 }
          });*/
          /*const couponNameTotalSale = this.coupons.map(coupon => {
            return coupon.couponName
          });
          console.log(couponNameTotalSale)
          const couponNameTotalSale2 = couponNameTotalSale.map(coupon => {
            return { name: coupon, total: this.dataMapReduceChartsPieGrid[coupon] }
          });
          console.log(couponNameTotalSale2)

          couponNameTotalSale.forEach(name => {
            if (this.isCouponSale(name) > 0){

            }
          });
          
          console.log(couponNameTotalSale2)
          /*couponNameTotalSale.forEach(coupon => {
            coupon = this.dataMapReduceChartsPieGrid[coupon['coupon']]
            //console.log(coupon['couponName'])
          })*/
          /*this.resultCouponeNameToDisplayIntoTable = couponNameTotalSale
            .map(coupon => { return { couponName: coupon.couponName, total: coupon.total}})
            .reduce(function (obj, orderC, arr) {
              if (!obj[orderC.couponName]) {
                obj[orderC.couponName] = 1;
              } else {
                obj[orderC.couponName] += Number(orderC.total);
              }
              return obj;
            }, []);

          console.log(this.resultCouponeNameToDisplayIntoTable)
          console.log(this.resultCouponeName);*/
          

          /*this.resultCouponeNameToDisplayIntoTable.forEach(coupon => {
            //coupon['total'] = this.dataMapReduceChartsPieGrid[coupon['couponName']];
             if (this.resultCouponeName.find(c => c['name'] === coupon['couponName'])){
              coupon['total'] = this.dataMapReduceChartsPieGrid[coupon['couponName']];
            } else {
              coupon['total'] = 0;
            }
          })
          console.log(this.resultCouponeNameToDisplayIntoTable)*/
        });
        break;
      default: // role --> 'admin'

        break;
    }
  }

  isCouponSale(couponName: string) {
    if (!this.resultCouponeName.find(coupon => coupon['name'] === couponName)){
      return 0;
    } else {
      return this.dataMapReduceChartsPieGrid[couponName];
    }
  }
}