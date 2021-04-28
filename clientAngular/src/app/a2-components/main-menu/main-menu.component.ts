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
