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

  constructor(private router: Router, public firebaseService: FirebaseService) { }

  ngOnInit() {
    if (localStorage.getItem('user') !== null) {
      this.isSignedIn = true
      this.router.navigate(['/default-layout/dashboard']);
    }
    else
      this.isSignedIn = false
  }

  async onSignin(email: string, password: string) {
    await this.firebaseService.signin(email, password)

    if (this.firebaseService.isLoggedIn) {
      console.log("LOGGGEED INNN")
      this.isSignedIn = true
      this.router.navigate(['/default-layout/dashboard']);
    }
  }
}



