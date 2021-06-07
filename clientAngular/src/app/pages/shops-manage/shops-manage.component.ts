import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageBranchesService } from '../../services/manage-branches.service';
import { ManageShopsService } from '../../services/manage-shops.service';
import { Branches } from '../../models/branches';
import { Shops } from '../../models/shops';
import { Users } from '../../models/users';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

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
  pageTitle: string = 'ניהול סניפים';
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
  canDeleteFlag: boolean = false;

  public form: FormGroup;
  public updateForm: FormGroup;

  currentUser: Users;

  defaultCenter = {lat: 32.176, lon: 34.894};
  defaultUpdateCenter = {lat: 32.176, lon: 34.894};
  initialZoom = 8;

  selectedLat : Number;
  selectedLon : Number;

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
    private ShowBranchesService: ManageBranchesService,
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
      this.showBranches();
    } 
    
    this.form = this.fb.group({
      shop: [null, Validators.compose([Validators.required])],
      branchName: [null, Validators.compose(
        [
          Validators.required,
          Validators.maxLength(32),
          this._uniqueIdValidator.bind(this)
        ])
      ],
      profile_Branch: [null, Validators.compose([])],
      address: this.fb.group({ // make a nested group
        city: [null, Validators.compose([Validators.required, Validators.maxLength(16)])],
        street: [null, Validators.compose([Validators.required, Validators.maxLength(108)])],
        country: [null, Validators.compose([Validators.required, Validators.maxLength(16)])]
      }),
      phoneNumber: [null, Validators.compose([Validators.required, Validators.maxLength(16)])],
      lat: [this.selectedLat, Validators.compose([Validators.required])],
      lon: [this.selectedLon, Validators.compose([Validators.required])],
      isOpen: [true, Validators.compose([])],
      isExists: [true, Validators.compose([Validators.required])],
      lastUpdated: [Date.now(), Validators.compose([])],
      sellers: [[], Validators.compose([])]
    });

  }

  clickedMarker($event){
    this.selectedLat = $event.coords.lat;
    this.selectedLon = $event.coords.lng;
    console.log($event);
  }
  
  private _uniqueIdValidator(control: FormControl) {
    if (this.branches.find(branch => branch.branchName === control.value)) {
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

  showShops() {
    this._manageshops.getAllShops().subscribe((shops) => {
      this.shops = shops.filter(shop => shop.isExists !== false);
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
      this.branches = branches.filter(branch => branch.isExists !== false);
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
    this.form.patchValue({profile_Branch:this.shopProfileUrl});
    this.ShowBranchesService.createBranch(this.form.value).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); },
      () => { this.showBranches(); this.showShops(); }
    );
    this.addPressed = false; // To hide the Add branch Card
    this.AddedPhoto = false;
    this.shopClass = [];
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
      console.log(this.shopUpdateNow);
      console.log(this.updateBranch);

      this.defaultUpdateCenter.lat = Number(this.updateBranch.lat);
      this.defaultUpdateCenter.lon = Number(this.updateBranch.lon);
      this.selectedLat = Number(this.updateBranch.lat);
      this.selectedLon = Number(this.updateBranch.lon);

      this.updateForm = this.fb.group({
        shop: [this.updateBranch.shop, Validators.compose([Validators.required])],
        branchName: [this.updateBranch.branchName, Validators.compose(
          [
            Validators.required,
            Validators.maxLength(32)
          ])
        ],
        profile_Branch: [this.updateBranch.profile_Branch, Validators.compose([Validators.required])],
        address: this.fb.group({ // make a nested group
          city: [this.updateBranch.address.city, Validators.compose([Validators.required, Validators.maxLength(16)])],
          street: [this.updateBranch.address.street, Validators.compose([Validators.required, Validators.maxLength(108)])],
          country: [this.updateBranch.address.country, Validators.compose([Validators.required, Validators.maxLength(16)])]
        }),
        phoneNumber: [this.updateBranch.phoneNumber, Validators.compose([Validators.required, Validators.maxLength(16)])],
        lat: [this.selectedLat, Validators.compose([Validators.required])],
        lon: [this.selectedLon, Validators.compose([Validators.required])],
        isOpen: [this.updateBranch.isOpen, Validators.compose([Validators.required])],
        isExists: [true, Validators.compose([Validators.required])],
        lastUpdated: [this.updateBranch.lastUpdated, Validators.compose([])],
      });
      console.log(this.updateForm.value);
    }
    if (!stateUpdatePressed) {
      this.updatePressed = false;
      this.updateForm.reset();
    }

  }

  onUpdateSubmit() {
    this.updateForm.patchValue({profile_Branch:this.shopProfileUrl});
    this.ShowBranchesService.updateBranch(this.updateForm.value, this.updateBranch.id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); },
      () => {  this.showBranches(); this.showShops(); }
    );
    this.updatePressed = false;
    this.UpdatedPhoto = false;
    this.shopClass = [];
    this.updateForm.reset();
  }

  onDelete(stateDeletePressed: boolean, id: string) {

    if (id !== 'Delete stoped') {
      this.deleteBranch = this.branches.find(branch => branch.id === id);
    }

    if (this.deleteBranch.sellers.length === 0) {
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
    console.log(this.deleteBranch);
    this.ShowBranchesService.lockoutBranch(this.deleteBranch.id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); },
      () => { this.showBranches(); this.showShops(); }
    );
    this.shopClass = [];
  }
          /*
  START
  Upload Profile Picture
  */
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
