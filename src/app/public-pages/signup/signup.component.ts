import { SignupService } from '.././../services/signup.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from './confirm-password.validator';

import { AuthenticateService } from 'src/app/services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  errorMsg: string;
  userInfoObj: any = {};
  signUpForm:UntypedFormGroup;
  isSubmitted = false;
  emailPattern = '^[a-zA-Z]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$';
  btndisabled = false;
  roleTypes = [];
  roles = [];
  roleEntityNames =[];
  shouldLocationInputDisplayed: boolean = false;
   constructor(
    private formBuilder: UntypedFormBuilder,
    private auth: AuthenticateService,
    private route: Router,
    private spinner : NgxSpinnerService,
    private ls: LocalStorageService,
    private toastr: ToastrService,
    private signupService: SignupService
   
    
  ) {

  }

  ngOnInit() {
    this.gteRoleTypes();

    if (localStorage.getItem('isAuthenticated') === 'true') {
      this.route.navigate(['/admin/products/list']);
    }
  
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      role_type: ['',Validators.required],
      role: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      supplier_id: [''],
      location:['']
    },
      { validator: ConfirmPasswordValidator.MatchPassword });

      this.signUpForm.get("role_type").valueChanges.subscribe(value=>{
        this.signUpForm.get("role").setValue([]);
        this.shouldLocationInputDisplayed = false;
      });
      
 }
gteRoleTypes() {
  this.signupService.getRoleTypes().subscribe(resp => {
    if(resp.statusCode === 200){
      console.log(resp);
      this.roleTypes = resp.result;
      this.roles = [];
    }else{
      this.roleTypes = [];
      this.roles = [];
    }
   
  },error =>{})
}
  onSubmit() {
 this.isSubmitted = true;
    if(this.signUpForm.invalid){
      
      return false;
    }
    this.spinner.show();
    let supid=this.signUpForm.value.supplier_id;
    let obj ;
    if(supid==null ||supid=='')
    {
      
       obj = {
        first_name : this.signUpForm.value.firstName,
        last_name:this.signUpForm.value.lastName,
        // country:this.signUpForm.value.country,
        // zipcode:this.signUpForm.value.zipcode,
        // mobile: this.signUpForm.value.phonenumber,
        role_type:this.signUpForm.value.role_type,
        role:this.signUpForm.value.role,  
       email:this.signUpForm.value.email.toLowerCase(),
        password:this.signUpForm.value.password
      }
      
    }
    else{
      obj = {
        first_name : this.signUpForm.value.firstName,
        last_name:this.signUpForm.value.lastName,
        // country:this.signUpForm.value.country,
        // zipcode:this.signUpForm.value.zipcode,
        // mobile: this.signUpForm.value.phonenumber,
        role_type:this.signUpForm.value.role_type,
        role:this.signUpForm.value.role,
        
        supplier_id:this.signUpForm.value.supplier_id,
        email:this.signUpForm.value.email.toLowerCase(),
        password:this.signUpForm.value.password
      }
    }
    console.log(this.signUpForm.value);
    this.auth.doSignup(obj).subscribe(
      resp => {

        this.spinner.hide();
        if(resp.statusCode === 400){
        this.toastr.error(resp.message);
        }else{
          if (resp.access_token !== undefined) {
            this.spinner.hide();
            this.ls.setToLocal(resp);
            this.route.navigate(['/admin/dashboard']);
          } else {
            this.errorMsg = 'Invalid Credentials';
          }
          console.log(resp);
        }
       
      },
      err => {
        this.spinner.hide();
        this.errorMsg = err.message;
      });


    console.warn('Your order has been submitted', this.signUpForm.value.firstName);
  }

getRoles(id) {
  this.signupService.getRoles(id).subscribe(resp => {
    if(resp.statusCode === 200){
      console.log(resp);
      this.roles = resp.result;
      
    }else{
      this.roles = [];
    }
   
  },error =>{})
}

getroletype(event)
{
  this.getRoles(this.signUpForm.get('role_type').value);
  console.log('roletype',event.target.options[event.target.options.selectedIndex].text);
  const type=event.target.options[event.target.options.selectedIndex].text
  if(type=='External')
  {
this.signUpForm.get('location').setValidators([Validators.required]);
this.signUpForm.get('location').updateValueAndValidity();
this.signUpForm.get('supplier_id').setValidators([Validators.required]);
this.signUpForm.get('supplier_id').updateValueAndValidity();
  }
  else{
    this.signUpForm.get('location').clearValidators();
    this.signUpForm.get('location').updateValueAndValidity();
    this.signUpForm.get('supplier_id').clearValidators();
    this.signUpForm.get('supplier_id').updateValueAndValidity();
  }
}

getEntityNames(roleId) {
  if(roleId === 6||roleId === 7||roleId === 8||roleId === 9){

    this.shouldLocationInputDisplayed = true;
    console.log("shouldLocationInputDisplayed value is ",this.shouldLocationInputDisplayed);
  }
  if(roleId === 6 ){
    this.signupService.getEntityName(roleId).subscribe(resp => {
      if(resp.statusCode === 200){
        console.log(resp);
        this.roleEntityNames = resp.result;
        
      }else{
        this.roleEntityNames = [];
      }
     
    },error =>{})
  }
  
}
  navigateToShop() {
    this.route.navigate(['/admin/products/list']);
  }

  notAllowmultiplespaces(event,type)
  {
    console.log('event',event);
    var value=event.target.value;
    if (event.charCode === 32 && !event.target.value.length) 
    event.preventDefault();
   if(type=='firstName')
   {
this.signUpForm.patchValue({
  firstName:value.replace(/  +/g, ' ')
})
   }
   if(type=='lastName')
   {
this.signUpForm.patchValue({
  lastName:value.replace(/  +/g, ' ')
})
   }
  
  }

}







