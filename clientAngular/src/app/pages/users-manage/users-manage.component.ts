import { Component, OnInit } from '@angular/core';
import { Shops } from 'src/app/models/shops';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from '../../layouts/shared.service';
import { ShopService } from 'src/app/services/manage-shops';
import { ManageShopsService } from 'src/app/services/manage-shops.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { shop } from '../shops-manage/shops-manage.component';
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
  currentShop : Shops;
  updatePressed:boolean= false;
  showUsers:boolean=true;
  updateUser:Users;
  name:string;
  posSelected:string;
  isSeller:boolean=false;
  currentUser: Users;
  public updateForm: FormGroup;
  // Constractor
  constructor( private _sharedService: SharedService, 
               private userServices: UserService, 
               private shopServices:ShopService,
               private shopsServices:ManageShopsService,
               private router: Router,
               private fb: FormBuilder) {
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
    {value: 2, viewValue : "קונה"}
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
      this.shopsServices.getShopById(user.employerId).subscribe
     ( (shop) =>   { console.log(shop); this.currentShop  = shop;},
       (error) => { console.log('Error', error); });
       return this.currentShop.shopName;
    }
    return "---";
  }

  onUpdate(state: boolean, id: string){
    if(state){
      console.log(id);
      this.updatePressed = true;
      this.showUsers=false;
      this.updateUser = this.users.find(user => user.id === id);
      this.posSelected=this.checkP(this.updateUser);
      this.name=this.updateUser.userName.firstName + " " + this.updateUser.userName.lastName + ", סוג משתמש: " + this.posSelected;
      if(this.updateUser.role=="seller")
        this.isSeller=true;
      this.posControl = new FormControl('', Validators.required);
      this.shopControl = new FormControl('', Validators.required);
      if(this.isSeller)
        this.getShops();
      
    }
    if(!state){
      this.updatePressed = false;
      this.showUsers=true;
      this.isSeller=false;
    }
  }

   onUpdateSubmit(pos){
    this.userServices.updatePos(this.updateUser.id,pos);
    this.onUpdate(false,this.updateUser.id);
    window.location.reload();
  }

  getShops(){
    this.shopServices.getShops().subscribe(data => {
      this.shops = data;
    });
  }

   onShopSubmit(shop){
    this.shopServices.addShopToUser(this.updateUser.id,shop);
    this.onUpdate(false,this.updateUser.id);
    window.location.reload();
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

   ChangeUserRole(shopId){
     this.shopsServices.getShopById(shopId)
   }
}