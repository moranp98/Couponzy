import { Injectable } from '@angular/core';
import { Observable, Operator } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Shops } from '../models/shops';

@Injectable({
  providedIn: 'root'
})
export class ManageShopsService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getAllShops(): Observable<Shops[]> {
    const url = `${this.serverUrl}/${'Shops'}`;
    return this.http.get<Shops[]>(url);
  }

  createShop(formBranch): Observable<any> {
    const url = `${this.serverUrl}/${'Shop'}`;
    return this.http.post<any>(url, formBranch);
  }

  getShopById(id: string): Observable<Shops> {
    console.log(id);
    const url = `${this.serverUrl}/${'Shop'}/${id}`;
    console.log(url);
    return this.http.get<Shops>(url);
  }

  getShopByBranchId(id: string): Observable<Shops> {
    console.log(id);
    const url = `${this.serverUrl}/${'Shop/BranchId'}/${id}`;
    console.log(url);
    return this.http.get<Shops>(url);
  }

  updateShop(formBranch, id: string): Observable<Shops> {
    console.log(id);
    const url = `${this.serverUrl}/${'Shop'}/${id}`;
    return this.http.put<Shops>(url, formBranch);
  }
/*Don't use it */
  deleteShop(id: string): Observable<Shops> {
    const url = `${this.serverUrl}/${'Shop'}/${id}`;
    return this.http.delete<Shops>(url);
  }
/*Use this for Delete */
  lockoutShop(id: string): Observable<Shops> {
    const url = `${this.serverUrl}/${'Shop/lockout'}/${id}`;
    return this.http.put<Shops>(url, '');
  }
}
