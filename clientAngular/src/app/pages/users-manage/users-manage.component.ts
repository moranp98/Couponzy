import { Component, OnInit } from '@angular/core';
import { Shops } from 'src/app/models/shops';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from '../../layouts/shared.service';
import { ManageBranchesService } from 'src/app/services/manage-branches.service'
import { ManageShopsService } from 'src/app/services/manage-shops.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Branches } from 'src/app/models/branches';

interface Pos {
  value: number;
  viewValue: string;
  role: string;
}

@Component({
  selector: 'page-users-manage',
  templateUrl: './users-manage.component.html',
  styleUrls: ['./users-manage.component.scss']
})



export class PageUsersManageComponent implements OnInit {
  pageTitle: string = 'ניהול משתמשים';

  users: Users[] = [];
  shops: Shops[] = [];
  branches: Branches[] = [];
  currentShop: Shops;
  currentBranch: Branches;
  updatePressed: boolean = false;
  showUsers: boolean = true;
  updateUser: Users;
  employedState: string;
  roledState: string;
  currentUser: Users;

  public updateForm: FormGroup;
  // Constractor
  constructor(private _sharedService: SharedService,
    private userServices: UserService,
    private shopsServices: ManageShopsService,
    private router: Router,
    private fb: FormBuilder,
    private branchServices: ManageBranchesService) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)
    if (localStorage.getItem('user') == null || this.currentUser.role !== 'admin') {
      this.router.navigate(['/roadstart-layout/sign-in-social']);
    }
    else {
      this.load();
    }
  }

  posi: Pos[] = [
    { value: 0, viewValue: "מנהל", role: 'admin' },
    { value: 1, viewValue: "מוכר", role: 'seller' },
    { value: 2, viewValue: "מנהל חנות", role: 'shopManager' },
    { value: 3, viewValue: "לקוח", role: 'customer' }
  ];

  load() {
    this.getUsers();
    this.getShops();
    this.getBranches();
  }

  getUsers() {
    this.userServices.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  getShops() {
    this.shopsServices.getAllShops().subscribe((shops) => {
      this.shops = shops.filter(shop => shop.isExists !== false);
    });
  }

  getBranches() {
    this.branchServices.getBranches().subscribe((branches) => {
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

  checkP(user: Users) {
    if (user.role == "admin")
      return "מנהל"
    else if (user.role == "seller")
      return "מוכר"
    else if (user.role == "shopManager")
      return "מנהל חנות"
    return "לקוח"
  }

  checkShop(user: Users) {
    switch (user.role) {
      case "shopManager":
        this.currentShop = this.shops.find(shop => { return shop.id === user.employerId });
        return this.currentShop == null ? "---" : this.currentShop.shopName;
      case "seller":
        this.currentBranch = this.branches.find(branch => { return branch.id === user.employerId });
        return this.currentBranch == null ? "---" : this.currentBranch.branchName;
      default:
        return "-";
    }
  }

  onToggle(email, status) {
    console.log(email + ": " + status.toString())

    this.updateForm = this.fb.group({
      active: [status, Validators.compose([Validators.required])],
    });

    this.userServices.updateUser(email, this.updateForm.value).subscribe(
      (user) => { console.log('Success updated status', user); },
      (error) => { console.log('Error', error); },
      (async () => { await delay(1000); await this.getUsers() })
    );
    function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }
  }

  onUpdate(email: string, state: boolean,) {
    console.log("Entered onUpdate")
    if (state) {
      console.log(email);
      this.updatePressed = true;
      this.showUsers = false;
      this.updateUser = this.users.find(user => user.email === email);
      console.log(this.updateUser.employerId);
      this.employedState = this.updateUser.employerId;
      this.updateForm = this.fb.group({
        email: [this.updateUser.email, Validators.compose([Validators.required])],
        role: [null, Validators.compose([Validators.required])],
        employerId: ["Not employed", Validators.compose([Validators.required])]
      });
    }
    if (!state) {
      this.updatePressed = false;
      this.showUsers = true;
      this.updateForm = this.fb.group({
        email: [null, Validators.compose([Validators.required])],
        role: [null, Validators.compose([Validators.required])],
        employerId: ["Not employed", Validators.compose([Validators.required])]
      });
    }
  }

  onUpdateSubmit(pos) {
    this.userServices.updatePos(this.updateUser.email, pos);
    this.onUpdate(this.updateUser.id, false);
    window.location.reload();
  }

  ChangeRoleForAdminOrCustomer(email) {
    console.log(email)
    console.log(this.updateForm.getRawValue())
    console.log(this.updateForm.getRawValue()['employerId'])
    if (this.updateForm.getRawValue()['employerId'] === 'Not employed') {
      this.userServices.updateRoleUserNotEmployed(email, this.updateForm.value).subscribe(
        (user) => { console.log(user); },
        (error) => { console.log('Error', error); },
        (async () => { await delay(1000); await this.getUsers() })
      );
    } else {
      this.userServices.updateRoleUserYesEmployed(email, this.updateForm.value).subscribe(
        (user) => { console.log(user); },
        (error) => { console.log('Error', error); },
        (async () => { await delay(1000); await this.getUsers() })
      ); 
    };
    function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }
    this.updatePressed = false;
    this.showUsers = true;
    this.updateForm = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      role: [null, Validators.compose([Validators.required])],
      employerId: ["Not employed", Validators.compose([Validators.required])]
    });
  }

  onCancelRoleForEmployer() {
    this.employedState = this.updateUser.employerId;
    this.updateForm = this.fb.group({
      email: [this.updateUser.email, Validators.compose([Validators.required])],
      role: [this.updateUser.role, Validators.compose([Validators.required])],
      employerId: [this.updateUser.employerId, Validators.compose([Validators.required])]
    });
    this.userServices.cancelRoleForEmployer(this.updateUser.email, this.updateForm.value).subscribe(
      (user) => { console.log(user); },
      (error) => { console.log('Error', error); },
      (async () => { await delay(1000); await this.getUsers() })
    );
    function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }
    this.updatePressed = false;
    this.showUsers = true;
    this.updateForm = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      role: [null, Validators.compose([Validators.required])],
      employerId: ["Not employed", Validators.compose([Validators.required])]
    });
  }
}