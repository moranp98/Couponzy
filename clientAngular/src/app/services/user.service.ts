import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../models/users';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})


export class UserService {
  private UsersUrl = environment.usersUrl;
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  addUser(formUser):Observable<any> {
    const url = `${this.serverUrl}/${'User'}`;
    console.log(url + " this is for user")
    console.log(formUser.email + " this is for user")
    return this.http.post<any>(url, formUser);
  }

  getUser(email:string): Observable<Users> {
    const url=`${this.UsersUrl}/${email}`
    console.log("link of get User " + url);
    return this.http.get<Users>(url);
  }

  getUsers(): Observable<Users[]>{
    return this.http.get<Users[]>(this.UsersUrl);
  }

  updatePos(id,position:number){
    const url=`${this.UsersUrl}/${id}`;
    return this.http.patch<Users>(url,{pos:position}).subscribe();
  }
}