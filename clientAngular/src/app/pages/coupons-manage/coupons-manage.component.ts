import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageCouponsService } from '../../services/manage-coupons.service';
import { Coupons } from '../../models/coupons';
import { Users } from '../../models/users';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CalendarTodayDirective } from 'angular-calendar/modules/common/calendar-today.directive';
import { ManageShopsService } from 'src/app/services/manage-shops.service';
import { Shops } from 'src/app/models/shops';
import { CouponTypes } from 'src/app/models/couponTypes';
import { ManageCouponTypesService } from 'src/app/services/manage-couponTypes.service';

const details: any[] = [
  {
    icon: 'image',
    badge: false,
  },
  {
    icon: 'code',
    badge: false,
  },
  {
    icon: 'sell',
    badge: false,
  },
  {
    icon: 'description',
    badge: false,
  },
  {
    icon: 'money_off',
    badge: false,
  },
  {
    icon: 'attach_money',
    badge: false,
  },
  {
    icon: 'date_range',
    badge: false,
  }
];

export class shop {
  id: string;
  shopName: string;
  profile_Shop: string;

  constructor(id: string, shopName: string, profile_Shop: string) {
    this.id = id;
    this.shopName = shopName;
    this.profile_Shop = profile_Shop;
  }
}

export class couponType {
  id: string;
  couponTypeName: string;

  constructor(id: string, couponTypeName: string) {
    this.id = id;
    this.couponTypeName = couponTypeName;
  }
}

@Component({
  selector: 'page-coupons-manage',
  templateUrl: './coupons-manage.component.html',
  styleUrls: ['./coupons-manage.component.scss']
})

export class PageCouponsManageComponent implements OnInit {
  pageTitle: string = 'ניהול קופונים';
  details = details;

  couponTypes: CouponTypes[] = [];
  couponTypeClass: couponType[] = [];
  shops: Shops[] = [];
  shopClass: shop[] = [];
  coupons: Coupons[] = [];
  createCoupon: Coupons[] = [];
  couponOnDetails: Coupons;
  updateCoupon: Coupons;
  deleteCoupon: Coupons;
  currentUser: Users;

  addPressed: boolean = false;
  detailPressed: boolean = false;
  updatePressed: boolean = false;
  deletePressed: boolean = false;
  canDeleteFlag: boolean = false;

  public form: FormGroup;
  public updateForm: FormGroup;

  // Constractor
  constructor(private fb: FormBuilder,
    private _sharedService: SharedService,
    private _manageshops: ManageShopsService,
    private _managecouponTypes: ManageCouponTypesService,
    private ShowCouponsService: ManageCouponsService,) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)

    this.showCoupons(this.currentUser.employerId);
    this.showShops(this.currentUser.employerId);
    this.showCouponTypes();

    this.form = this.fb.group({
      couponId: [null, Validators.compose(
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern("^[0-9]*$"),
          this._uniqueIdValidator.bind(this)
        ])
      ],
      couponName: [null, Validators.compose([Validators.required, Validators.maxLength(16)])],
      description: [null, Validators.compose([Validators.required, Validators.maxLength(140)])],
      expireDate: [null, Validators.compose([Validators.required])],
      newPrice: [null, Validators.compose([Validators.required])],
      oldPrice: [null, Validators.compose([Validators.required])],
      ratingAvg: [0, Validators.compose([Validators.required])],
      numOf_rating: [0, Validators.compose([Validators.required])],
      isExists: [true, Validators.compose([Validators.required])],
      lastUpdated: [Date.now(), Validators.compose([])],
      Shop: [null, Validators.compose([Validators.required])],
      profile_Coupon: [null, Validators.compose([Validators.required])],
      couponType: [null, Validators.compose([Validators.required])],

    });
  }

  private _uniqueIdValidator(control: FormControl) {
    if (this.coupons.find(coupon => coupon.id === control.value)) {
      console.log("duplicate: true")
      return { duplicate: true };
    } else {
      console.log("is unique branchName")
      return null;
    }
  }

  handleSelect(shop: any) { // This function is not used
    // Here is the actual selected object
    console.log(shop.value);
  }

  handleSelect2(couponType: any) { // This function is not used
    // Here is the actual selected object
    console.log(couponType.value);
  }

  showCouponTypes() {
    this._managecouponTypes.getAllCouponTypes().subscribe((couponTypes) => {
      this.couponTypes = couponTypes.filter(couponType => couponType.isExists !== false);
      this.couponTypes.forEach(couponTypeObj => {
        this.couponTypeClass.push(new couponType(couponTypeObj.id, couponTypeObj.couponTypeName))
      });
    });
  }

  showShops(shopId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this._manageshops.getAllShops().subscribe((shops) => {
          this.shops = shops.filter(shop => shop.isExists !== false && shop.id === shopId);
          this.shops.forEach(shopObj => {
            this.shopClass.push(new shop(shopObj.id, shopObj.shopName, shopObj.profile_Shop))
          });
        });
        break;
      default: // role --> 'admin'
        this._manageshops.getAllShops().subscribe((shops) => {
          this.shops = shops.filter(shop => shop.isExists !== false);
          this.shops.forEach(shopObj => {
            this.shopClass.push(new shop(shopObj.id, shopObj.shopName, shopObj.profile_Shop))
          });
        });
        break;
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
        this.ShowCouponsService.getCoupons().subscribe((coupons) => {
          this.coupons = coupons.filter(coupon => (coupon.isExists !== false));
          console.log(this.coupons)
        });
        break;
    }
  }

  OnDetails(id: string) {
    this.detailPressed = true;
    this.couponOnDetails = this.coupons.find(coupon => coupon.id === id);
  }

  onAdd(stateAddPressed: boolean) {
    if (stateAddPressed) {
      this.addPressed = true;
    }
    if (!stateAddPressed) {
      this.addPressed = false;
      this.form.reset();
    }
  }

  onSubmit(value: boolean) {
    this.ShowCouponsService.createCoupon(this.form.value).subscribe(
      (coupons) => { console.log('Success', coupons); },
      (error) => { console.log('Error', error); },
      () => {
        this.showCoupons(this.currentUser.employerId);
        this.showShops(this.currentUser.employerId);
        this.showCouponTypes();
      }
    );
    this.addPressed = false;
    this.form.reset();
  }

  onUpdate(stateUpdatePressed: boolean, id: string) {
    if (stateUpdatePressed) {
      console.log(id);
      this.updatePressed = true;
      this.updateCoupon = this.coupons.find(coupon => coupon.id === id);

      console.log("this.updateCoupon.numOf_rating = " + this.updateCoupon.numOf_rating)

      this.updateForm = this.fb.group({
        couponId: [this.updateCoupon.id, Validators.compose(
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
            //this._uniqueIdValidator.bind(this)
          ])
        ],
        couponName: [this.updateCoupon.couponName, Validators.compose([Validators.required, Validators.maxLength(16)])],
        description: [this.updateCoupon.description, Validators.compose([Validators.required, Validators.maxLength(140)])],
        published: [this.updateCoupon.published, Validators.compose([Validators.required])],
        expireDate: [this.updateCoupon.expireDate, Validators.compose([Validators.required])],
        newPrice: [this.updateCoupon.newPrice, Validators.compose([Validators.required])],
        oldPrice: [this.updateCoupon.oldPrice, Validators.compose([Validators.required])],
        ratingAvg: [this.updateCoupon.ratingAvg, Validators.compose([])],
        numOf_rating: [this.updateCoupon.numOf_rating, Validators.compose([])],
        isExists: [true, Validators.compose([Validators.required])],
        lastUpdated: [this.updateCoupon.lastUpdated, Validators.compose([])],
        Shop: [this.updateCoupon.shop, Validators.compose([])],
        profile_Coupon: [this.updateCoupon.profile_Coupon, Validators.compose([Validators.required])],
        couponType: [this.updateCoupon.couponType, Validators.compose([])],

      });
      console.log(this.updateForm.value);
    }
    if (!stateUpdatePressed) {
      this.updatePressed = false;
      this.updateForm.reset();
    }

  }

  onUpdateSubmit() {
    this.ShowCouponsService.updateCoupon(this.updateForm.value, this.updateCoupon.id).subscribe(
      (coupons) => { console.log('Success', coupons); },
      (error) => { console.log('Error', error); },
      () => {
        this.showCoupons(this.currentUser.employerId);
        this.showShops(this.currentUser.employerId);
        this.showCouponTypes();
      }
    );
    this.updatePressed = false;
    this.updateForm.reset();
  }

  onDelete(stateDeletePressed: boolean, id: string) {

    if (id !== 'Delete stoped') {
      this.deleteCoupon = this.coupons.find(coupon => coupon.id === id);
    }
    const today = new Date(Date.now());
    const expireDate = new Date(this.deleteCoupon.expireDate);
    if (expireDate < today) {
      this.canDeleteFlag = true;
    }

    if (stateDeletePressed) {
      this.deletePressed = true;
    }
    if (!stateDeletePressed) {
      this.deletePressed = false;
      this.canDeleteFlag = false;
    }
  }

  onDeleteSubmit() {
    this.deletePressed = false;
    this.canDeleteFlag = false;
    console.log(this.deleteCoupon);
    console.log(this.deleteCoupon.id);
    console.log(this.deleteCoupon.couponId);
    this.ShowCouponsService.lockoutCoupon(this.deleteCoupon.id).subscribe(
      (coupons) => { console.log('Success', coupons); },
      (error) => { console.log('Error', error); },
      () => {
        this.showCoupons(this.currentUser.employerId);
        this.showShops(this.currentUser.employerId);
        this.showCouponTypes();
      }
    );
  }
}
