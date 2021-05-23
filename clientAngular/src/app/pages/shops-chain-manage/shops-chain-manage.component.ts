import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageShopsService } from '../../services/manage-shops.service';
import { Shops } from '../../models/shops';
import { Users } from '../../models/users';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Router } from '@angular/router';
import { AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

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
  canDeleteFlag: boolean = false;

  addPressed: boolean = false;
  updatePressed: boolean = false;
  deletePressed: boolean = false;

  
  public form: FormGroup;
  public updateForm: FormGroup;

  currentUser: Users;
     /*
  START
  Upload Profile Picture
  */
  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  i:number = 0;
  filename : string;
  datefile : any;
  isEdit : boolean = false;
  downloadURL : string ;
  shopProfileUrl : string;
  AddedPhoto :boolean = false;
  UpdatedPhoto : boolean = false;
  AddedTitle :boolean = false;
  isAddPhoto : boolean = false;
/*
  END
  Upload Profile Picture
  */

  // Constractor
  constructor(private fb: FormBuilder,
    private _sharedService: SharedService,
    private _manageshops: ManageShopsService,
    private router: Router) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)

    if(localStorage.getItem('user') == null || this.currentUser.role === 'seller'){
      this.router.navigate(['/roadstart-layout/sign-in-social']);
    } else {
      this.showShops();
    }

    this.form = this.fb.group({
      shopName: [null, Validators.compose(
        [
          Validators.required,
          Validators.maxLength(16),
          this._uniqueIdValidator.bind(this)
        ])
      ],
      profile_Shop: [null, Validators.compose([Validators.required])],
      isExists: [true, Validators.compose([Validators.required])],
      lastUpdated: [Date.now(), Validators.compose([Validators.required])],
      branches: [[], Validators.compose([])],
      coupons: [[], Validators.compose([])],
      shopManagers: [[], Validators.compose([])]
    });
  }

  private _uniqueIdValidator(control: FormControl) {
    if (this.shops.find(shop => shop.shopName === control.value)) {
      console.log("duplicate: true")
      return { duplicate: true };
    } else {
      console.log("is unique shopName")
      return null;
    }
  }

  showShops() {
    this._manageshops.getAllShops().subscribe((shops) => {
      this.shops = shops.filter(shop => shop.isExists !== false);
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
    console.log("this before form : "+this.form.value);
    this.form.patchValue({profile_Shop:this.shopProfileUrl});
    console.log("this after form : "+this.form.value);
    this._manageshops.createShop(this.form.value).subscribe(
      (shops) => { console.log('Success', shops); },
      (error) => { console.log('Error', error); },
      () => { this.showShops() }
    );
    this.addPressed = false; // To hide the Add branch Card
    this.AddedPhoto = false;
    this.form.reset();
  }

  onUpdate(stateUpdatePressed: boolean, id: string) {
    if (stateUpdatePressed) {
      console.log(id);
      this.updatePressed = true; // When press the [Update-עריכה] button, and open the add branch card
      this.updateShop = this.shops.find(branch => branch.id === id);
      console.log("from onUpdate url : " + this.shopProfileUrl)
      this.updateForm = this.fb.group({
        shopName: [this.updateShop.shopName, Validators.compose(
          [
            Validators.required,
            Validators.maxLength(16),
            this._uniqueIdValidator.bind(this)
          ])
        ],
        profile_Shop: [this.shopProfileUrl, Validators.compose([Validators.required])],
        isExists: [true, Validators.compose([Validators.required])],
        lastUpdated: [this.updateShop.lastUpdated, Validators.compose([])],
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
    this.updateForm.patchValue({profile_Shop:this.shopProfileUrl});
    this._manageshops.updateShop(this.updateForm.value, this.updateShop.id).subscribe(
      (shops) => { console.log('Success', shops); },
      (error) => { console.log('Error', error); },
      () => { this.showShops() }
    );
    this.updatePressed = false;
    this.UpdatedPhoto = false;
    this.updateForm.reset();
  }

  async onPhotoSubmit(){
    console.log("dOWNLOAD LINK: "+ localStorage.getItem('downloadURL'))
    this.downloadURL = await localStorage.getItem('downloadURL')
    if(this.downloadURL!=null){
    this.AddedPhoto=true;
    this.UpdatedPhoto = true;
    this.shopProfileUrl = this.downloadURL;
    console.log(this.shopProfileUrl)
    this.isAddPhoto=false;
    localStorage.removeItem('downloadURL');

    }
  }
  onDelete(stateDeletePressed: boolean, id: string) {

    if (id !== 'Delete stoped') {
      this.deleteShop = this.shops.find(shop => shop.id === id);
    }

    if (this.deleteShop.branches.length === 0 &&
      this.deleteShop.coupons.length === 0 &&
      this.deleteShop.shopManagers.length === 0) {
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
    console.log(this.deleteShop);
    this._manageshops.lockoutShop(this.deleteShop.id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); },
      () => { this.showShops() }
    );
  }
       /*
  START
  Upload Profile Picture
  */
  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    console.log("Started on Drop")
      this.files.push(files.item(0));
      this.filename=files.item(0).name
      this.datefile=Date.now;
      //this.startUpload();
  }

  
/*
  END
  Upload Profile Picture
  */
}
