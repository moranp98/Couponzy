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

  constructor(private router: Router, public firebaseService: FirebaseService) { }

  ngOnInit() {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser);
    console.log(this.currentUser)

    if (localStorage.getItem('user') !== null) {
      this.isSignedIn = true
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
  }

  async onSignin(email: string, password: string) {
    await this.firebaseService.signin(email, password)

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



