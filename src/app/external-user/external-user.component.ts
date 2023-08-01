import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPasswordValidator } from '../public-pages/signup/confirm-password.validator';
import { AuthenticateService } from '../services/authenticate.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';

@Component({
  selector: 'app-external-user',
  templateUrl: './external-user.component.html',
  styleUrls: ['./external-user.component.css']
})
export class ExternalUserComponent implements OnInit {
  tableData = [];
  isSubmitted = false;
  clicked = false;
  resetPwdForm: any;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  currentPage: any;
  userId:any;
  constructor(private formBuilder: UntypedFormBuilder,
    private auth: AuthenticateService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private ls: LocalStorageService,
    private toastr: ToastrService,
    private activerout:ActivatedRoute) { }

  ngOnInit(): void {
    this.getExtUser()
    this.resetPwdForm = this.formBuilder.group({
      email: [this.userId, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],

    },
      { validator: ConfirmPasswordValidator.MatchPassword });

  }

  getExtUser(){
    this.auth.getExternalUser().subscribe((res:any)=>{
      this.tableData = res.data;
    })
  }
  openPopUp(data){
    // document.getElementById("myModal")
    this.userId = data.user_id
    this.resetPwdForm.patchValue({
      email: this.userId
    });
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.resetPwdForm.invalid) {

      return false;
    }
    this.spinner.show();


     //  remove
    this.spinner.hide();
    this.clicked = true;
    this.toastr.success('Password reset successfully');
    this.route.navigate(['externalUser']);
    this.auth.setPassword(this.resetPwdForm.value).subscribe(resp=>{
      if(resp.statusCode === 200){
        
      }

    },
      error=>{this.clicked = false});

  }
 
}
