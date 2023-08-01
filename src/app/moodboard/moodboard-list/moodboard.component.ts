import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../../services/items.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateMoodboardService } from '../../services/create-moodboard.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-root',
  templateUrl: './moodboard.component.html',
  styleUrls: ['./moodboard.component.css']
})

export class MoodboardComponent implements OnInit {
  count:number= 12;
  start:number= 0;
  param: { start: 0; count: 12; };
  isLoading: boolean;
  isMoreProdcuts:boolean = true;
  constructor(private auth: AuthenticateService,
    private spinner: NgxSpinnerService,
    private shop: ItemsService,
    private route: Router,
    private actRoute: ActivatedRoute,
    private mbservice: CreateMoodboardService,
    private toastr: ToastrService,
    private ls: LocalStorageService,
    private sharedService: SharedService
  ) { }
  showMenu = false;
  showStudio = false;
  showBoards = true;
  listQuote = false;
  hideOnPrint = false;
  moodboardData: any=[];
  data = [];
  UserId: any;

  selected: any;
  selectedNav: any;
  mytype: any = 'all';

  selectedCompany = "";
  companyPlaceholder = "Select Company";
  companyList = []
  selectedProject = "";
  projectPlaceholder = 'Select Project';
  projectList = [];

  ngOnInit() {
    let Userdetails = this.ls.getFromLocal();
    this.UserId = Userdetails.userId;
    this.auth.currentMessage.subscribe(message => this.showMenu = message);
    this.actRoute.paramMap.subscribe((params) => {
      this.selectedNav = params.get('type');
      // this.getProjectList();
      this.getCompanyList('');
      this.initMoodboards();
    });
  }

  onChange(item) {

  }
  advanceSearchCompany(value) {
    this.getCompanyList(value)
  }


  onProjectChange(evt) {
    this.start=0;
    this.moodboardData.splice(0)
    this.initMoodboards();
  }

  onCompanyChnage(value) {
    if (value === this.companyPlaceholder) {
      value = "";
    } 
    this.selectedCompany = value;
    this.selectedProject= ""
    this.projectList = [];
    if(value){
      this.getProjectList()
    } else {
      this.getCompanyList('');
      this.initMoodboards()
    }
  }



  /**
   * Get Compony List 
   */
  getCompanyList(value) {
    this.spinner.show();
    this.start=0;
    this.moodboardData.splice(0)
    this.sharedService.getCompanyList('?type=moodboard').subscribe(list => {
      this.spinner.hide();
      this.start=0;
      this.moodboardData.splice(0)
      this.companyList = list;
    }, () => {
      this.spinner.hide();
      this.companyList = [];
    })
  }

  getProjectList() {
    this.spinner.show();
    this.start=0;
    this.moodboardData.splice(0)
    this.sharedService.getProjectList('?company_type=moodboard&company_name=' + this.selectedCompany).subscribe(list => {
      this.spinner.hide()
      this.projectList = list;
      this.start=0;
      // this.initMoodboards();
    }, () => {
      this.spinner.hide();
      this.projectList = [];
      // this.initMoodboards()
    })
  }


  initMoodboards() {
    if (this.selectedNav === 'all') {
      this.getMoodboards();
    } else if (this.selectedNav === 'my') {
      this.getMyMoodboards();
    }
    else if (this.selectedNav === 'dis') {
      this.getDeletedMoodboards();
    }
  }
  getBoards(type) {
    this.mytype = type;
    this.route.navigate(['/admin/moodboard/list', type]);
    this.start=0;
    this.moodboardData.splice(0)
  }
  createMooodBoard() {
    this.route.navigate(['/admin/moodboard/create']);
  }
  onScroll(){
    this.initMoodboards();
  }
  @HostListener('window:scroll', ['$event'])
  getScrollHeight(event: any) {
    let remaining = document.documentElement.scrollHeight  - (window.innerHeight + window.pageYOffset);
    if (Math.round(remaining) < 800 && !this.isLoading && this.isMoreProdcuts) {
     this.onScroll();
    }
  }
  getMoodboards() {
    this.spinner.show();
    this.isLoading = true;
    this.mbservice.getMoodboards(this.selectedCompany, this.selectedProject, this.start,this.count).subscribe((resp) => {
      this.spinner.hide();
    this.isLoading = false;
    this.start +=12
      if( resp.result && resp.result.length)
      this.moodboardData = [...this.moodboardData,...resp.result];
      this.isMoreProdcuts =  resp.result && resp.result.length ? true : false;

    },error=>{
    this.isLoading = false;
      this.spinner.hide();
    });
  }
  getMyMoodboards() {
    this.spinner.show();
    this.isLoading = true;
    this.mbservice.getMyMoodboards(this.selectedCompany, this.selectedProject,this.start,this.count).subscribe((resp) => {
      this.spinner.hide();
      this.isLoading = false;
      this.start +=12
        if( resp.result && resp.result.length)
        this.moodboardData = [...this.moodboardData,...resp.result];
        this.isMoreProdcuts =  resp.result && resp.result.length ? true : false;
    },error=>{
      this.isLoading = false;
        this.spinner.hide();
      });
  }
  getDeletedMoodboards() {
    this.spinner.show();
    this.isLoading = true;
    this.mbservice.getDeletedModdboard(this.UserId, this.selectedCompany, this.selectedProject,this.start,this.count).subscribe((resp) => {
      this.spinner.hide();
      this.isLoading = false;
      this.start +=12
      if( resp.result && resp.result.length)
      this.moodboardData = [...this.moodboardData,...resp.result];
      this.isMoreProdcuts =  resp.result && resp.result.length ? true : false;
    },error=>{
      this.isLoading = false;
        this.spinner.hide();
      });
  }
  ActiveMoodboard(moodboardid, userid) {
    this.mbservice.ActivateModdboard(moodboardid, userid).subscribe((resp) => {

      this.getDeletedMoodboards();
      this.toastr.success("Moodboard Enabled Successfully");
      this.spinner.hide();
    });

  }
  DeleteModdboard(moodboardid, userid) {
    this.mbservice.DeleteModdboard(moodboardid, userid).subscribe((resp) => {
      if (this.selectedNav == 'all') {
        this.getMoodboards();
      }
      else if (this.selectedNav == 'my') {
        this.getMyMoodboards();
      }
      this.toastr.success("Moodboard Disabled Successfully");
      this.spinner.hide();
    });
  }
  details(id) {
    this.route.navigate(['/admin/moodboard/view', id]);
  }


}

