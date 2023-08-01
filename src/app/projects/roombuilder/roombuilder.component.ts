import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/services/project.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DialogboxComponent } from "../dialogbox/dialogbox.component";
@Component({
  selector: "app-roombuilder",
  templateUrl: "./roombuilder.component.html",
  styleUrls: ["./roombuilder.component.css"],
})
export class RoombuilderComponent implements OnInit {
  roomList = [
    { sgid: "4", name: "Living Room" },
    { sgid: "2", name: "Bedroom" },
    { sgid: "13", name: "Dinning" },
    { sgid: "20", name: "Home Office" },
  ];
  roomAttrId: any;
  isLoading: any;
  isMoreProducts: boolean = true;
  page = {
    pagenumber: 1,
    pagesize: 8,
  };
  parameters: any;
  roomBuilderList: any = [];
  moodboardCount: any[];
  unitsInfo: { project: any };
  bgtAttrId: any;
  unit_group_id: void;
  project_id: any;
  groupInfo: { project: any; unit_group: any; };
  moodboard_id: any;
  priceType: any;
  priceRange: any;
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router:Router,
  ) {
    this.route.queryParams.subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.roomAttrId = res.id_category;
        this.bgtAttrId ='0-50';
        this.priceType = res.price_type
        this.unit_group_id = res.unit_group_id;
        this.project_id = res?.project_id;
        this.getAutoPackages();
        this.getPriceRange()
      }
      if (res?.project_id) {
        this.getUnits(res?.project_id);
      }
    });
  }

  ngOnInit(): void {
  }
  onChange(event: any, type: any) {
    if (type == "room") {
      this.roomAttrId = event;
    }
    if (type == "budget") {
      this.bgtAttrId = event;
    }

    this.page.pagenumber = 1;
    this.roomBuilderList = [];
    this.getAutoPackages();
  }
  checkCheckBoxvalue(event){
    if (event.target.checked == true) {
      this.priceType = 'rent_price'; 
    }
    else{
      this.priceType ='asset_price'; 
    }
    this.bgtAttrId = ''
    this.getAutoPackages();
    this.getPriceRange()
  }
  getPriceRange(){
    this.projectService.getPriceRange({price_type:this.priceType}).subscribe((res:any)=>{
      if(res?.statusCode==200){
        this.priceRange = res?.result
      }
    })
  }
  getAutoPackages() {
    let params = {
      pagenumber: this.page.pagenumber,
      pagesize: this.page.pagesize,
      id_category: this.roomAttrId,
      price:this.bgtAttrId,
      price_type:this.priceType
    };
    this.isLoading = true;
    this.spinner.show();
    this.projectService.getAutoPackages(params).subscribe((res: any) => {
      console.log(res);
      if (res.result) {
        this.spinner.hide();
        this.isLoading = false;
        this.page.pagenumber += 1;
        this.roomBuilderList = [...this.roomBuilderList, ...res.result];
        this.isMoreProducts = res.result && res.result.length ? true : false;
      }
    });
  }
  @HostListener("window:scroll", ["$event"])
  getScrollHeight(event: any) {
    let remaining =
      document.documentElement.scrollHeight -
      (window.innerHeight + window.pageYOffset);
    console.log(remaining);
    if (Math.round(remaining) < 49 && !this.isLoading && this.isMoreProducts) {
      this.onScroll();
    }
  }
  onScroll() {
    this.getAutoPackages();
  }
  addToGroup(id:any){
    let obj = {
      project_id: this.project_id,
      unit_group_id: this.unit_group_id,
      auto_package_id:id
    }
    this.spinner.show()
    this.projectService.createAutopackageMb(obj).subscribe((res:any)=>{
      if(res?.statusCode==200){
        this.spinner.hide();
        this.router.navigate(['/admin/projects/create'],{ queryParams: { id:this.project_id,step:'4' }});
      }
    })
  }
  viewDetails(id:any,name:string) {
   console.log(id)
   let params = {
    id_package:id
   }
   this.projectService.getAutoPackageItems(params).subscribe((res:any)=>{
    if(res.items){
      this.viewDetailsPopup(res.items,name,id)
    }
   })
  }
  viewDetailsPopup(result,name,id){
    const modalRef = this.modalService.open(DialogboxComponent, {
      backdrop: "static",
      centered: true,
      windowClass: 'moodboardClass'
    });
    let data = {
      content: name,
      dialogType: "viewDetailsPopup",
      res:result,
      id_package:id
    };
    modalRef.componentInstance.viewDetailsData = data;
    modalRef.componentInstance.exitMbPopup.subscribe((res) => {
      console.log(res)
      if(res.type=="group"){
        this.addToGroup(res?.data);
        modalRef.componentInstance.activeModal.close();
      }
      if(res.type=="moodboard"){
        modalRef.componentInstance.activeModal.close();
        this.moodboard_id = res.data;
        this.mdresult();
      }
    });
  }
  exitMbPopup() {
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let data = {
      content: "",
      dialogType: "existMbDetailsPopup",
      res:this.groupInfo.unit_group?.moodboards,
      id:this.moodboard_id
    };
    modalRef.componentInstance.exitMbData = data;
    modalRef.componentInstance.addMb.subscribe((res:any)=>{
      console.log(res)
      modalRef.componentInstance.activeModal.close();
      let obj={
        button_type:0,
        category_id:this.moodboard_id?.category_id,
        project_id:this.project_id,
        unit_group_id:res?.unit_group_id,
        moodboard_id:res?.sgid,
        auto_package_item_id:this.moodboard_id?.sgid,
        sku_variation_id:this.moodboard_id?.sku_variation_id
      }
      this.addedMb(obj)
    })
  }
  mdresult() {
    this.spinner.show();
    this.projectService.getGroupWiseMoodboardList({ project_id: this.project_id,group_id: this.unit_group_id}).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.spinner.hide();
        console.log(res)
        this.groupInfo = {
          project: res.project,
          unit_group:res.unit_groups[0],
        }
        this.exitMbPopup();
      }
    })
  }
  getUnits(project_id) {
    this.spinner.show();
    this.projectService
      .getProjectGroupUnits({ project_id: project_id })
      .subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.spinner.hide();
            this.unitsInfo = {
              project: res.project,
            };
          }
        },
        (error) => {}
      );
  }
  addedMb(obj){
    this.spinner.show()
    this.projectService.getAutopackageMb(obj).subscribe((res:any)=>{
      if(res?.statusCode==200){
        this.spinner.hide();
        this.router.navigate(['/admin/projects/create'],{ queryParams: { id:this.project_id,step:'4' }});
      }
    })
  }
}
