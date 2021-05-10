import { Injectable } from '@angular/core';
import { Observable, Operator } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { CouponTypes } from '../models/couponTypes';

@Injectable({
  providedIn: 'root'
})
export class ManageCouponTypesService {

  private couponTypesUrl = environment.couponTypesUrl;
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getAllCouponTypes(): Observable<CouponTypes[]> {
    const url = `${this.serverUrl}/${'CouponTypes'}`;
    return this.http.get<CouponTypes[]>(this.couponTypesUrl);
  }
}