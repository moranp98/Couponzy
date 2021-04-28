import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private source = new BehaviorSubject(null);
  currentUser = this.source.asObservable();

  constructor() { }

  changeCurrentBrand(user: User) {
    this.source.next(user);
  }
}
