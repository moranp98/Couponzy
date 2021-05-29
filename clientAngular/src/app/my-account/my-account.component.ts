import { Component, Input, OnInit } from '@angular/core';
import { Users } from '../models/users';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material"
import { UploaderComponent } from '../uploader/uploader.component';
import { ModalService } from '../_modal';
import { Observable } from 'rxjs';
import { AngularFireUploadTask } from '@angular/fire/storage';
export class userName {
  firstName: string;
  lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})

export class MyAccountComponent implements OnInit {
  currentUser: Users;
  currentUserName: userName;
  public updateForm: FormGroup;
  isModal: boolean = false;
  /*
START
Upload Profile Picture
*/
  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  i: number = 0;
  filename: string;
  datefile: any;
  isEdit: boolean = false;
  /*
    END
    Upload Profile Picture
    */

  constructor(public modalService: ModalService, private dialog: MatDialog, private fb: FormBuilder, public userService: UserService, private router: Router) { }

  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');

    this.currentUser = JSON.parse(currentUser)
    console.log(this.currentUser)
    if (this.currentUser == null) {
      this.currentUserName = new userName("firstName", "lastName")
    }
    else {
      this.currentUserName = new userName(this.currentUser.userName.firstName, this.currentUser.userName.lastName);
    }
    console.log(this.currentUserName)

  }

  async UpdateDetails(firstName: string, lastName: string, country: string, city: string, zipcode: string, birthday: string, phoneNumber: string, userid: string) {
    console.log("Entered UpdateDetails")
    console.log(firstName + lastName)
    this.updateForm = this.fb.group({
      address: this.fb.group({ // make a nested group
        city: [city, Validators.compose([Validators.required])],
        zipcode: [zipcode, Validators.compose([Validators.required])],
        country: [country, Validators.compose([Validators.required])]
      }),
      birthday: [birthday, Validators.compose([Validators.required])],
      userID: [userid, Validators.compose([Validators.required])],
      userName: this.fb.group({ // make a nested group
        firstName: [firstName, Validators.compose([Validators.required])],
        lastName: [lastName, Validators.compose([Validators.required])],
      }),
      phoneNumber:[phoneNumber, Validators.compose([Validators.required])],
      profile_User:["",Validators.compose([Validators.required])],
    });
    console.log(this.updateForm.value)
    this.userService.getUser(this.currentUser.email).subscribe(
      (user)=>{
    this.updateForm.patchValue({profile_User:user.profile_User});
    this.userService.updateUser(this.currentUser.email,this.updateForm.value).subscribe(
      async (user) => { 
        console.log('Success', user); 
        this.updateForm.reset(); 
        await this.userService.getUser(this.currentUser.email).subscribe(
          (user) => {
            localStorage.removeItem('user')
            localStorage.removeItem('role')
            localStorage.removeItem('userDetails')
            localStorage.setItem('role', user.role);
            localStorage.setItem('userDetails', JSON.stringify(user))
            localStorage.setItem('userId', JSON.stringify(user.id))
            console.log(localStorage.getItem('userDetails'))
          }
        )
        this.router.navigate(['/default-layout/my-account']);
      },
      (error) => { console.log('Error', error); }
    );
  }
  );
  }
  EditPicture() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "60%";
    this.dialog.open(UploaderComponent)
  }
  async onSubmit() {
    console.log("dOWNLOAD LINK: " + localStorage.getItem('downloadURL'))
    this.downloadURL = await localStorage.getItem('downloadURL')
    if (this.downloadURL != null) {
      this.updateForm = this.fb.group({
        profile_User: [this.downloadURL, Validators.compose([Validators.required])],
      });
      this.userService.updateUser(this.currentUser.email, this.updateForm.value).subscribe(
        async (user) => {
          console.log('Success', user);
          this.updateForm.reset();
          this.isEdit = false;
          localStorage.removeItem('downloadURL');
          await this.userService.getUser(this.currentUser.email).subscribe(
            async (user) => {
              await localStorage.setItem('role', user.role);
              await localStorage.setItem('userDetails', JSON.stringify(user))
              await localStorage.setItem('userId', JSON.stringify(user.id))
              console.log(localStorage.getItem('userDetails'))
            }
          );
          window.location.reload();
        }, (error) => { console.log('Error', error); });
    }
  }
  /*
START
Upload Profile Picture
*/
  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    console.log("Started on Drop")
    this.files.push(files.item(0));
    this.filename = files.item(0).name
    this.datefile = Date.now;
    //this.startUpload();
  }


  /*
    END
    Upload Profile Picture
    */
}
