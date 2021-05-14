import { Component, OnInit } from '@angular/core';
import { Users } from '../../models/users';

@Component({
  moduleId: module.id,
  selector: 'logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  currentUser: Users;
  displayRole: string;

  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)

    switch (this.currentUser.role) {
      case 'shopManager':
        this.displayRole = 'מנהל מכירות';
        break;
      case 'seller':
        this.displayRole = 'מוכר';
        break;
      default:
        this.displayRole = 'מנהח מערכת';
        break;
    }
  }
}
