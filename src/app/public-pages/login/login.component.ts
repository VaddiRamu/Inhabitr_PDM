import { Component, OnInit} from '@angular/core';

import { AuthenticateService } from 'src/app/services/authenticate.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  loginData: any = {};
  fbLoginData: any = {};
  rememberMe: any = false;
  forgotPassword: any = false;
  forgotEmail: any = {};
  userinfo: any = {};
  error: string;
  success: string;

  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthenticateService, private route: Router, private spinner: NgxSpinnerService, private ls: LocalStorageService) {}

  ngOnInit() {
    if (this.ls.getItem('id')) {
      this.route.navigate(['/admin/dashboard']);
    }
    if  (this.ls.get_session_rememberMe()) {
      this.rememberMe = true;
      this.loginData = JSON.parse(this.ls.get_session_rememberMe());
    }
  }
  remember(e) {
    this.rememberMe = e.target.checked;
  }
  showForgotPassword() {
    this.forgotPassword = !this.forgotPassword;
  }
  doLogin() {
    this.spinner.show();
    if (this.rememberMe) {
      this.ls.set_session_rememberMe(JSON.stringify(this.loginData));
    } else {
      this.ls.clear_session_rememberMe();
    }
    this.authService.doLogin(this.loginData).subscribe(
      resp => {
        this.spinner.hide();
        if (resp.access_token !== undefined) {
          this.spinner.hide();
          this.ls.setToLocal(resp);
          this.route.navigate(['/admin/dashboard']);
        } else {
          this.error = 'Invalid Credentials';
          if(resp.status === 'error'){
            this.error = resp.data;
          }
        }
        console.log(resp);
      },
      err => {
        this.spinner.hide();
        this.error = err.message;
      });
  }
}
