import { Component } from '@angular/core';
import { MainMenuItem } from './main-menu-item';
import { MainMenuService } from './main-menu.service';

@Component({
  moduleId: module.id,
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent  {
  mainMenuItems: MainMenuItem[];

  constructor(private mainMenuService: MainMenuService) { }

  getMainMenuItems(): void {
		const OBSERVER = {
			next: x => this.mainMenuItems = x
		}
    this.mainMenuService.getData().subscribe(OBSERVER);
    var role = localStorage.getItem('role');
    console.log("Current Role : " + role)

    if(role === "admin"){
      console.log("Entered Admin's MainMenu")
      this.mainMenuService.getData().subscribe(OBSERVER);
    }

    if(role === "shopManager"){
      console.log("Entered ShopManager's MainMenu")
      this.mainMenuService.getDataShopManager().subscribe(OBSERVER);
    }

    if(role === "seller"){
      console.log("Entered Seller's MainMenu")
      this.mainMenuService.getDataSeller().subscribe(OBSERVER);
    }
  }

  ngOnInit(): void {
		this.getMainMenuItems();
  }

  toggle(event: Event, item: any, el: any) {
    event.preventDefault();

    let items: any[] = el.mainMenuItems;

    if (item.active) {
      item.active = false;
    } else {
      for (let i = 0; i < items.length; i++) {
        items[i].active = false;
      }
      item.active = true;
    }
  }
}
