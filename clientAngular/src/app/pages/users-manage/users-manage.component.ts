import { Component, OnInit } from '@angular/core';
import { Form, FormControl, Validators } from '@angular/forms';
import { Shops } from 'src/app/models/shops';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from '../../layouts/shared.service';
import { ShopService } from 'src/app/services/manage-shops';
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
  updatePressed:boolean= false;
  showUsers:boolean=true;
  updateUser:Users;
  name:string;
  posSelected:string;
  isSeller:boolean=false;
  // Constractor
  constructor( private _sharedService: SharedService, private userServices: UserService, private shopServices:ShopService) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.load();
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
    if(user.isAdmin)
      return "מנהל"
    else if(user.isSeller)
      return "מוכר"
    return "קונה"
  }

  checkShop(user:Users){
    if(user.shop){
     return this.shops.find(shop=>shop.id===user.shop).shopName;
    }
    return "---";
  }

  onUpdate(state: boolean, id: string){
    if(state){
      console.log(id);
      this.updatePressed = true;
      this.showUsers=false;
      this.updateUser = this.users.find(user => user._id === id);
      this.posSelected=this.checkP(this.updateUser);
      this.name=this.updateUser.firstName + " " + this.updateUser.lastName + ", סוג משתמש: " + this.posSelected;
      if(this.updateUser.isSeller)
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
    this.userServices.updatePos(this.updateUser._id,pos);
    this.onUpdate(false,this.updateUser._id);
    window.location.reload();
  }

  getShops(){
    this.shopServices.getShops().subscribe(data => {
      this.shops = data;
    });
  }

   onShopSubmit(shop){
    this.shopServices.addShopToUser(this.updateUser._id,shop);
    this.onUpdate(false,this.updateUser._id);
    window.location.reload();
  }
}