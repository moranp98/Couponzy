import { Injectable } from '@angular/core';
import { Observable, Operator } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Shops } from '../models/shops';

@Injectable({
  providedIn: 'root'
})
export class ManageShopsService {

  private shopsUrl = environment.shopsUrl;

  constructor(private http: HttpClient) { }

  getAllShops(): Observable<Shops[]> {
    return this.http.get<Shops[]>(this.shopsUrl);
  }
}
