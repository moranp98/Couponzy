import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brands';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private BrandsUrl = environment.brandsUrl;

  constructor(private http: HttpClient) { }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.BrandsUrl);
  }
}