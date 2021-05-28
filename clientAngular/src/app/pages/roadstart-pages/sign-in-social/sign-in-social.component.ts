import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { FirebaseService } from '../../../services/firebase.service'
import { Users } from 'src/app/models/users';
@Component({
  selector: 'page-sign-in-social',
  templateUrl: './sign-in-social.component.html',
  styleUrls: ['./sign-in-social.component.scss']
})
export class PageSignInSocialComponent implements OnInit {
  pageTitle: string = 'כניסה';
  data: Users;
  isSignedIn = false
  currentUser: Users;
  currentRole: string;
  accessDenied: boolean = false;
  isLockout: boolean = false;
  isRegistered: boolean = false;
  constructor(private router: Router,
    public firebaseService: FirebaseService,
    public userService: UserService) { }

  ngOnInit() {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser);
    console.log(this.currentUser)

    if (localStorage.getItem('user') !== null) {
      this.isSignedIn = true
      console.log('this.isSignedIn = true --------> localStorage(user) === true with active=false')
      switch (this.currentUser.role) {
        case 'seller':
          this.router.navigate(['/default-layout/coupons-sale']);
          break;
        default: // role --> 'admin', shopManager
          this.router.navigate(['/default-layout/dashboard']);
          break;
      }
    }
    else
      this.isSignedIn = false
    console.log('this.isSignedIn = false --------> localStorage(user) === true with active=false')
  }

  onSignin(email: string, password: string) {
    this.userService.getUser(email).subscribe(
      (user) => {
      this.currentRole = user.role;
      console.log(this.currentRole)
      if (this.currentRole === 'admin' || this.currentRole === 'shopManager' || this.currentRole === 'seller') {
        if (user.active === true) {
          this.onSigninWithCredential(email, password)
        } else {
          this.isLockout = true;
        }
      } else {
        this.accessDenied = true;
      }
    }, 
    (error) => { console.log('Error', error); this.isRegistered = true; });
  }

  async onSigninWithCredential(email: string, password: string) {
    await this.firebaseService.signin(email, password);
    if (this.firebaseService.isLoggedIn) {
      console.log("LOGGGEED INNN")
      console.log(this.currentUser)
      this.isSignedIn = true;
      switch (localStorage.getItem('role')) {
        case 'seller':
          this.router.navigate(['/default-layout/coupons-sale']);
          break;
        default: // role --> 'admin', shopManager
          this.router.navigate(['/default-layout/dashboard']);
          break;
      }
    }
  }
}