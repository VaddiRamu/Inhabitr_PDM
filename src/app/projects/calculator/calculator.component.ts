import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { customValidation } from '../custom-validation';
import { ProjectService } from "../../services/project.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  assetFormCalulation: UntypedFormGroup;
  rentFormCalulation: UntypedFormGroup;
  show: any;
  constructor(private formBuilder: UntypedFormBuilder,
    private projectService: ProjectService,private spinner: NgxSpinnerService,) {
    this.assetFormCalulation = this.formBuilder.group({
      rent_mo_value: ['', Validators.required],
      lease_length: ['',[Validators.required,customValidation.assetLeaseLengthValidation]],
      asset_value: ['']
    });
    this.rentFormCalulation = this.formBuilder.group({
      asset_value: ['', Validators.required],
      lease_length: ['',[Validators.required,customValidation.rentLeaseLengthValidation]],
      rent_mo_value: ['']
    })
   }

  ngOnInit(): void {
  }
  getAssetCalulation(){
    let form = this.assetFormCalulation.value;
    let obj = {
      type:"asset_value",
      budget:form.rent_mo_value,
      lease_length:form.lease_length
    }
    
    if(this.assetFormCalulation.valid){
      this.spinner.show();
      this.projectService.getRentAssetValues(obj).subscribe((res:any)=>{
        if(res.statusCode===200){
          this.spinner.hide();
          console.log(res)
          this.assetFormCalulation.patchValue({
            asset_value:res.result?.output_budget
          })
        }
      })
    }
    
  }
  getRentCalulation(){
    let form = this.rentFormCalulation.value;
    let obj = {
      type:"rent_value",
      budget:form.asset_value,
      lease_length:form.lease_length
    }
    if(this.rentFormCalulation.valid){
      this.spinner.show();
      this.projectService.getRentAssetValues(obj).subscribe((res:any)=>{
        if(res.statusCode===200){
          this.spinner.hide();
          this.rentFormCalulation.patchValue({
            rent_mo_value:res.result?.output_budget
          })
        }
      })
    } 
  }
  calculator(){
    this.show = !this.show;
   
  }
}
