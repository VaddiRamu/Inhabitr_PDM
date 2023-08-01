import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../signup/confirm-password.validator';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  isSubmitted = false;
  clicked = false;
  resetPwdForm: any;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  currentPage: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private auth: AuthenticateService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.currentPage = this.route.url.split("/")[3]
    this.resetPwdForm = this.formBuilder.group({
      email: [this.currentPage, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],

    },
      { validator: ConfirmPasswordValidator.MatchPassword });

      console.log(this.currentPage)
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.resetPwdForm.invalid) {

      return false;
    }
    console.log(this.resetPwdForm.value);
    this.spinner.show();


     //  remove
    this.spinner.hide();
    this.clicked = true;
    this.toastr.success('Password reset successfully');
    this.route.navigate(['login']);
    this.auth.setPassword(this.resetPwdForm.value).subscribe(resp=>{
      console.log(resp)
      if(resp.statusCode === 200){
      }

    },
      error=>{this.clicked = false});

  }

}
