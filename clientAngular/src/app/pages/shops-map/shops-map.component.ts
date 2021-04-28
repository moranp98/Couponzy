import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { ManageBranchesService } from '../../services/manage-branches.service';
import { Branches } from '../../models/branches';


@Component({
  selector: 'page-shops-map',
  templateUrl: './shops-map.component.html',
  styleUrls: ['./shops-map.component.scss']
})
export class PageShopsMapComponent implements OnInit {
  pageTitle: string = 'מפת חנויות ארצית';
  lat: number = 32.176;
  lng: number = 34.894;

  branches: Branches[] = [];
  currentSearchBranches: Branches[] = []

  selectedShop: string = '';
  selectedCity: string = '';
  selectedOpen: boolean = true;

  // Constractor
  constructor(  private _sharedService: SharedService,
                private ShowBranchesService: ManageBranchesService,) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    this.showBranches();
  }

  showBranches() {
    this.ShowBranchesService.getBranches().subscribe((branches) => {
      branches.forEach(branch => {
        if (branch.isOpen)
          branch.stateOpen = "פתוח";
        else
          branch.stateOpen = "סגור";
      });
      this.branches = branches;
    })
  }

  onSearch(selectedShop: string) {
    let termShop = selectedShop;
    let termCity = this.selectedCity;
    let termOpen = this.selectedOpen;
    this.currentSearchBranches = this.branches.filter(object => {
      return object['city'] === termCity || object['isOpen'] === termOpen || object.shop['shopName'] === termShop;
    });
  }

  onStopSearch(selectedShop: string) {
    this.currentSearchBranches.splice(0, this.currentSearchBranches.length)
  }
}