import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private source = new BehaviorSubject(null);
  currentUser = this.source.asObservable();

  constructor() { }

  changeCurrentBrand(user: Users) {
    this.source.next(user);
  }
}
