import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  age = new FormControl('', [
    Validators.min(18),
    Validators.max(120),
  ]); 
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);
  confirmPassword = new FormControl('', [
    Validators.required
  ]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13),
  ]);
  
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age, 
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  });

  showAlert = false;
  alertMsg = 'Please wait! Your account is being created.';
  alertColor = 'blue';

  inSubmission = false;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.createUser(this.registerForm.value);
    } catch (e) {
      console.error(e);
      this.alertMsg = 'An unexpected error occured. Please try again later.';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMsg = 'Success! Your account has been created.';
    this.alertColor = 'green';
  }
}
