import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Branches } from '../models/branches';

@Injectable({
  providedIn: 'root'
})
export class ManageBranchesService {
  private branchesUrl = environment.branchesUrl;
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  getBranches(): Observable<Branches[]> {
    const url = `${this.serverUrl}/${'Branches'}`;
    return this.http.get<Branches[]>(url);
  }

  createBranch(formBranch): Observable<any> {
    const url = `${this.serverUrl}/${'Branch'}`;
    return this.http.post<any>(url, formBranch);
  }
  
  updateBranch(formBranch, id: string): Observable<Branches[]> {
    console.log(id);
    const url = `${this.serverUrl}/${'Branch'}/${id}`;
    return this.http.put<Branches[]>(url, formBranch);
  }

  deleteBranch(id: string): Observable<Branches> {
    const url = `${this.serverUrl}/${'Branch'}/${id}`;
    return this.http.delete<Branches>(url);
  }

  getCountBranches(): Observable<number> {
    const url = `${this.branchesUrl}/${"getCountBranches"}`;
    return this.http.get<number>(url);
  }

  getCountIsOpenBranches(): Observable<number> {
    const url = `${this.branchesUrl}/${"getCountIsOpenBranches"}`;
    return this.http.get<number>(url);
  }

  getCountCoupons(): Observable<number> {
    const url = `${this.branchesUrl}/${"getCountCoupons"}`;
    return this.http.get<number>(url);
  }

  getCountValidCoupons(): Observable<number> {
    const url = `${this.branchesUrl}/${"getCountValidCoupons"}`;
    return this.http.get<number>(url);
  }
}
