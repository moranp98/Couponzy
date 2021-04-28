import { Injectable } from '@angular/core';
import { Observable, Operator } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Users } from '../models/users';


@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {

  private usersUrl = environment.usersUrl;

  constructor(private http: HttpClient) { }
  
  getCountUsers(): Observable<number> {
    const url = `${this.usersUrl}/${"getCountUsers"}`;
    return this.http.get<number>(url);
  }

  getLastUsers(): Observable<Users[]> {
    const url = `${this.usersUrl}/${"getLastUsers"}`;
    return this.http.get<Users[]>(url);
  }

  /*getCountLasvtUsers(): Observable<number> {
    const url = `${this.usersUrl}/${"getCountLasvtUsers"}`;
    return this.http.get<number>(url);
  }*/
}
