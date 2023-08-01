import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { ProjectService } from "../../services/project.service";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  activeIndex: any='allProjects';
  projectTable: any;
  user_id: any;
  companyList: any;
  companyId: any ="";
  selectedCompanyId: any = '';
  
  constructor(private route:Router, 
    private projectService: ProjectService, private authService: AuthenticateService,
    private toasterService: ToastrService,private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.user_id = this.authService.getProfileInfo("userId");
    this.getProjectList();
    this.getCompanyList()
  }
  createProject(){
    this.route.navigate(['/admin/projects/create']);
  }
  projectDetails(data){
    if(data?.sgid){
      // this.route.navigate(['/admin/projects/create/',data?.sgid]);
      this.route.navigate(['/admin/projects/create'],{ queryParams: { id: data?.sgid,step:'2' }});
    }
  }
  getQuote(data:any){
    if (data?.sgid && data?.quote_id){
      this.route.navigate([`/admin/quote/view/${data?.quote_id}`]);
    }
  }
  projectList(data){
    this.activeIndex = data;
    this.getProjectList()
  }
  getProjectList(){
    let obj={};
    if(this.activeIndex=='allProjects'){
      obj = {
        company_id:this.selectedCompanyId
      }
    }
    if(this.activeIndex=='myProjectList'){
      obj = {
        user_id:this.user_id,
        company_id:this.selectedCompanyId
      }
    }
    this.projectService.getProjectList(obj).subscribe((res:any)=>{
      this.spinner.show();
      if(res.statusCode==200){
        this.projectTable = res.result;
        this.spinner.hide();
      }
    })
  }
 getCompanyList(){
   this.projectService.getProjectCompanyList().subscribe(data =>{
    console.log(data);
    this.companyList = data.result
  })
 }
 onChange(event){
  this.selectedCompanyId = event
  this.getProjectList();
  if(this.selectedCompanyId === "Select Company"){
    this.getProjectList();
  }
 console.log(event);
 
 }
}
