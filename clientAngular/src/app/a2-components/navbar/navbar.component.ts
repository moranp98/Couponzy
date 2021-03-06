import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

import { Users } from '../../models/users';

export class userName {
  firstName: string;
  lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  @Input() title: string;
  @Input() openedSidebar: boolean = false;
  @Output() sidebarState = new EventEmitter();
  @Output() isLogout = new EventEmitter<void>()
  currentUser: Users;
  currentUserName: userName;

  constructor(private router: Router,public firebaseService: FirebaseService) {}

  open(event) {
    let clickedComponent = event.target.closest('.nav-item');
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
    clickedComponent.classList.add('opened');
  }

  close(event) {
    let clickedComponent = event.target;
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }

  openSidebar() {
    this.openedSidebar = !this.openedSidebar;
    this.sidebarState.emit();
  }
  
  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)
    if(this.currentUser==null){
      this.currentUserName = new userName("firstName","lastName")
    }
    else{
    this.currentUserName = new userName(this.currentUser.userName.firstName, this.currentUser.userName.lastName);
  }
    console.log(this.currentUserName)
    
  }

  logout(){
    this.firebaseService.logout();
    this.isLogout.emit();
    console.log("LOGGED OUT")
    this.router.navigate(['/roadstart-layout/sign-in-social']);
  }
}
