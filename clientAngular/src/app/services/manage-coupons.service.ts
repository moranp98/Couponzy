import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageCouponsService {

  private couponsUrl = environment.couponsUrl;

  constructor(private http: HttpClient) { }

  getCountCoupons(): Observable<number> {
    const url = `${this.couponsUrl}/${"getCountCoupons"}`;
    return this.http.get<number>(url);
  }
}
