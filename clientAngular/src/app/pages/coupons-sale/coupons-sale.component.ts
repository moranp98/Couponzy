import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageCouponsService } from '../../services/manage-coupons.service';
import { ManageBranchesService } from 'src/app/services/manage-branches.service';
import { ManageOrdersService } from 'src/app/services/manage-orders.service';
import { Coupons } from '../../models/coupons';
import { Users } from '../../models/users';
import { Branches } from 'src/app/models/branches';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';

import { ManageShopsService } from 'src/app/services/manage-shops.service';
import { Shops } from 'src/app/models/shops';
import { ManageCouponTypesService } from 'src/app/services/manage-couponTypes.service';

const details: any[] = [
  {
    icon: 'image',
    badge: false,
    title_row: 'תמונה'
  },
  {
    icon: 'code',
    badge: false,
    title_row: 'קוד קופון'
  },
  {
    icon: 'sell',
    badge: false,
    title_row: 'שם קופון'
  },
  {
    icon: 'description',
    badge: false,
    title_row: 'תיאור'
  },
  {
    icon: 'money_off',
    badge: false,
    title_row: 'מחיר קודם'
  },
  {
    icon: 'attach_money',
    badge: false,
    title_row: 'מחיר נוכחי'
  },
  {
    icon: 'date_range',
    badge: false,
    title_row: 'תאריך תפוגה'
  },
  {
    icon: 'star',
    badge: false,
    title_row: 'דירוג ממוצע'
  },
  {
    icon: 'group',
    badge: false,
    title_row: 'כמות מצביעים'
  }
];

export class coupon {
  id: string;
  couponName: string;
  description: string;
  newPrice: Number;
  profile_Coupon: string;
  couponTypeId: string;
  couponTypeName: string;

  constructor(id: string, 
    couponName: string, 
    description: string, 
    newPrice: Number, 
    profile_Coupon: string, 
    couponTypeId: string, 
    couponTypeName: string) {

    this.id = id;
    this.couponName = couponName;
    this.description = description;
    this.newPrice = newPrice;
    this.profile_Coupon = profile_Coupon;
    this.couponTypeId = couponTypeId;
    this.couponTypeName = couponTypeName;
  }
}

export class branch {
  id: string;
  shopId: string;
  branchName: string;
  shopName: string;
  profile_Branch: string;

  constructor(id: string, shopId: string, branchName: string, shopName: string, profile_Branch: string) {
    this.id = id;
    this.shopId = shopId;
    this.branchName = branchName;
    this.shopName = shopName;
    this.profile_Branch = profile_Branch;
  }
}

export class user {
  id: string;
  firstName: string;
  lastName: string;
  userID: string;
  profile_User: string;

  constructor(id: string, firstName: string, lastName: string, userID: string, profile_User: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userID = userID;
    this.profile_User = profile_User;
  }
}

@Component({
  selector: 'coupons-sale',
  templateUrl: './coupons-sale.component.html',
  styleUrls: ['./coupons-sale.component.scss']
})

export class PageCouponsSaleComponent implements OnInit {
  pageTitle: string = 'ניהול קופונים';
  details = details;

  shops: Shops[] = [];
  
  couponClass: coupon;
  branchClass: branch;
  userClass: user;

  coupons: Coupons[] = [];
  couponOnDetails: Coupons;
  saleCoupon: Coupons;
  currentUser: Users;
  currentShop: Shops = null;
  currentBranch: Branches;

  detailPressed: boolean = false;
  salePressed: boolean = false;
  isShowShop: boolean = false;
  isShowBranch: boolean = false;

  public saleForm: FormGroup;

  // Constractor
  constructor(private fb: FormBuilder,
    private _sharedService: SharedService,
    private _manageshops: ManageShopsService,
    private ShowCouponsService: ManageCouponsService,
    private _managebranches: ManageBranchesService,
    private _manageorders: ManageOrdersService,
    private router: Router) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser);

    if(localStorage.getItem('user') == null || this.currentUser.role !== 'seller'){
      this.router.navigate(['/default-layout/dashboard']);
    } else {
      this.showShopByBranchId(this.currentUser.employerId)
      this.showBranchId(this.currentUser.employerId)
    }
  }

  showShopByBranchId(branchId: string) {
    this._manageshops.getShopByBranchId(branchId).subscribe((shop) => {
      this.currentShop = shop;
      console.log(this.currentShop)
      this.isShowShop = true;
    });
  }

  showBranchId(branchId: string) {
    this._managebranches.getBranchById(branchId).subscribe((branch) => {
      this.currentBranch = branch;
      this.isShowBranch = true;
      this.showCoupons(this.currentBranch.shop.id)
      console.log(this.currentBranch.shop.id)
    });
  }

  showCoupons(shopId: string) {
    this.ShowCouponsService.getCoupons().subscribe((coupons) => {
      this.coupons = coupons.filter(coupon => (coupon.isExists !== false && coupon.shop.id === shopId && !this.checkExpiredateCoupons(new Date(coupon.expireDate))));
      console.log(this.coupons)
    });
  }

  checkExpiredateCoupons(expireDate: Date) {
    const today = new Date(Date.now());
    if (expireDate < today) {
      return true;
    }
    return false;
  }

  OnDetails(stateDetailsPressed: boolean,id: string) {
    if (stateDetailsPressed) {
      this.detailPressed = true;
      this.couponOnDetails = this.coupons.find(coupon => coupon.id === id);
    }
    if (!stateDetailsPressed) {
      this.detailPressed = false;
      this.couponOnDetails = null;
    }
  }

  onSale(stateSalePressed: boolean, id: string) {
    if (stateSalePressed) {
      console.log(id);
      this.salePressed = true;
      this.saleCoupon = this.coupons.find(coupon => coupon.id === id);

      console.log("this.saleCoupon.numOf_rating = " + this.saleCoupon.numOf_rating);

      this.couponClass = new coupon(
        this.saleCoupon.id, 
        this.saleCoupon.couponName, 
        this.saleCoupon.description, 
        this.saleCoupon.newPrice, 
        this.saleCoupon.profile_Coupon,
        this.saleCoupon.couponType.id,
        this.saleCoupon.couponType.couponTypeName);
        
      this.branchClass = new branch(
        this.currentUser.employerId, 
        this.currentBranch.shop.id, 
        this.currentBranch.branchName, 
        this.currentShop.shopName, 
        this.currentBranch.profile_Branch);

      this.userClass = new user(
        this.currentUser.email, 
        this.currentUser.userName.firstName, 
        this.currentUser.userName.lastName, 
        this.currentUser.userID, 
        this.currentUser.profile_User);
        
      this.saleForm = this.fb.group({
        orderNumber: ['The order number is executed automatically on the server', Validators.compose([Validators.required])],
        orderDate: ['Date.now() after sale', Validators.compose([Validators.required])],
        coupon: this.fb.group({ // make a nested group
          id: [this.couponClass.id, Validators.compose([Validators.required])],
          couponName: [this.couponClass.couponName, Validators.compose([Validators.required])],
          description: [this.couponClass.description, Validators.compose([Validators.required])],
          newPrice: [this.couponClass.newPrice, Validators.compose([Validators.required])],
          profile_Coupon: [this.couponClass.profile_Coupon, Validators.compose([Validators.required])],
          couponTypeId: [this.couponClass.couponTypeId, Validators.compose([Validators.required])],
          couponTypeName: [this.couponClass.couponTypeName, Validators.compose([Validators.required])]
        }),
        branch: [this.branchClass, Validators.compose([Validators.required])],
        user: [this.userClass, Validators.compose([Validators.required])],
      });
      console.log(this.saleForm.value);
    }
    if (!stateSalePressed) {
      this.salePressed = false;
      this.saleForm.reset();
    }

  }

  onSaleSubmit() {
    this._manageorders.saleCoupon(this.saleForm.value).subscribe(
      (coupons) => { console.log('Success', coupons); },
      (error) => { console.log('Error', error); },
      () => {
        this.showShopByBranchId(this.currentUser.employerId)
        this.showBranchId(this.currentUser.employerId)
      }
    );
    this.salePressed = false;
    this.saleForm.reset();
  }
}