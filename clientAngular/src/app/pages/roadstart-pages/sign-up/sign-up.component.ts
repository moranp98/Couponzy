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
  public updateForm: FormGroup;
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
      email: [null, Validators.compose([Validators.required])],
      address: this.fb.group({ // make a nested group
        city: [null, Validators.compose([Validators.required])],
        zipcode: [null, Validators.compose([Validators.required])],
        country: [null, Validators.compose([Validators.required])]
      }),
      birthday:[null, Validators.compose([Validators.required])],
      gender:[null, Validators.compose([Validators.required])],
      maritalstatus:[null, Validators.compose([Validators.required])],
      userid:[null, Validators.compose([Validators.required])],
      username: this.fb.group({ // make a nested group
        firstname: [null, Validators.compose([Validators.required])],
        lastname: [null, Validators.compose([Validators.required])],
      }),
      phonenumber:[null, Validators.compose([Validators.required])],
    });
  }
  
async onSignup(email:string,password:string,passwordVal:string,firstName:string,lastName:string,country:string,city:string,zipcode:string,birthday:string,maritalstatus:string,gender:string,phoneNumber:string,userid:string){
  if(password==passwordVal){
    await this.firebaseService.signup(email,password)
    if(this.firebaseService.isLoggedIn){
      this.form=this.fb.group({
        email:email,
        city:city,
        zipcode:zipcode,
        country:country,
        birthday:birthday,
        gender:gender,
        maritalstatus:maritalstatus,
        userid:userid,
        firstName:firstName,
        lastName:lastName,
        phoneNumber:phoneNumber
      })
      this.updateForm=this.fb.group({
        email: [email, Validators.compose([Validators.required])],
        address: this.fb.group({ // make a nested group
          city: [city, Validators.compose([Validators.required])],
          zipcode: [zipcode, Validators.compose([Validators.required])],
          country: [country, Validators.compose([Validators.required])]
        }),
        birthday:[birthday, Validators.compose([Validators.required])],
        gender:[gender, Validators.compose([Validators.required])],
        maritalstatus:[maritalstatus, Validators.compose([Validators.required])],
        userid:[userid, Validators.compose([Validators.required])],
        username: this.fb.group({ // make a nested group
          firstname: [firstName, Validators.compose([Validators.required])],
          lastname: [lastName, Validators.compose([Validators.required])],
        }),
        phonenumber:[phoneNumber, Validators.compose([Validators.required])],
      });

      console.log(this.updateForm.value)
      this.userService.addUser(this.updateForm.value).subscribe(
        (user) => { console.log('Success', user); this.form.reset(); this.router.navigate(['/default-layout/dashboard']);},
        (error) => { console.log('Error', error); }
      );;
    this.isSignedIn = true
    //await this.router.navigate(['/default-layout/dashboard']);
    }
  }
}
}
