import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service'
import { UserService } from '../../../services/user.service'

@Component({
  selector: 'page-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class PageSignUpComponent implements OnInit {
  pageTitle: string = 'רישום';
  isSignedIn = false
  public form: FormGroup;

  constructor(private router: Router,
              public firebaseService : FirebaseService,
              public userService : UserService,
              private fb: FormBuilder) {}
              

  ngOnInit(){
    if(localStorage.getItem('user')!== null){
    this.isSignedIn= true
    this.router.navigate(['/default-layout/dashboard']);
    }
    else
    this.isSignedIn = false
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required])]
      // address: this.fb.group({ // make a nested group
      //   city: [null, Validators.compose([Validators.required])],
      //   street: [null, Validators.compose([Validators.required])],
      //   country: [null, Validators.compose([Validators.required])]
      // }),
      // birthday:[null, Validators.compose([Validators.required])],
      // gender:[null, Validators.compose([Validators.required])],
      // maritalstatus:[null, Validators.compose([Validators.required])],
      // userid:[null, Validators.compose([Validators.required])],
      // username: this.fb.group({ // make a nested group
      //   firstname: [null, Validators.compose([Validators.required])],
      //   lastname: [null, Validators.compose([Validators.required])],
      // }),
      // phonenumber:[null, Validators.compose([Validators.required])],
    });
  }
  
async onSignup(email:string,password:string,passwordVal:string){
  if(password==passwordVal){
    await this.firebaseService.signup(email,password)
    if(this.firebaseService.isLoggedIn){
      console.log(this.form.value)
      this.userService.addUser(this.form.value).subscribe(
        (user) => { console.log('Success', user); this.form.reset(); },
        (error) => { console.log('Error', error); }
      );;
    this.isSignedIn = true
    await this.router.navigate(['/default-layout/dashboard']);
    }
  }
}
}
