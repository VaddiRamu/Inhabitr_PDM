import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CreateMoodboardService } from '../../services/create-moodboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../../services/items.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/shared.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';



@Component({
  selector: 'app-create-moodboard',
  templateUrl: './create-moodboard.component.html',
  styleUrls: ['./create-moodboard.component.css']
})
export class CreateMoodboardComponent implements OnInit {
  moodboardForm : UntypedFormGroup;
  moodbTypeName: string;
  moodbTypes: any;
  errorMsg: string;
  moodboardTypeId: string;
  whName: string;
  whId: string;
  warehouse: any;
  selectedState = '';
  stateList = [];
  companyList = [];
  projectList: any = [];
  addProject = false;
  selectedCompany: any = {};
  defaultCompanyList = [];
  addCompany = false;
  routeData:any;
  @Output() close = new EventEmitter();
 
  constructor(
    private auth: AuthenticateService,
    private formBuilder: UntypedFormBuilder,
    private shop: ItemsService,
    private router: Router,
    private cMbService: CreateMoodboardService,
    private spinner: NgxSpinnerService,
    private sharedService : SharedService,
    private toasterService: ToastrService,
    private ls: LocalStorageService,
    private activeRout:ActivatedRoute
  ) { 
    
  }
  ngOnInit(): void {
    this.activeRout.params.subscribe((data:any) => {
      console.log(data)
      this.routeData = data;
    })
    this.moodboardForm = this.formBuilder.group({
      moodboard_name: ['', Validators.required],
      city:['', Validators.required],
      state :['', Validators.required],
      zipcode : ['',],
      option_reference: '',
      company_id : ['', Validators.required],
      company_name : ['test', Validators.required],
      // newCompanyName : ['test', Validators.required],
      project_id : ['', Validators.required],
      project_name : ['', Validators.required],
      mb_type_detail : ['']
    });
    this.getMoodboardType();
    this.getWarehouse();
    this.getCompanyListByUserMD()
    this.getStateList()
    this.moodbTypeName = 'one';
  }

  // userid,unit,customer_reference,option_reference
 async onSubmit() {
  if(this.moodboardForm.value.zipcode){
    let status = false;
    try {
     status  = await this.isZipCodeValid();
    } catch (error) {
      
    }
   if(!status){
     this.toasterService.warning('ZipCode Invalid');
     return;
   }
  }
    this.moodboardForm.value.userid = this.auth.getProfileInfo('userId');
    this.moodboardForm.value.moodboard_type = this.moodboardTypeId.toString(),
    this.moodboardForm.value.state = this.moodboardForm?.value?.state?.sgid;
    this.moodboardForm.value.project_id = 0;
    this.moodboardForm.value.mb_type_detail = this.moodboardForm.value.mb_type_detail;
      if(this.addCompany){
        this.moodboardForm.value.company_id = null;
      } else {
        let company = this.companyList.find(x=> x.sgid == this.moodboardForm.value.company_id);
        this.moodboardForm.value.company_name = company?.company || '';
      }
      console.log(this.moodboardForm.value)
      if( !this.moodboardForm.valid){
        this.toasterService.warning('All fileds are mondotry');
      }else{
        this.spinner.show();
        this.cMbService.createMoodboard(this.moodboardForm.value).subscribe(data => {
          if (data) {
    
            this.toasterService.show(data.message)
            this.moodboardForm.reset();
            this.spinner.hide();
            this.close.emit()
            if(this.routeData.id){
            this.router.navigate(['/admin/products/view', this.routeData.id]);
            }else{
              this.router.navigate(['/admin/moodboard/view', data.moodboard_id]);
            }
          }
    
        }, error => () => {
          this.errorMsg = error;
          this.spinner.hide();
    
        });
      }
     


  }

  async isZipCodeValid(){
    let data = {
      city_name: this.moodboardForm.value.city,
    state_id: this.moodboardForm.value.state.sgid,
    zipcode: this.moodboardForm.value.zipcode}
     return this.sharedService.validateZipCode(data).toPromise()
    }

  onChangeState(item){
    this.getCityList(item.sgid)
  }

  getStateList(){
    this.sharedService.getStates().subscribe(list=>{
      this.stateList =  list;
    },()=>{
      this.stateList=[]
    })
  }

  getCityList(state_id){
    
  }
  getCompanyListByUserMD(){
      let user_id =  this.auth.getProfileInfo('userId');

      let cmp = this.ls.getFromLocal()?.company_name ?? '';;
      this.sharedService.getCompanyList('?company_type=moodboard').subscribe(list=> {
        this.companyList = list;
        let companyId = list.find(x=> x.company == cmp)?.sgid;
        this.selectedCompany = list.find(x=> x.company == cmp);
        if(companyId){
          this.moodboardForm.patchValue({company_name: this.selectedCompany.company});
          this.getProjectListMD(companyId)
        }
      })

  }
  // selectCompany(item){
  //   this.selectedCompany = item
  //   if(!this.addCompany){
  //     this.moodboardForm.patchValue({company_name:'test'})
  //   } else {
  //     this.moodboardForm.patchValue({company_name:''})
  //   }
  // }
  selectCompany(item){
    this.selectedCompany = item.target.value;
    if(!this.addCompany){
   //   this.moodboardForm.patchValue({company_id:item.sgid});
      this.moodboardForm.patchValue({company_name:item.target.value});
      this.getProjectListMD(item.target.value);
    } else {
     // this.moodboardForm.patchValue({company_name:''})
    }
  }
  getProjectListMD(compid: any){
    this.cMbService.getProjectListMD(compid).subscribe(list=> {
      if(typeof list == 'string') this.projectList = [];
      else this.projectList = list;
//          this.moodboardForm.patchValue({company_name: this.companyList[0]});
    });
}
  selectProject(item){
    console.log(item);
//    this.selectedCompany = item;
    if(!this.addProject){
      let project = this.projectList.find(x=> x.sgid == item.target.value);
      this.moodboardForm.patchValue({project_id:item.target.value, project_name:project?.project || ''})
    } else {
      this.moodboardForm.patchValue({project_name:''})
    }
  }
  toggleAddButtonProject(){
    this.addProject = !this.addProject;
    if(this.addProject){
      this.moodboardForm.patchValue({project_name:'',project_id:0});
    } else {
      this.moodboardForm.patchValue({project_id:0,project_name:''})
    }
  }
  

  toggleAddButton(){
    this.addCompany = !this.addCompany;
    if(this.addCompany){
      this.moodboardForm.patchValue({company_name:'',company_id:'1'});

    } else {
      this.moodboardForm.patchValue({company_id:'',company_name:'test'})
    }
  }
  selectMoodbType(moodboardType) {
    console.log(moodboardType)
    this.moodbTypeName = moodboardType.typename;
    this.moodboardTypeId = moodboardType.type_id;
  }
  selectWarehouse(wh) {
    this.whName = wh.warehouse_name;
    this.whId = wh.sgid;
  }
  moodbTypess:any
  getMoodboardType() {
    this.cMbService.MoodboardTypeList().subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.moodbTypes = resp.result;
        this.moodbTypeName = this.moodbTypes[0].typename;
        this.moodboardTypeId = this.moodbTypes[0].type_id;

      }
    });


    this.moodbTypess = [{
      imageSrc: 'assets/img/Categories-01.png',
      value: 'Living Room',
      type_id: 1
    },
    {
      imageSrc: 'assets/img/Categories-02.png',
      value: 'Bedroom',
      type_id: 2
    },
    {
      imageSrc: 'assets/img/Categories-03.png',
      value: 'Office',
      type_id: 3
    },
  
    {
      imageSrc: 'assets/img/Categories-04.png',
      value: 'Dining Room',
      type_id: 4
    },
    {
      imageSrc: 'assets/img/Categories-05.png',
      value: 'Outdoor',
      type_id: 5
    },
    {
      imageSrc: 'assets/img/Categories-06.png',
      value: 'Others',
      type_id: 6
    }
    ]


    // this.cMbService.MoodboardTypeList().subscribe(resp => {
    //   console.log(resp);
    //   if (resp) {
    //     this.moodbTypes = resp.result;
    //     this.moodbTypeName = this.moodbTypes[0].typename;
    //     this.moodboardTypeId = this.moodbTypes[0].type_id;

    //   }
    // }, error => this.errorMsg = error);
  }

  getWarehouse() {
    this.shop.getWarehouse().subscribe(
      resp => {
        this.warehouse = resp.data;
        console.log(this.warehouse[0]);
        this.whName = this.warehouse[0].warehouse_name;
        this.whId = this.warehouse[0].sgid;
      }, err => {
      }
    );
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  backMethod(){
    this.router.navigate(['/admin/moodboard/list/all'])
  }
 
}
