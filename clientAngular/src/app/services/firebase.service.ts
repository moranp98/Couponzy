import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { UserService } from './user.service'
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  isLoggedIn = false
  constructor(public firebaseAuth: AngularFireAuth, public userService: UserService) { }
  async signin(email: string, password: string) {
    await this.userService.getUser(email).subscribe(
      async (user) => {
        await localStorage.setItem('role', user.role);
        await localStorage.setItem('active', String(user.active));
        await localStorage.setItem('userDetails', JSON.stringify(user))
        await localStorage.setItem('userId', JSON.stringify(user.id))
        console.log(localStorage.getItem('userDetails'))
      }
    )
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(async res => {
        this.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    await console.log(this.userService.getUser(email))
    await console.log("the Current Rule is : " + await localStorage.getItem('role'));

    if (localStorage.getItem('role') !== 'customer' && localStorage.getItem('active') === 'true') {
      this.isLoggedIn = true
    } else {
      this.isLoggedIn = false
    }
  }
  async signup(email: string, password: string) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.isLoggedIn = true
        localStorage.setItem('user', JSON.stringify(res.user))
        this.userService.getUser(email).subscribe(
          (user) => {
            localStorage.setItem('role', JSON.stringify(user.role))
            localStorage.setItem('userDetails', JSON.stringify(user))
            console.log(localStorage.getItem('userDetails'))
          }
        )
      })
  }
  logout() {
    this.firebaseAuth.signOut()
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    localStorage.removeItem('userDetails')
  }
}