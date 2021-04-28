import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageBranchesService } from '../../services/manage-branches.service';
import { Branches } from '../../models/branches';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

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

@Component({
  selector: 'page-shops-manage',
  templateUrl: './shops-manage.component.html',
  styleUrls: ['./shops-manage.component.scss']
})

export class PageShopsManageComponent implements OnInit {
  pageTitle: string = 'ניהול חנויות';
  details = details;

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
  constructor(private fb: FormBuilder, private _sharedService: SharedService,
    private ShowBranchesService: ManageBranchesService,) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {

    this.showBranches();

    this.form = this.fb.group({
      shop: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
      city: [null, Validators.compose([Validators.required])],
      address: [null, Validators.compose([Validators.required])],
      phoneNumber: [null, Validators.compose([Validators.required])],
      lat: [null, Validators.compose([Validators.required])],
      long: [null, Validators.compose([Validators.required])],
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
      //this.branchOnDetails = this.branches.find(branch => branch._id != null);
    })
  }

  
  OnDetails(id: string) {
    console.log(id);
    this.detailPressed = true;
    this.branchOnDetails = this.branches.find(branch => branch._id === id);
    console.log(this.branchOnDetails);
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
    
    this.ShowBranchesService.createBranch(this.form.value).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); }
    );
    this.addPressed = false;
    this.form.reset();
  }

  onUpdate(state: boolean, id: string){
    if(state){
      console.log(id);
      this.updatePressed = true;
      this.updateBranch = this.branches.find(branch => branch._id === id);
      this.updateForm = this.fb.group({
        shop: [this.updateBranch.shop, Validators.compose([Validators.required])],
        name: [this.updateBranch.name, Validators.compose([Validators.required])],
        city: [this.updateBranch.city, Validators.compose([Validators.required])],
        address: [this.updateBranch.address, Validators.compose([Validators.required])],
        phoneNumber: [this.updateBranch.phoneNumber, Validators.compose([Validators.required])],
        lat: [this.updateBranch.lat, Validators.compose([Validators.required])],
        long: [this.updateBranch.long, Validators.compose([Validators.required])],
      });
      console.log(this.updateForm.value);
    }
    if(!state){
      this.updatePressed = false;
      this.updateForm.reset();
    }
    
  }

  onUpdateSubmit(){
    this.ShowBranchesService.updateBranch(this.updateForm.value, this.updateBranch._id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); }
    );
    this.updatePressed = false;
    this.updateForm.reset();
  }

  onDelete(state: boolean, id: string){
    
    this.deleteBranch = this.branches.find(branch => branch._id === id);
    if(state){
      this.deletePressed = true;
    }
    if(!state){
      this.deletePressed = false;
    }
  }

  onDeleteSubmit(){
    this.deletePressed = false;
    console.log(this.deleteBranch);
    this.ShowBranchesService.deleteBranch(this.deleteBranch._id).subscribe(
      (branches) => { console.log('Success', branches); },
      (error) => { console.log('Error', error); }
    );
  }
}
