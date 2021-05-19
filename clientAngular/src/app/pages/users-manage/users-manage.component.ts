import { Component, OnInit } from '@angular/core';
import { Shops } from 'src/app/models/shops';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from '../../layouts/shared.service';
import { ShopService } from 'src/app/services/manage-shops';
import {ManageBranchesService } from 'src/app/services/manage-branches.service'
import { ManageShopsService } from 'src/app/services/manage-shops.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { shop } from '../shops-manage/shops-manage.component';
import { Branches } from 'src/app/models/branches';
interface Pos{
  value:number;
  viewValue:string;
}

@Component({
  selector: 'page-users-manage',
  templateUrl: './users-manage.component.html',
  styleUrls: ['./users-manage.component.scss']
})



export class PageUsersManageComponent implements OnInit {
  pageTitle: string = 'ניהול משתמשים';

  users : Users[] = [];  
  shops: Shops[]=[];
  branches: Branches[]=[];
  currentShop : Shops;
  currentShopBranchName:string;
  updatePressed:boolean= false;
  showUsers:boolean=true;
  updateUser:Users;
  name:string;
  posSelected:string;
  posNumber:number;
  isSeller:boolean=false;
  isShopManager:boolean=false;
  currentUser: Users;
  public updateForm: FormGroup;
  // Constractor
  constructor( private _sharedService: SharedService, 
               private userServices: UserService, 
               private shopServices:ShopService,
               private shopsServices:ManageShopsService,
               private router: Router,
               private fb: FormBuilder,
               private branchServices:ManageBranchesService) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)
    if(localStorage.getItem('user') == null || this.currentUser.role !== 'admin'){
      this.router.navigate(['/roadstart-layout/sign-in-social']);
      }
      else{
        this.load();
      }
  }

  posi: Pos[]=[
    {value: 0, viewValue : "מנהל"},
    {value: 1, viewValue : "מוכר"},
    {value: 2, viewValue : "מנהל חנות"},
    {value: 3, viewValue : "לקוח"}
  ];

  posControl = new FormControl('', Validators.required);
  shopControl= new FormControl('', Validators.required);
  load(){
    this.getShops();

    this.userServices.getUsers().subscribe(data => {
      this.users = data;
    });

  }

  checkP(user:Users){
    if(user.role=="admin")
      return "מנהל"
    else if(user.role=="seller")
      return "מוכר"
    else if(user.role=="shopManager")
      return "מנהל חנות"
    return "לקוח"
  }

   checkShop(user:Users){
    if(user.employerId!="Not employed"){
      console.log(user.employerId)
    this.shopsServices.getShopById(user.employerId).subscribe
     ( (shop) =>   {  this.currentShop  = shop; },
      (error) => { this.shopsServices.getShopByBranchId(user.employerId).subscribe(
       (branch) =>   {  this.currentShop  = branch; },
       (error) => {return "---";})}
       ); 
       return this.currentShop.shopName;
    }
    return "---";
  }

  onUpdate( email: string, state: boolean,){
    console.log("Entered onUpdate")
    if(state){
      console.log(email);
      this.updatePressed = true;
      this.showUsers=false;
      this.updateUser = this.users.find(user => user.email === email);
      this.posSelected=this.checkP(this.updateUser);
      this.name=this.updateUser.userName.firstName + " " + this.updateUser.userName.lastName + ", סוג משתמש: " + this.posSelected;
      this.posControl = new FormControl('', Validators.required);
      this.shopControl = new FormControl('', Validators.required);
      if(this.updateUser.role=="seller")
        this.isSeller=true;
        this.getBranches();
      if(this.updateUser.role=="shopManager"){
        this.isShopManager=true;
        this.getShops();
      }
    }
    if(!state){
      this.updatePressed = false;
      this.showUsers=true;
      this.isSeller=false;
      this.isShopManager=false;
    }
  }

   onUpdateSubmit(pos){
    this.userServices.updatePos(this.updateUser.email,pos);
    this.onUpdate(this.updateUser.id,false);
    window.location.reload();
  }

  getShops(){
    this.shopsServices.getAllShops().subscribe(data => {
      this.shops = data;
    });
  }
  getBranches(){
    this.branchServices.getAllBranchesByShopId(this.currentUser.employerId).subscribe(data => {
      this.branches = data;
    });
  }

   onShopSubmit(shop){
    this.shopServices.addShopToUser(this.updateUser.email,shop);
    this.onUpdate(this.updateUser.email,false);
    //window.location.reload();
  }
  onBranchSubmit(branch,email){
    console.log("branch : "+ branch)
    console.log("email : "+ email)
    this.updateForm=this.fb.group({
      employerId:[branch, Validators.compose([Validators.required])],
    });
    this.userServices.updateUser(email,this.updateForm.value).subscribe
    ( (user) => {console.log('Success updated user role', user); },
      (error) => { console.log('Error', error); });
    this.onUpdate(this.updateUser.email,false);
  }
  log(val) { console.log(val); }

  onToggle(email,status){
   console.log(email +": "+ status.toString())

   this.updateForm=this.fb.group({
     active:[status, Validators.compose([Validators.required])],
   });

   this.userServices.updateUser(email,this.updateForm.value).subscribe
   ( (user) => {console.log('Success updated status', user); },
     (error) => { console.log('Error', error); });
   }

   ChangeUserRole(email,role){
      console.log(email)
      console.log(role)
      this.posNumber=role;
      if(role==0){
        role="admin"
      }
      else if (role==1){
        role="seller"
      }
      else if (role==2){
        role="shopManager"
      }
      else{
        role="customer"
      }
      console.log(role)
     this.updateForm=this.fb.group({
      role:[role, Validators.compose([Validators.required])],
    });
    this.userServices.updateUser(email,this.updateForm.value).subscribe
    ( (user) => {console.log('Success updated user role', user); },
      (error) => { console.log('Error', error); });
   }
   
}