import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Orders } from '../models/orders';

@Injectable({
  providedIn: 'root'
})
export class ManageOrdersService {
  
  private ordersUrl = environment.ordersUrl;

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]>(this.ordersUrl);
  }

  getMapReduceOrders(): Observable<any[]> {
    const url = `${this.ordersUrl}/${"mapChartData"}`;
    return this.http.get<any[]>(url);
  }
}
