import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/typings/overlay-directives';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Coupons } from '../models/coupons';


@Injectable({
  providedIn: 'root'
})
export class ManageCouponsService {

  private couponsUrl = environment.couponsUrl;
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getCoupons(): Observable<Coupons[]> {
    const url = `${this.serverUrl}/${"Coupons"}`;
    return this.http.get<Coupons[]>(url);
  }

  createCoupon(formCoupon): Observable<any> {
    const url = `${this.serverUrl}/${"Coupon"}`;
    console.log(formCoupon);
    return this.http.post<any>(url, formCoupon);
  }

  updateCoupon(formCoupon, id: string): Observable<Coupons[]> {
    console.log(id);
    const url = `${this.serverUrl}/${'Coupon'}/${id}`;
    console.log(formCoupon);
    console.log(url);

    return this.http.put<Coupons[]>(url, formCoupon);
  }

  deleteCoupon(id: string): Observable<Coupons> {
    const url = `${this.serverUrl}/${'Coupon'}/${id}`;
    return this.http.delete<Coupons>(url);
  }

  getCountCoupons(): Observable<number> {
    const url = `${this.couponsUrl}/${"getCountCoupons"}`;
    return this.http.get<number>(url);
  }
}
