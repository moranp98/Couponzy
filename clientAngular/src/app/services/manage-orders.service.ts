import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Orders } from '../models/orders';

@Injectable({
  providedIn: 'root'
})
export class ManageOrdersService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Orders[]> {
    const url = `${this.serverUrl}/${"Orders"}`;
    return this.http.get<Orders[]>(url);
  }

  saleCoupon(formCoupon): Observable<any> {
    const url = `${this.serverUrl}/${"Order"}`;
    return this.http.post<any>(url, formCoupon);
  }
}
