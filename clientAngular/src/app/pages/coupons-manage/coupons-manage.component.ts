import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageCouponsService } from '../../services/manage-coupons.service';
import { Coupons } from '../../models/coupons';

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

  addPressed: boolean = false;
  detailPressed: boolean = false;
  updatePressed: boolean = false;
  deletePressed: boolean = false;

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

    this.showCoupons();
    this.showShops();
    this.showCouponTypes();

    this.form = this.fb.group({
      couponId: [null, Validators.compose([Validators.required])],
      couponName: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
      expireDate: [null, Validators.compose([Validators.required])],
      newPrice: [null, Validators.compose([Validators.required])],
      oldPrice: [null, Validators.compose([Validators.required])],
      ratingAvg: [null, Validators.compose([])],
      numOf_rating: [null, Validators.compose([])],
      Shop: [null, Validators.compose([Validators.required])],
      profile_Coupon: [null, Validators.compose([Validators.required])],
      couponType: [null, Validators.compose([Validators.required])],

    });
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
      this.couponTypes = couponTypes;
    this.couponTypes.forEach(couponTypeObj => {
      this.couponTypeClass.push(new couponType(couponTypeObj.id, couponTypeObj.couponTypeName))
    });
  });
  }

  showShops() {
    this._manageshops.getAllShops().subscribe((shops) => {
      this.shops = shops;
    this.shops.forEach(shopObj => {
      this.shopClass.push(new shop(shopObj.id, shopObj.shopName, shopObj.profile_Shop))
    });
  });
  }

  showCoupons() {
    this.ShowCouponsService.getCoupons().subscribe((coupons) => {
      this.coupons = coupons;
    })
  }

  OnDetails(id: string) {
    console.log(id);
    this.detailPressed = true;
    this.couponOnDetails = this.coupons.find(coupon => coupon.id === id);
    console.log(this.couponOnDetails);
  }

  onAdd(stateAddPressed: boolean) {
    if(stateAddPressed){
      this.addPressed = true;
    }
    if(!stateAddPressed){
      this.addPressed = false;
      this.form.reset();
    }
  }

  onSubmit(value: boolean) {
    this.ShowCouponsService.createCoupon(this.form.value).subscribe(
      (coupons) => { console.log('Success', coupons); },
      (error) => { console.log('Error', error); }
    );
    this.addPressed = false;
    this.form.reset();
  }

  onUpdate(stateUpdatePressed: boolean, id: string){
    if(stateUpdatePressed){
      console.log(id);
      this.updatePressed = true;
      this.updateCoupon = this.coupons.find(coupon => coupon.id === id);
      this.updateForm = this.fb.group({
        couponId: [this.updateCoupon.id, Validators.compose([Validators.required])],
        couponName: [this.updateCoupon.couponName, Validators.compose([Validators.required])],
        description: [this.updateCoupon.description, Validators.compose([Validators.required])],
        expireDate: [this.updateCoupon.expireDate, Validators.compose([Validators.required])],
        newPrice: [this.updateCoupon.newPrice, Validators.compose([Validators.required])],
        oldPrice: [this.updateCoupon.oldPrice, Validators.compose([Validators.required])],
        ratingAvg: [this.updateCoupon.ratingAvg, Validators.compose([])],
        numOf_rating: [this.updateCoupon.numOf_rating, Validators.compose([])],
        Shop: [this.updateCoupon.shop, Validators.compose([])],
        profile_Coupon: [this.updateCoupon.profile_Coupon, Validators.compose([Validators.required])],
        couponType: [this.updateCoupon.couponType, Validators.compose([])],
  
      });
      console.log(this.updateForm.value);
    }
    if(!stateUpdatePressed){
      this.updatePressed = false;
      this.updateForm.reset();
    }
    
  }

  onUpdateSubmit(){
    this.ShowCouponsService.updateCoupon(this.updateForm.value, this.updateCoupon.id).subscribe(
      (coupons) => { console.log('Success', coupons); },
      (error) => { console.log('Error', error); }
    );
    this.updatePressed = false;
    this.updateForm.reset();
  }

  onDelete(stateDeletePressed: boolean, id: string){
    
    this.deleteCoupon = this.coupons.find(coupon => coupon.id === id);
    if(stateDeletePressed){
      this.deletePressed = true;
    }
    if(!stateDeletePressed){
      this.deletePressed = false;
    }
  }

  onDeleteSubmit(){
    this.deletePressed = false;
    console.log(this.deleteCoupon);
    this.ShowCouponsService.deleteCoupon(this.deleteCoupon.id).subscribe(
      (coupons) => { console.log('Success', coupons); },
      (error) => { console.log('Error', error); }
    );
  }
}
