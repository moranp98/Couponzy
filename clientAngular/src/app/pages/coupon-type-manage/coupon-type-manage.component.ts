import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageCouponTypeService } from '../../services/manage-coupon-type.service';
import { CouponTypes } from '../../models/couponTypes';
import { Users } from '../../models/users';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';

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
  canDeleteFlag: boolean = false;

  public form: FormGroup;
  public updateForm: FormGroup;

  currentUser: Users;

  constructor(private fb: FormBuilder,
    private _sharedService: SharedService,
    private _manageCouponTypse: ManageCouponTypeService,
    private router: Router) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)

    if(localStorage.getItem('user') == null || this.currentUser.role === 'seller'){
      this.router.navigate(['/roadstart-layout/sign-in-social']);
    }

    this.showCouponTypes();

    this.form = this.fb.group({
      couponTypeName: [null, Validators.compose(
        [
          Validators.required,
          Validators.maxLength(16),
          this._uniqueIdValidator.bind(this)
        ])
      ],
      countOf_Coupons: [0, Validators.compose([Validators.required])],
      isExists: [true, Validators.compose([Validators.required])],
      lastUpdated: [Date.now(), Validators.compose([Validators.required])]
    });
  }

  private _uniqueIdValidator(control: FormControl) {
    console.log(this.couponTypes.find(couponType => couponType.couponTypeName === control.value))
    if (this.couponTypes.find(couponType => couponType.couponTypeName === control.value)) {
      console.log("duplicate: true")
      return { duplicate: true };
    } else {
      console.log("is unique couponTypeName")
      return null;
    }
  }


  showCouponTypes() {
    this._manageCouponTypse.getAllCouponTypes().subscribe((couponTypes) => {
      this.couponTypes = couponTypes.filter(couponType => couponType.isExists !== false);
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
      (error) => { console.log('Error', error); },
      () => { this.showCouponTypes() }
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
        couponTypeName: [this.updateCouponType.couponTypeName, Validators.compose(
          [
            Validators.required,
            Validators.maxLength(16),
            this._uniqueIdValidator.bind(this)
          ])
        ],
        countOf_Coupons: [this.updateCouponType.countOf_Coupons, Validators.compose([])],
        isExists: [true, Validators.compose([Validators.required])],
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
      (error) => { console.log('Error', error); },
      () => { this.showCouponTypes() }
    );
    this.updatePressed = false;
    this.updateForm.reset();
  }

  onDelete(stateDeletePressed: boolean, id: string) {

    if (id !== 'Delete stoped') {
      this.deleteCouponType = this.couponTypes.find(couponType => couponType.id === id);
    }

    if (this.deleteCouponType.countOf_Coupons === 0) {
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
    console.log(this.deleteCouponType);
    this._manageCouponTypse.lockoutCouponType(this.deleteCouponType.id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); },
      () => { this.showCouponTypes() }
    );
  }

}
