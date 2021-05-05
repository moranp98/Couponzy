import { Injectable } from '@angular/core';
import { Observable, Operator } from 'rxjs';
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
    const url = `${this.serverUrl}/${"Branches"}`;
    return this.http.get<Branches[]>(this.serverUrl);
  }

  createBranch(formBranch): Observable<any> {
    const url = `${this.branchesUrl}/${"create"}`;
    return this.http.post<any>(url, formBranch);
  }

  updateBranch(formBranch, ip: string): Observable<Branches[]> {
    const url = `${this.branchesUrl}/${ip}`;
    return this.http.post<Branches[]>(url, formBranch);
  }

  deleteBranch(ip: string): Observable<Branches> {
    const url = `${this.branchesUrl}/${ip}`;
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
