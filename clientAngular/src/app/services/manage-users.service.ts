import { Injectable } from '@angular/core';
import { Observable, Operator } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Users } from '../models/users';
import { lastUsers } from '../models/lastUsers';


@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }
  
  getCountUsers(): Observable<number> {
    const url = `${this.serverUrl}/${"getCountUsers"}`;
    return this.http.get<number>(url);
  }

  getLastUsers(): Observable<lastUsers[]> {
    const url = `${this.serverUrl}/${"getLastUsers"}`;
    return this.http.get<lastUsers[]>(url);
  }

  /*getCountLasvtUsers(): Observable<number> {
    const url = `${this.usersUrl}/${"getCountLasvtUsers"}`;
    return this.http.get<number>(url);
  }*/
}
