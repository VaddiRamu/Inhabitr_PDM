import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuoteService } from '../../services/quote.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { messages } from '../../messages/validation_messages';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SharedService } from '../../services/shared.service';
import { CreateMoodboardService } from '../../services/create-moodboard.service';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.css']
})

export class ModalFormComponent implements OnInit {
  isFloorPlan = true;
  floorPlanClass = 'active';
  unitClass = '';
  viewFloorPlan = false;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  zipcodePattern = '^[0-9]{5}(?:-[0-9]{4})?$';
  phoneNoPattern = '^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$';
  customerInfoForm;
  selectedState = 'Fetching States...';
  selectedStateId: number;
  selectedCity = 'Fetching City...';
  selectedCityId: number;
  cities = [];
  states = [];
  isSubmitted = false;
  quoteId: number;
  editCustomer = true;
  updateinfo: boolean;
  inavalidzipcode = false;
  userNames = [];
  Names = [];
  unit: any;
  floorTypes: any;
  floorTypename: string;
  floorTypeId: number;
  floorPlanName: string;
  floorPlanUnit: string;
  floorPlans: any;
  unitWOPlans: any;
  nodatafound: boolean;
  nodatafoundUnit: boolean;
  ngselectedState: any;
  ngselectedCity: any;

  selectedstate: any;
  selectedcity: any;
  model: any;
  namevalid: any;

  companyList = [];
  projectList: any = [];
  addProject = false;
  selectedCompany: any = {};
  defaultCompanyList = [];
  addCompany = false;
  isInternalUser = false;
  messages = {
    VALIDATION_NAME: messages.VALIDATION_NAME,
    VALIDATION_ADDRESS: messages.VALIDATION_ADDRESS,
    VALIDATION_STATE: messages.VALIDATION_STATE,
    VALIDATION_CITY: messages.VALIDATION_CITY,
    VALIDATION_EMAIL: messages.VALIDATION_EMAIL,
    VALIDATION_COMPANYNAME: messages.VALIDATION_COMPANYNAME,
    VALIDATION_PROJECTNAME: messages.VALIDATION_PROJECTNAME,
    ERROR_EMAIL: messages.ERROR_EMAIL,
    VALIDATION_ZIPCODE: messages.VALIDATION_ZIPCODE,
    ERROR_ZIPCODE: messages.ERROR_ZIPCODE,
    VALIDATION_CONTACT_NUMBER: messages.VALIDATION_CONTACT_NUMBER,
    ERROR_CONTACT_NUMBER: messages.ERROR_CONTACT_NUMBER
  };

  @Output() close = new EventEmitter();
  routeData: any;
  dialogData: any;
  private _dialogRef: any;
  constructor(private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private quoteService: QuoteService,
    private ls: LocalStorageService,
    private toastr: ToastrService,
    private router: Router,
    private sharedService : SharedService,
    private cMbService : CreateMoodboardService,
    private activeRout:ActivatedRoute
  ) {

    this.getStates(true);


  }

  ngOnInit(): void {
    this.activeRout.params.subscribe((data:any) => {
      console.log(data)
      this.routeData = data;
    })
    this.isInternalUser = this.ls.getFromLocal()?.role_type == 1;
    this.updateinfo = false;
    this.customerInfoForm = this.formBuilder.group({
      name: [''],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact_no: ['', Validators.required],
      zipcode: ['', Validators.required],
      city: ['', Validators.required],
      company_id : [''],
      companyName : ['test', Validators.required],
      project_id : [''],
      project_name : ['', Validators.required]
    });

    this.getCompanyListByUserMD()
  }

  selectCompany(item){
    this.selectedCompany = item.target.value;
    if(!this.addCompany){
      let company = this.companyList.find(x=> x.sgid == item.target.value)
      this.customerInfoForm.patchValue({company_id:item.target.value, companyName:company?.company ?? ''});
      this.getProjectListMD(item.target.value);
    } else {
     // this.moodboardForm.patchValue({company_name:''})
    }
  }

  selectProject(item){
    if(!this.addProject){
      let project = this.projectList.find(x=> x.sgid == item.target.value);
      this.customerInfoForm.patchValue({project_id:item.target.value, project_name:project?.project || ''})
    } else {
      this.customerInfoForm.patchValue({project_name:''})
    }
  }

  getCompanyListByUserMD(){
    let cmp = this.ls.getFromLocal()?.company_name ?? '';;
    this.sharedService.getCompanyList('?company_type=moodboard').subscribe(list=> {
      this.companyList = list;
      let companyId = list.find(x=> x.company == cmp)?.sgid;
      this.selectedCompany = list.find(x=> x.company == cmp);
      if(companyId){
        this.customerInfoForm.patchValue({companyName: this.selectedCompany.company,company_id: companyId});
        this.getProjectListMD(companyId)
      }
    })

}

getProjectListMD(compid: any){
  this.cMbService.getProjectListMD(compid).subscribe(list=> {
    if(typeof list == 'string') this.projectList = [];
    else this.projectList = list;
         this.customerInfoForm.patchValue({project_id: this.projectList[0]?.sgid});
  });
}
  toggleAddButtonProject(){
    this.addProject = !this.addProject;
    if(this.addProject){
      // this.moodboardForm.patchValue({project_name:'',project_id:0});
    } else {
      // this.moodboardForm.patchValue({project_id:0,project_name:''})
    }
  }
  

  toggleAddButton(){
    this.addCompany = !this.addCompany;
    if(this.addCompany){
      // this.moodboardForm.patchValue({company_name:'',company_id:'1'});

    } else {
      // this.moodboardForm.patchValue({company_id:'',company_name:'test'})
    }
  }

  onChange(event) {
    console.log('change detection');
    console.log(event);
    this.selectedStateId = event.sgid;
    this.getCities();
  }

  isZipCodeValid(){
    let data = {
      city_name: this.customerInfoForm.value.city,
    state_id: this.selectedStateId,
    zipcode: this.customerInfoForm.value.zipcode}
    return this.sharedService.validateZipCode(data).toPromise()
  };

  oncityChange(event) {
    this.selectedCityId = event.sgid;
  }
  getFloorPlans() {
    this.quoteService.getFloorPlanDetails(this.quoteId).subscribe(resp => {
      console.log(resp);
      if (resp.statusCode === 200 && resp.result.length > 0) {
        console.log('came here');
        this.floorPlans = resp.result;
        this.nodatafound = false;
      } else {
        console.log('iscame');
        this.floorPlans = [];
        this.nodatafound = true;
      }
    }, error => { this.nodatafound = true; });
  }
  getUnits() {
    this.quoteService.getUnitWithoutPlan(this.quoteId).subscribe(resp => {
      console.log(resp);
      if (resp.statusCode === 200 && resp.result.length > 0) {
        this.unitWOPlans = resp.result;
        this.nodatafoundUnit = false;
      } else {
        this.unitWOPlans = [];
        this.nodatafoundUnit = true;
      }
    }, error => { this.nodatafoundUnit = true; });
  }
  getFloorTypes() {
    // this.floorTypes = [{sgid :1, name : '3 bedrooms'}, {sgid: 2, name:'1 bedroom'},{sgid:3, name:'2 bedrooms'}];
    //     this.floorTypename = this.floorTypes[0].name;
    //     this.floorTypeId = this.floorTypes[0].sgId;
    this.quoteService.getFloorTypes().subscribe(resp => {
      if (resp.statusCode === 200) {
        this.floorTypes = resp.result;
        this.floorTypename = this.floorTypes[0].name;
        this.floorTypeId = this.floorTypes[0].sgId;
      }
    }, error => { });
  }
  getStates(initialLoad = false) {
    this.quoteService.getStates().subscribe(resp => {

      if (resp.statusCode === 200) {
        console.log(resp);
        this.states = resp.states;

        //  [
        //   {sgid: 3924, name: "California"}
        // ]
        // this.selectedState = this.states[0].name;
        // this.selectedStateId = this.states[0].sgid;
        if (!initialLoad) { this.getCities(); }
        this.spinner.hide();
      }
    }, error => {

    })
  }

  getCities() {
    console.log(this.ngselectedState);
    this.quoteService.getCities(this.selectedStateId).subscribe(resp => {
      if (resp.statusCode === 200) {

        this.cities = resp.cities;
        console.log(this.cities);
        // this.selectedCityId = this.cities[0].sgid;
        // this.selectedCity = this.cities[0].city_name;
      }
    }, error => {

    })
  }

  selectState(state) {
    this.selectedState = state.name;
    this.selectedStateId = state.sgid;
    this.selectedCity = 'Fetching City...'
    this.getCities();
  }

  selectCity(city) {
    this.selectedCity = city.city_name;
    this.selectedCityId = city.sgid;
  }
  selectFloorType(floorType) {
    this.floorTypeId = floorType.sgid;
    this.floorTypename = floorType.name;
  }
  editCustomerInfo() {
    this.editCustomer = true;
    this.updateinfo = true;
    console.log(this.updateinfo);
  }

  async onSubmit() {
   
    let status = false;
    try {
      status = await  this.isZipCodeValid()
    } catch (error) {
      
    }
    if(!status){
      this.toastr.warning('Zip Code Invalid');
      return;
    }
    if(this.addCompany){
      this.customerInfoForm.value.company_id = null;
    } 
    // else {
    //   let company = this.companyList.find(x=> x.sgid == this.customerInfoForm.value.company_id);
    //   this.customerInfoForm.value.companyName = company?.company || '';
    // }
    if(this.addProject){
      this.customerInfoForm.value.project_id = null;
    }
    let userInfo = this.customerInfoForm.value;
    // userInfo.city = this.selectedCityId;
    userInfo.state = this.selectedStateId;
    userInfo.userid = this.ls.getFromLocal().userId;
    if (this.model) {
      if (this.model['value']) {
        userInfo.name = this.model['value'];
      }
      else {
        userInfo.name = this.model;
      }
    }
    if (this.model == 'undefined' || this.model == null || this.model == '') {
      this.namevalid = false;
    }
    else {
      this.namevalid = true;
    }
    console.log(userInfo);
    this.isSubmitted = true;
    if (this.customerInfoForm.invalid) {
      console.log('return');
      return false;
    }
    console.log(userInfo);

    if (userInfo.state === undefined) {
      return;
    }
    if (userInfo.city === undefined) {
      return;
    }


    console.log(this.customerInfoForm);
    this.spinner.show();

    
    this.quoteService.createCustomerInformation(userInfo).subscribe(resp => {
      if (resp.statusCode === 200) {
        if (this.routeData.id) {
          this.inavalidzipcode = false;
          this.quoteId = resp.quote.sgid;
           this.spinner.hide();
           this.toastr.success('Customer information created successfully.');
           this.quoteService.setModalDialog()
          //  this.router.navigate(['/admin/products/view', this.routeData.id]);
        }else{
          this.inavalidzipcode = false;
          this.quoteId = resp.quote.sgid;
          this.spinner.hide();
          this.toastr.success('Customer information created successfully.');
          // this.OnSubmit.emit();
          this.router.navigate(['/admin/quote/list', 'my'])
        } 
      } if (resp.statusCode === 502) {
        this.inavalidzipcode = true;
        this.toastr.error(resp.result);
        this.spinner.hide();
      } 
     
    }, error => { 
      this.toastr.error(error.result);
      this.spinner.hide();
    })

  }
  unitTab() {
    this.isFloorPlan = false;
    this.floorPlanClass = '';
    this.unitClass = 'active';

  }

  floorPlanTab() {
    this.isFloorPlan = true;
    this.floorPlanClass = 'active';
    this.unitClass = '';
  }
  backtoQuote() {
    this.viewFloorPlan = false;
  }
  gotoQuote(plan) {
    console.log(plan);
    this.viewFloorPlan = true;
  }

  addUnits() {
    console.log(this.unit);
    this.spinner.show();
    // if (this.unit === '') {
    //   this.toastr.success('Please fill the requirements');
    // }
    this.unit = this.unitWOPlans.length + 1;
    this.quoteService.addUnits(this.quoteId, this.unit).subscribe(resp => {
      if (resp.statusCode === 200) {

        this.spinner.hide();
        this.nodatafoundUnit = false;
        this.unitWOPlans.push(resp.result);
        this.toastr.success(resp.message);
      } else {
        this.spinner.hide();
        this.toastr.success('Try again Later.')
      }
    }, error => { })
  }

  removeUnits() {
    this.spinner.show();
    this.unit = this.unitWOPlans.length;
    if (this.unitWOPlans.length === 0) {
      this.nodatafoundUnit = true;
      return;
    }

  }
  getuserNames(event) {
    this.userNames = [];
    this.Names = [];
    this.quoteService.getUsers(event.target.value).subscribe(resp => {
      this.userNames = [];
      this.Names = [];
      this.Names = resp;
      let id = [];
      id = Object.keys(resp)

      for (var i = 0; i < id.length; i++) {
        var obj = { id: id[i], value: this.Names[id[i]] }
        this.userNames.push(obj);
      }
      console.log('usernames', this.userNames);
    })
  }
  onCustomerChange() {
    var value = this.model;
    console.log(typeof this.model);
    if (typeof value == 'object') {
      this.namevalid = true;
      this.quoteService.getCustomerDetailsBasedonId(value.id).subscribe(resp => {
        console.log(resp);
        this.selectedstate = '';
        this.selectedcity = '';
        this.customerInfoForm.reset();
        if (resp.state != null || resp.state != 'undefined') {
          if (resp.state_name) {
            this.getStates();
            this.selectedstate = resp.is_state_name;
            this.selectedStateId = resp.state;
            this.getCities();
            this.selectedcity = resp.is_city_name;
            this.selectedCityId = resp.city;
          }
        }
        console.log(value);
        if (value && value['value']) {
          console.log(value['value']);
          this.model = { id: value['id'], value: value['value'] };
        }

        this.customerInfoForm.patchValue({
          email: resp.email,
          contact_no: resp.contactno,
          zipcode: resp.is_zip_code,
          address: resp.address,

        });



      })
    }
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        //  term.length < 2 ? []
        // : 
        this.userNames
        // .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      ))
  formatter = (x: { value: string }) => x.value;
  formatter1 = (x: { id: string }) => x.id;
}
