import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageCouponTypeService } from '../../services/manage-coupon-type.service';
import { CouponTypes } from '../../models/couponTypes';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-coupon-type-manage',
  templateUrl: './coupon-type-manage.component.html',
  styleUrls: ['./coupon-type-manage.component.scss']
})
export class PageCouponTypeManageComponent implements OnInit {
  pageTitle: string = 'ניהול רשתות חנויות';
  couponTypes_mat_icon = { icon: 'local_activity' };

  couponTypes: CouponTypes[] = [];
  updateCouponType: CouponTypes;
  deleteCouponType: CouponTypes;

  addPressed: boolean = false;
  updatePressed: boolean = false;
  deletePressed: boolean = false;

  public form: FormGroup;
  public updateForm: FormGroup;

  constructor(private fb: FormBuilder,
    private _sharedService: SharedService,
    private _manageCouponTypse: ManageCouponTypeService) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    this.showCouponTypes();

    this.form = this.fb.group({
      couponTypeName: [null, Validators.compose([Validators.required])],
      countOf_Coupons: [0, Validators.compose([Validators.required])],
      lastUpdated: [Date.now(), Validators.compose([Validators.required])]
    });
  }

  showCouponTypes() {
    this._manageCouponTypse.getAllCouponTypes().subscribe((couponTypes) => {
      this.couponTypes = couponTypes;
    });
  }

  onAdd(stateAddPressed: boolean) {
    if (stateAddPressed) { // When press the Add icon ( + ), and open the add branch card
      this.addPressed = true;
    }
    if (!stateAddPressed) { // When press back icon and hide the Add branch Card
      this.addPressed = false;
      this.form.reset();
    }
  }

  onSubmit(value: boolean) {
    console.log(this.form.value);
    this._manageCouponTypse.createCouponType(this.form.value).subscribe(
      (shops) => { console.log('Success', shops); },
      (error) => { console.log('Error', error); }
    );
    this.addPressed = false; // To hide the Add branch Card
    this.form.reset();
  }

  onUpdate(stateUpdatePressed: boolean, id: string) {
    if (stateUpdatePressed) {
      console.log(id);
      this.updatePressed = true; // When press the [Update-עריכה] button, and open the add branch card
      this.updateCouponType = this.couponTypes.find(branch => branch.id === id);
      this.updateForm = this.fb.group({
        couponTypeName: [this.updateCouponType.couponTypeName, Validators.compose([Validators.required])],
        countOf_Coupons: [this.updateCouponType.countOf_Coupons, Validators.compose([])],
        lastUpdated: [this.updateCouponType.lastUpdated, Validators.compose([])]
      });
      console.log(this.updateForm.value);
    }
    if (!stateUpdatePressed) {
      this.updatePressed = false;
      this.updateForm.reset();
    }
  }

  onUpdateSubmit() {
    this._manageCouponTypse.updateCouponType(this.updateForm.value, this.updateCouponType.id).subscribe(
      (shops) => { console.log('Success', shops); },
      (error) => { console.log('Error', error); }
    );
    this.updatePressed = false;
    this.updateForm.reset();
  }

  onDelete(stateDeletePressed: boolean, id: string) {

    this.deleteCouponType = this.couponTypes.find(shop => shop.id === id);
    if (stateDeletePressed) {
      this.deletePressed = true;
    }
    if (!stateDeletePressed) {
      this.deletePressed = false;
    }
  }

  onDeleteSubmit() {
    this.deletePressed = false;
    console.log(this.deleteCouponType);
    this._manageCouponTypse.deleteCouponType(this.deleteCouponType.id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); }
    );
  }

}
