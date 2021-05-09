import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageBranchesService } from '../../services/manage-branches.service';
import { ManageShopsService } from '../../services/manage-shops.service';
import { Branches } from '../../models/branches';
import { Shops } from '../../models/shops';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';

const details: any[] = [
  {
    icon: 'image',
    badge: false,
  },
  {
    icon: 'store',
    badge: false,
  },
  {
    icon: 'home',
    badge: false,
  },
  {
    icon: 'place',
    badge: false,
  },
  {
    icon: 'local_phone',
    badge: 8,
  },
  {
    icon: 'lock_open',
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

@Component({
  selector: 'page-shops-manage',
  templateUrl: './shops-manage.component.html',
  styleUrls: ['./shops-manage.component.scss']
})

export class PageShopsManageComponent implements OnInit {
  pageTitle: string = 'ניהול חנויות';
  details = details;

  shops: Shops[] = [];
  shopClass: shop[] = [];
  shopUpdateNow: shop;
  branches: Branches[] = [];
  createBranch: Branches[] = [];
  branchOnDetails: Branches;
  updateBranch: Branches;
  deleteBranch: Branches;

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
    private ShowBranchesService: ManageBranchesService,
    private router: Router) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/roadstart-layout/sign-in-social']);
      }
    this.showShops();
    this.showBranches();

    this.form = this.fb.group({
      shop: [null, Validators.compose([Validators.required])],
      branchName: [null, Validators.compose([Validators.required])],
      profile_Branch: [null, Validators.compose([Validators.required])],
      address: this.fb.group({ // make a nested group
        city: [null, Validators.compose([Validators.required])],
        street: [null, Validators.compose([Validators.required])],
        country: [null, Validators.compose([Validators.required])]
      }),
      phoneNumber: [null, Validators.compose([Validators.required])],
      lat: [null, Validators.compose([Validators.required])],
      long: [null, Validators.compose([Validators.required])],
      isOpen: [true, Validators.compose([])],
      lastUpdated: [Date.now, Validators.compose([])],
      sellers: [[], Validators.compose([])]
    });
  }

  handleSelect(shop: any) { // This function is not used
    // Here is the actual selected object
    console.log(shop.value);
  }

  showShops() {
    this._manageshops.getAllShops().subscribe((shops) => {
      this.shops = shops;
      this.shops.forEach(shopObj => {
        this.shopClass.push(new shop(shopObj.id, shopObj.shopName, shopObj.profile_Shop))
      });
    });
  }

  showBranches() {
    this.ShowBranchesService.getBranches().subscribe((branches) => {
      branches.forEach(branch => {
        if (branch.isOpen)
          branch.stateOpen = "פתוח";
        else
          branch.stateOpen = "סגור";
      });
      this.branches = branches;
      console.log(this.branches);
    })
  }


  OnDetails(id: string) {
    this.detailPressed = true;
    this.branchOnDetails = this.branches.find(branch => branch.id === id);
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
    this.ShowBranchesService.createBranch(this.form.value).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); },
      () => { this.showBranches() }
    );
    this.addPressed = false; // To hide the Add branch Card
    this.form.reset();
  }

  onUpdate(stateUpdatePressed: boolean, id: string) {
    if (stateUpdatePressed) {
      console.log(id);
      this.updatePressed = true; // When press the [Update-עריכה] button, and open the add branch card
      this.updateBranch = this.branches.find(branch => branch.id === id);
      this.shopUpdateNow = new shop(
        this.updateBranch.shop.id,
        this.updateBranch.shop.shopName,
        this.updateBranch.shop.profile_Shop
      );
      console.log(this.updateBranch);
      this.updateForm = this.fb.group({
        shop: [this.updateBranch.shop, Validators.compose([Validators.required])],
        branchName: [this.updateBranch.branchName, Validators.compose([Validators.required])],
        profile_Branch: [this.updateBranch.profile_Branch, Validators.compose([Validators.required])],
        address: this.fb.group({ // make a nested group
          city: [this.updateBranch.address.city, Validators.compose([Validators.required])],
          street: [this.updateBranch.address.street, Validators.compose([Validators.required])],
          country: [this.updateBranch.address.country, Validators.compose([Validators.required])]
        }),
        phoneNumber: [this.updateBranch.phoneNumber, Validators.compose([Validators.required])],
        lat: [this.updateBranch.lat, Validators.compose([Validators.required])],
        long: [this.updateBranch.long, Validators.compose([Validators.required])],
      });
      console.log(this.updateForm.value);
    }
    if (!stateUpdatePressed) {
      this.updatePressed = false;
      this.updateForm.reset();
    }

  }

  onUpdateSubmit() {
    this.ShowBranchesService.updateBranch(this.updateForm.value, this.updateBranch.id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); },
      () => { this.showBranches() }
    );
    this.updatePressed = false;
    this.updateForm.reset();
  }

  onDelete(stateDeletePressed: boolean, id: string) {

    this.deleteBranch = this.branches.find(branch => branch.id === id);
    if (stateDeletePressed) {
      this.deletePressed = true;
    }
    if (!stateDeletePressed) {
      this.deletePressed = false;
    }
  }

  onDeleteSubmit() {
    this.deletePressed = false;
    console.log(this.deleteBranch);
    this.ShowBranchesService.deleteBranch(this.deleteBranch.id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); },
      () => { this.showBranches() }
    );
  }
}
