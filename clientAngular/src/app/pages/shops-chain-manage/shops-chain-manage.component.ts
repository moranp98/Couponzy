import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageShopsService } from '../../services/manage-shops.service';
import { Shops } from '../../models/shops';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-shops-chain-manage',
  templateUrl: './shops-chain-manage.component.html',
  styleUrls: ['./shops-chain-manage.component.scss']
})
export class PageShopsChainManageComponent implements OnInit {
  pageTitle: string = 'ניהול רשתות חנויות';
  branches_mat_icon = { icon: 'store' };
  coupons_mat_icon = { icon: 'attach_money' };
  sellers_mat_icon = { icon: 'account_box' }

  shops: Shops[] = [];
  updateShop: Shops;
  deleteShop: Shops;

  addPressed: boolean = false;
  updatePressed: boolean = false;
  deletePressed: boolean = false;

  public form: FormGroup;
  public updateForm: FormGroup;

  // Constractor
  constructor(private fb: FormBuilder,
    private _sharedService: SharedService,
    private _manageshops: ManageShopsService) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    this.showShops();

    this.form = this.fb.group({
      shopName: [null, Validators.compose([Validators.required])],
      profile_Shop: [null, Validators.compose([Validators.required])],
      branches: [[], Validators.compose([])],
      coupons: [[], Validators.compose([])],
      shopManagers: [[], Validators.compose([])]
    });
  }

  showShops() {
    this._manageshops.getAllShops().subscribe((shops) => {
      this.shops = shops;
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
    this._manageshops.createShop(this.form.value).subscribe(
      (shops) => { console.log('Success', shops); },
      (error) => { console.log('Error', error); },
      () => { this.showShops() }
    );
    this.addPressed = false; // To hide the Add branch Card
    this.form.reset();
  }

  onUpdate(stateUpdatePressed: boolean, id: string) {
    if (stateUpdatePressed) {
      console.log(id);
      this.updatePressed = true; // When press the [Update-עריכה] button, and open the add branch card
      this.updateShop = this.shops.find(branch => branch.id === id);
      this.updateForm = this.fb.group({
        shopName: [this.updateShop.shopName, Validators.compose([Validators.required])],
        profile_Shop: [this.updateShop.profile_Shop, Validators.compose([Validators.required])],
        branches: [this.updateShop.branches, Validators.compose([])],
        coupons: [this.updateShop.coupons, Validators.compose([])],
        shopManagers: [this.updateShop.shopManagers, Validators.compose([])]
      });
      console.log(this.updateForm.value);
    }
    if (!stateUpdatePressed) {
      this.updatePressed = false;
      this.updateForm.reset();
    }
  }

  onUpdateSubmit() {
    this._manageshops.updateShop(this.updateForm.value, this.updateShop.id).subscribe(
      (shops) => { console.log('Success', shops); },
      (error) => { console.log('Error', error); },
      () => { this.showShops() }
    );
    this.updatePressed = false;
    this.updateForm.reset();
  }

  onDelete(stateDeletePressed: boolean, id: string) {

    this.deleteShop = this.shops.find(shop => shop.id === id);
    if (stateDeletePressed) {
      this.deletePressed = true;
    }
    if (!stateDeletePressed) {
      this.deletePressed = false;
    }
  }

  onDeleteSubmit() {
    this.deletePressed = false;
    console.log(this.deleteShop);
    this._manageshops.deleteShop(this.deleteShop.id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); },
      () => { this.showShops() }
    );
  }
}
