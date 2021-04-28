import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'roadstart-layout',
  templateUrl: './roadstart.component.html',
  styleUrls: ['./roadstart.component.scss']
})
export class RoadstartLayoutComponent {
  rtl: boolean = true;

  constructor() { }

}
