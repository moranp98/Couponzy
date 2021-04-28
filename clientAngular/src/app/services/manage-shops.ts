import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Shops } from '../models/shops';
@Injectable({
  providedIn: 'root',
})


export class ShopService {
  private ShopsUrl = environment.shopssUrl;
  

  constructor(private http: HttpClient) { }

  getShops(): Observable<Shops[]>{
    return this.http.get<Shops[]>(this.ShopsUrl);
  }

  addShopToUser(sellerId,shopId){
      const url=`${this.ShopsUrl}/${sellerId}`;
      return this.http.patch<Shops>(url,{shopId:shopId}).subscribe();
  }

}