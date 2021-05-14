import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Branches } from '../models/branches';

@Injectable({
  providedIn: 'root'
})
export class ManageBranchesService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getBranches(): Observable<Branches[]> {
    const url = `${this.serverUrl}/${'Branches'}`;
    return this.http.get<Branches[]>(url);
  }

  getAllBranchesByShopId(id: string): Observable<Branches[]> {
    const url = `${this.serverUrl}/${'Branches/ShopId'}/${id}`;
    return this.http.get<Branches[]>(url);
  }

  createBranch(formBranch): Observable<any> {
    const url = `${this.serverUrl}/${'Branch'}`;
    return this.http.post<any>(url, formBranch);
  }
  
  getBranchById(id: string): Observable<Branches> {
    const url = `${this.serverUrl}/${'Branch'}/${id}`;
    return this.http.get<Branches>(url);
  }
  
  updateBranch(formBranch, id: string): Observable<Branches[]> {
    const url = `${this.serverUrl}/${'Branch'}/${id}`;
    return this.http.put<Branches[]>(url, formBranch);
  }

  deleteBranch(id: string): Observable<Branches> {
    const url = `${this.serverUrl}/${'Branch'}/${id}`;
    return this.http.delete<Branches>(url);
  }

  lockoutBranch(id: string): Observable<Branches> {
    const url = `${this.serverUrl}/${'Branch/lockout'}/${id}`;
    return this.http.put<Branches>(url, '');
  }

  getCountBranches(): Observable<number> {
    const url = `${this.serverUrl}/${"getCountBranches"}`;
    return this.http.get<number>(url);
  }

  getCountIsOpenBranches(): Observable<number> {
    const url = `${this.serverUrl}/${"getCountIsOpenBranches"}`;
    return this.http.get<number>(url);
  }

  getCountBranchesByShopId(id: string): Observable<number> {
    const url = `${this.serverUrl}/${"getCountBranchesByShopId"}/${id}`;
    return this.http.get<number>(url);
  }
}
