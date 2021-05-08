import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Reviews } from '../models/reviews';

@Injectable({
  providedIn: 'root'
})
export class TimelineCouponzyService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getAllReviews(): Observable<Reviews[]> {
    const url = `${this.serverUrl}/${'Reviews'}`;
    console.log(url);
    return this.http.get<Reviews[]>(url);
  }

}
