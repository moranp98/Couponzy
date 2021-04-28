import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  moduleId: module.id,
  selector: 'default-layout',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  providers: [ SharedService ]
})
export class DefaultLayoutComponent implements OnInit {
  pageTitle: any;
  rtl: boolean;
  @Input() openedSidebar: boolean;
  constructor(private _sharedService: SharedService) { 
    this.rtl = true;
    this.openedSidebar = false;

    _sharedService.changeEmitted$.subscribe(
      title => {
        this.pageTitle = title;
        this.openedSidebar = false;
      }
    );
  }

  ngOnInit(): void {
  }

  getClasses() {
    return {
      'open-sidebar': this.openedSidebar,
      'rtl': this.rtl
    };
  }

  sidebarState() {
    this.openedSidebar = !this.openedSidebar;
  }
}
