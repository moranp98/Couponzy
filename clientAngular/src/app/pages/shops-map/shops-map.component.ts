import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageBranchesService } from '../../services/manage-branches.service';
import { ManageShopsService } from '../../services/manage-shops.service';
import { Branches } from '../../models/branches';
import { Router } from '@angular/router';
import { Shops } from '../../models/shops';


@Component({
  selector: 'page-shops-map',
  templateUrl: './shops-map.component.html',
  styleUrls: ['./shops-map.component.scss']
})
export class PageShopsMapComponent implements OnInit {
  pageTitle: string = 'מפת חנויות ארצית';
  lat: number = 32.176;
  lng: number = 34.894;

  shops: Shops[] = [];
  branches: Branches[] = [];
  currentSearchBranches: Branches[] = []

  selectedShop: string = '';
  selectedCity: string = '';
  selectedOpen: boolean = true;

  // Constractor
  constructor(private _sharedService: SharedService,
    private _manageshops: ManageShopsService,
    private ShowBranchesService: ManageBranchesService,
    private router: Router) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    this.showShops();
    this.showBranches();
    if(localStorage.getItem('user')== null){
      this.router.navigate(['/roadstart-layout/sign-in-social']);
      }
  }

  showShops() {
    this._manageshops.getAllShops().subscribe((shops) => {
      this.shops = shops.filter(shop => shop.isExists !== false);;
    });
  }

  showBranches() {
    this.ShowBranchesService.getBranches().subscribe((branches) => {
      branches.forEach(branch => {
        if (branch.isOpen)
          branch.stateOpen = "פתוח";
        else
          branch.stateOpen = "סגור";
      });
      this.branches = branches.filter(branch => branch.isExists !== false);
    })
  }

  onSearch(selectedShop: string) {
    let termShop = selectedShop;
    let termCity = this.selectedCity;
    let termOpen = this.selectedOpen;
    this.currentSearchBranches = this.branches.filter(branch => {
      return branch.address['city'] === termCity || branch['isOpen'] === termOpen || branch.shop['shopName'] === termShop;
    });
  }

  onStopSearch(selectedShop: string) {
    this.currentSearchBranches.splice(0, this.currentSearchBranches.length)
  }
}