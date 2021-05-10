import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { CouponTypes } from '../models/couponTypes';

@Injectable({
  providedIn: 'root'
})
export class ManageCouponTypeService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getAllCouponTypes(): Observable<CouponTypes[]> {
    const url = `${this.serverUrl}/${'CouponTypes'}`;
    return this.http.get<CouponTypes[]>(url);
  }

  createCouponType(formBranch): Observable<any> {
    const url = `${this.serverUrl}/${'CouponType'}`;
    return this.http.post<any>(url, formBranch);
  }

  updateCouponType(formBranch, id: string): Observable<CouponTypes> {
    console.log(id);
    const url = `${this.serverUrl}/${'CouponType'}/${id}`;
    return this.http.put<CouponTypes>(url, formBranch);
  }

  deleteCouponType(id: string): Observable<CouponTypes> {
    const url = `${this.serverUrl}/${'CouponType'}/${id}`;
    return this.http.delete<CouponTypes>(url);
  }

  lockoutCouponType(id: string): Observable<CouponTypes> {
    const url = `${this.serverUrl}/${'CouponType/lockout'}/${id}`;
    return this.http.put<CouponTypes>(url, '');
  }
}
