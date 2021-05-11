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
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getCoupons(): Observable<Coupons[]> {
    const url = `${this.serverUrl}/${"Coupons"}`;
    return this.http.get<Coupons[]>(url);
  }

  createCoupon(formCoupon): Observable<any> {
    const url = `${this.serverUrl}/${"Coupon"}`;
    return this.http.post<any>(url, formCoupon);
  }

  updateCoupon(formCoupon, id: string): Observable<Coupons[]> {
    const url = `${this.serverUrl}/${'Coupon'}/${id}`;
    return this.http.put<Coupons[]>(url, formCoupon);
  }

  deleteCoupon(id: string): Observable<Coupons> {
    const url = `${this.serverUrl}/${'Coupon'}/${id}`;
    return this.http.delete<Coupons>(url);
  }

  lockoutCoupon(id: string): Observable<Coupons> {
    const url = `${this.serverUrl}/${'Coupon/lockout'}/${id}`;
    return this.http.put<Coupons>(url, '');
  }

  getCountCoupons(): Observable<number> {
    const url = `${this.serverUrl}/${"getCountCoupons"}`;
    return this.http.get<number>(url);
  }

  getCountValidCoupons(): Observable<number> {
    const url = `${this.serverUrl}/${"getCountValidCoupons"}`;
    return this.http.get<number>(url);
  }
}
