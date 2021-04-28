import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Brand } from '../models/brands';

@Injectable({
  providedIn: 'root'
})
export class CurrentBrandService {

  private source = new BehaviorSubject(null);
  currentBrand = this.source.asObservable();

  constructor() { }

  changeCurrentBrand(brand: Brand) {
    this.source.next(brand);
  }
}
