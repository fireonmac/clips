import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials = {
    email: '', 
    password: '',
  };

  showAlert = false;
  alertMsg = 'Please wait! You will be logged in a few seconds.';
  alertColor = 'blue';

  inSubmission = false;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! You will be logged in a few seconds.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.login(this.credentials.email, this.credentials.password);
    } catch (e) {
      console.error(e);
      this.alertMsg = 'An unexpected error occured. Please try again later.';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMsg = 'Success! You are now logged in.';
    this.alertColor = 'green';
  }
}
