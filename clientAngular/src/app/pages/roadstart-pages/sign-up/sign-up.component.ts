import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'page-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class PageSignUpComponent implements OnInit {
  pageTitle: string = 'רישום';

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  onSubmit() {
    this.router.navigate(['/default-layout/dashboard']);
  }

}
