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
  updateUser(id: string,formUser):Observable<any> {
    const url = `${this.serverUrl}/UpdateUser/${id}`;
    console.log(url + " this is for user update")
    console.log(formUser.email + " this is for user")
    console.log(formUser);
    return this.http.put<any>(url, formUser);
  }

  updateRoleUserNotEmployed(id: string,formUser):Observable<any> {
    const url = `${this.serverUrl}/UserNotEmployed/${id}`;
    return this.http.put<any>(url, formUser);
  }
  updateRoleUserYesEmployed(id: string, formUser): Observable<any> {
    console.log(formUser);
    console.log(id);
    const url = `${this.serverUrl}/${'UserYesEmployed'}/${id}`;
    return this.http.put<any>(url, formUser);
  }

  cancelRoleForEmployer(id: string, formUser): Observable<any> {
    console.log(formUser);
    console.log(id);
    const url = `${this.serverUrl}/${'UserCancelEmployer'}/${id}`;
    return this.http.put<any>(url, formUser);
  }

  getUser(email:string): Observable<Users> {
    const url=`${this.UsersUrl}/${email}`
    console.log("link of get User " + url);
    return this.http.get<Users>(url);
  }

  getUsers(): Observable<Users[]>{
    const url = `${this.serverUrl}/${'Users'}`;
    console.log(url);
    return this.http.get<Users[]>(url);
  }

  updatePos(id,position:number){
    const url=`${this.UsersUrl}/${id}`;
    return this.http.patch<Users>(url,{pos:position}).subscribe();
  }
}