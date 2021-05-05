import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageCouponsService } from '../../services/manage-coupons.service';
import { Coupons } from '../../models/coupons';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CalendarTodayDirective } from 'angular-calendar/modules/common/calendar-today.directive';

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

@Component({
  selector: 'page-coupons-manage',
  templateUrl: './coupons-manage.component.html',
  styleUrls: ['./coupons-manage.component.scss']
})

export class PageCouponsManageComponent implements OnInit {
  pageTitle: string = 'ניהול קופונים';
  details = details;

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
  constructor(private fb: FormBuilder, private _sharedService: SharedService,
    private ShowCouponsService: ManageCouponsService,) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {

    this.showCoupons();

    this.form = this.fb.group({
      couponName: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
      expireDate: [null, Validators.compose([Validators.required])],
      newPrice: [null, Validators.compose([Validators.required])],
      oldPrice: [null, Validators.compose([Validators.required])],
      ratingAvg: [null, Validators.compose([Validators.required])],
      numof_Rating: [null, Validators.compose([Validators.required])],

    });
  }

  showCoupons() {
    this.ShowCouponsService.getCoupons().subscribe((coupons) => {
      this.coupons = coupons;
      //this.branchOnDetails = this.branches.find(branch => branch._id != null);
    })
  }

  
  OnDetails(id: string) {
    console.log(id);
    this.detailPressed = true;
    this.couponOnDetails = this.coupons.find(coupon => coupon.id === id);
    console.log(this.couponOnDetails);
  }

  onAdd(state: boolean) {
    if(state){
      this.addPressed = true;
    }
    if(!state){
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

  onUpdate(state: boolean, id: string){
    if(state){
      console.log(id);
      this.updatePressed = true;
      this.updateCoupon = this.coupons.find(coupon => coupon.id === id);
      this.updateForm = this.fb.group({
        couponName: [this.updateCoupon.couponName, Validators.compose([Validators.required])],
        description: [this.updateCoupon.description, Validators.compose([Validators.required])],
        expireDate: [this.updateCoupon.expireDate, Validators.compose([Validators.required])],
        newPrice: [this.updateCoupon.newPrice, Validators.compose([Validators.required])],
        oldPrice: [this.updateCoupon.oldPrice, Validators.compose([Validators.required])],
        ratingAvg: [this.updateCoupon.ratingAvg, Validators.compose([Validators.required])],
      });
      console.log(this.updateForm.value);
    }
    if(!state){
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

  onDelete(state: boolean, id: string){
    
    this.deleteCoupon = this.coupons.find(coupon => coupon.id === id);
    if(state){
      this.deletePressed = true;
    }
    if(!state){
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
