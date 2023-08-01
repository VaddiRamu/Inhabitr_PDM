import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
  NgbModalRef,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import { customValidation } from '../custom-validation';
import { ProjectService } from "../../services/project.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-dialogbox",
  templateUrl: "./dialogbox.component.html",
  styleUrls: ["./dialogbox.component.css"],
})
export class DialogboxComponent implements OnInit {
  @Input() groupData;
  @Input() gpDeleteData: any;
  @Input() groupDstdata:any;
  @Input() viewDetailsData:any;
  @Input() exitMbData:any;
  @Input() mdBgtDistCont:any;
  @Input() createmdIn:any;
  @Input() categoryIn:any;
  @Input() updatemdIn:any;
  @Input() addItemIn:any;
  @Input() mbOptIn:any;
  @Input() copyIn:any;
  @Input() unassignIn:any;
  @Input() filterDataIp:any;
  @Input() dashboardDataIp:any;
  @Output() groupCreate: EventEmitter<any> = new EventEmitter();
  @Output() groupDelete: EventEmitter<any> = new EventEmitter();
  @Output() updateGroupDst: EventEmitter<any> = new EventEmitter();
  @Output() exitMbPopup: EventEmitter<any> = new EventEmitter();
  @Output() addMb: EventEmitter<any> = new EventEmitter();
  @Output() mdBgtDistContOp: EventEmitter<any> = new EventEmitter();
  @Output() createmdOp: EventEmitter<any> = new EventEmitter();
  @Output() categoryOp: EventEmitter<any> = new EventEmitter();
  @Output() updatemdOp: EventEmitter<any> = new EventEmitter();
  @Output() addItemOp: EventEmitter<any> = new EventEmitter();
  @Output() mbOptOp: EventEmitter<any> = new EventEmitter();
  @Output() copyOp: EventEmitter<any> = new EventEmitter();
  @Output() unassignOp: EventEmitter<any> = new EventEmitter();
  @Output() filterDataOp: EventEmitter<any> = new EventEmitter();
  @Output() dashboardDataOp: EventEmitter<any> = new EventEmitter();
  clientFilter:any ='all'
  unitGroup: any;
  pageNumber: any = 1;
  pageSize: any = 8;
  itemMoreOnce = 0;
  dropdownList = [];
  IDropdownSettings = {
    idField: "sgid",
    textField: "unit_id",
    allowSearchFilter: false,
    selectAllText: "Select All",
    unSelectAllText: "Select All",
    singleSelection: false,
  };
  leftOverBgt: any;
  selectedResult: boolean;
  groupDistribution: any=[];
  percentageValues: any;
  percentageText: boolean;
  selectedItems: any=[];
  showMoodboardCopyId: any;
  mdData: any;
  isDisableButton: boolean;
  latestcreatMoodboard: any;
  groupId: any;
  configureProducts: any=[];
  totalQuantity: any;
  roomType: any;
  categoryList: any;
  is_Disable: boolean;
  creatMoodboard: any='';
  selectedDevice: any='';
  selectedSupp: any='';
  categoryRent: any='';
  clientNameValue: any='';
  sizeAttrId: any='';
  filterInfo = {
    design_type:[],
    item_data:{},
    product:[],
    suppliers:[],
    total_products:0
  }
  fileElement: any;
  isLoading: boolean;
  inspResult: any=[];
  supplierListSettings: { idField: string; textField: string; enableCheckAll: boolean; selectAllText: StringConstructor; };
  designTypeSettings: { idField: string; textField: string; enableCheckAll: boolean; selectAllText: StringConstructor; };
  supplierSelectedFilter: any=[];
  selectedDesign: any=[];
  blueSKu = [
    {sgid:'all', name:'All'},{sgid:'student_blue', name:'Student Blue'},{sgid:'multifamily_blue', name:'Multifamily Blue'},
    {sgid:'b2c_blue', name:'B2C Blue'},
    {sgid:'student_housing_blue', name:'Student Housing Blue'},{sgid:'str_blue', name:'STR Blue'},{sgid:'hotel_blue', name:'Hotel Blue'},
  ]
  blueSkuValue: any='';
RA_value: any ='';
  imgUrl: any;
//swapId:any;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private projectService: ProjectService,
    private toasterService: ToastrService,
  ) {
    this.unitGroup = this.formBuilder.group({
      group_name: ["", Validators.required],
      budget_percentage: [
        "",
        [Validators.required, customValidation.percentageValidation],
      ],
      floorplan_id: ["", Validators.required],
      units: ["", Validators.required],
      groupAssetBudget: ["", Validators.required],
      groupRentBudget: ["", Validators.required],
    });
    this.latestcreatMoodboard = this.formBuilder.group({
      latest_moodboard_name: ['', Validators.required],
      latest_room_type: ['',Validators.required],
    });
    this.creatMoodboard = this.formBuilder.group({
      moodboard_name: ["", Validators.required],
      room_type: [""],
      design_type: [""],
      budget_percentage: [""],
      mb_budget: [],
      // no_of_products: ['',],
      supplier: [""],
      rent_per_month: [],
      earnout: [],
    });
  }

  ngOnInit(): void {
    if (this.groupData?.button_text == "Update") {
      this.updateGroup(this.groupData);
    }
    this.groupBudgetCalulation();
    console.log(this.groupDstdata)
    if(this.groupDstdata?.dialogType == "groupBudgetDistribution"){
      this.groupDst(this.groupDstdata?.res)
    }
    if(this.mdBgtDistCont?.dialogType=="updateMbPerDist"){
      this.percentageDistributionCalucation();
      this.groupId = this.mdBgtDistCont?.group_id;
    }
   if(this.createmdIn?.dialogType=="createmd"){
    this.getRoomType()
   }
   console.log(this.createmdIn)
   if(this.createmdIn?.res){
    this.latestcreatMoodboard.patchValue({
      latest_moodboard_name:this.createmdIn?.res?.latest_moodboard_name,
      latest_room_type:this.createmdIn?.res?.latest_room_type
    });
   }
   if(this.updatemdIn?.dialogType=="EditMb"){
    this.creatMoodboard.patchValue({
      moodboard_name: this.updatemdIn?.resp.moodboard_info?.moodboard_name,
      room_type: this.updatemdIn?.resp.moodboard_info?.room_type_id,
      design_type: this.updatemdIn?.resp.moodboard_info?.design_type_id,
      mb_budget: this.updatemdIn?.resp.moodboard_info?.inhabitr_asset_budget,
      rent_per_month: this.updatemdIn?.resp.moodboard_info?.rent_per_month,
      budget_percentage: this.updatemdIn?.resp.moodboard_info?.percentage_distribution,
      earnout: this.updatemdIn?.resp.moodboard_info?.earnout_amount,
      // no_of_products: res?.moodboard_info?.no_of_products,
    });
    this.configureProducts =this.updatemdIn?.resp.moodboard_info?.category_distribution;
    this.totalQuantity =  this.configureProducts?.length
    this.percentage();
   }
   if(this.addItemIn){
    this.configureProducts = this.addItemIn.resp;
    this.percentage();
    this.totalQuantity = this.configureProducts.map((x) => x.quantity).reduce((a: any, b: any) => a + b, 0); 
   }
   if(this.filterDataIp){
      if(this.filterDataIp?.item == 1){
        this.selectedOption('project')
      }
      if(this.filterDataIp?.item == 0){
        this.selectedOption('all')
      }
      this.getCategoryItemRange(this.filterDataIp.res,'get')
   }
   console.log(this.dashboardDataIp)
  }
  // group add update 
  updateGroup(data) {
    let unitsValue = [];
    data?.res?.unit_group?.units.forEach((x) => {
      data?.units.forEach((y) => {
        if (y.sgid == x) {
          let obj = {
            sgid: y.sgid,
            unit_id: y.unit_id,
          };
          unitsValue.push(obj);
          return obj;
        }
      });
    });
    console.log(unitsValue);
    if (unitsValue.length > 6) {
      this.selectedResult = true;
    }
    this.unitGroup.patchValue({
      group_name: data?.res?.unit_group?.group_name,
      groupBudget: data?.res?.unit_group?.budget,
      budget_percentage: data?.res?.unit_group?.percentage_distribution,
      floorplan_id: data?.res?.unit_group?.floorplan_id,
      groupAssetBudget: data?.res?.unit_group?.inhabitr_asset_budget,
      groupRentBudget: data?.res?.unit_group?.rent_per_month,
    });
    setTimeout(() => {
      this.unitGroup
        .get("units")
        .setValue(unitsValue.sort((a: any, b: any) => a.sgid - b.sgid));
    }, 100);
    this.leftOverBgt = false;
  }
  ItemSelect(data){
    this.selectedItems.push(data);
    console.log(this.selectedItems)
    if(this.selectedItems.length==6){
      this.selectedResult = true;
    }
    
  }
  ItemDeSelect(data){
    let index = this.selectedItems.findIndex(x=>x.sgid==data.sgid)
    if(index !=-1){
      this.selectedItems.splice(index,1);
    }
    if(this.selectedItems.length==9){
      this.selectedResult = false;
    }
  }
  selectAll(data){
   
   if(data.length > 9){
    this.selectedResult = true;
   }
   else{
    this.selectedResult = false;
   }
  }
  deselectAll(data){
    if(data.length==0){
      this.selectedResult = false;
    }
  }
  groupBudgetCalulation() {
    let form = this.unitGroup.value;
    console.log(form);
    let groupAssetBudget =
      (this.groupData?.res.project?.inhabitr_asset_budget *
        form.budget_percentage) /
      100;
    let groupRentBudget =
      (this.groupData?.res.project?.rent_per_month * form.budget_percentage) /
      100;
    this.leftOverBgt = Math.floor(
      this.groupData?.res?.leftover_budget - groupAssetBudget
    );
    console.log(this.leftOverBgt);
    this.unitGroup.patchValue({
      groupAssetBudget: Math.round(groupAssetBudget),
      groupRentBudget: Math.round(groupRentBudget),
    });
  }
  unitGropForm() {
    this.groupCreate.emit(this.unitGroup.value);
  }
  // group add update 

  // group detele
  delete(data:any){
    if(data?.type=="group"){
      this.spinner.show();
      this.projectService.getDeleteGroup({group_id:data?.res?.sgid}).subscribe((res:any)=>{
        if(res.statusCode==200){
          this.spinner.hide();
          this.toasterService.success(res.message)
          this.groupDelete.emit({sgid:data?.res?.pricing_project_id,type:'group'});
        }
      })
    }
    if(data?.type=="configProduct"){
      this.groupDelete.emit(data)
    }
    if(data?.type=="moodboardItem"){
      this.groupDelete.emit({sgid:data?.res?.sgid,type:'moodboardItem'})
    }
    if(data?.type=="tableItemList"){
      this.groupDelete.emit({data,type:'tableItemList'})
    }
  }
  // group detele
  groupDst(data:any){
    this.projectService.getGroupDistribution({project_id:data?.sgid}).subscribe((res:any)=>{
      if(res.statusCode==200){
        this.groupDistribution=res.result;
        this.groupPercentageDistributionCalucation();
      }
    },error=>{})
  }
  groupPercentageDistributionCalucation(){
    let event = this.groupDistribution?.map(x => Number(x.percentage_distribution)).reduce((a, b) => a + b, 0);
    this.percentageValues = event;
    this.percentageText = true;
    this.groupDistribution.forEach(x=>{
      if(x.inhabitr_asset_budget){
        x.inhabitr_asset_budget= (x.percentage_distribution * this.groupDstdata?.res?.inhabitr_asset_budget) / 100;
        x.rent_per_month= (x.percentage_distribution * this.groupDstdata?.res?.rent_per_month) / 100;
      }
      return 
    })
  }
  updateGpDst(){
    this.updateGroupDst.emit(this.groupDistribution)
  }
  exitMoodboard(data,type){
    this.exitMbPopup.emit({data,type})
  }
  moodboardCopyId(data:any){
    console.log(data)
    this.showMoodboardCopyId = data;
    this.mdData = data;
    console.log(this.mdData)
  }
  addMoodboard(){
    this.addMb.emit(this.mdData)
  }
  percentageDistributionCalucation(){
    let event = this.mdBgtDistCont?.resp?.result.map(x => Number(x.percentage_distribution)).reduce((a, b) => a + b, 0);
    this.percentageValues = event;
    this.percentageText = true;
    
    let index = this.mdBgtDistCont?.resp?.result.findIndex(x=>x.percentage_distribution==0)
    if(index !=-1 && this.percentageValues==100){
      this.isDisableButton = true;
    }
    else{
      if(this.percentageValues==100){
        this.isDisableButton = false;
        this.percentageText = false;
      }
      else{
        this.isDisableButton = true;
      }
      
    }
    this.mdBgtDistCont?.resp?.result.forEach(x=>{
      if(x.inhabitr_asset_budget !=-1){
        x.inhabitr_asset_budget= ((x.percentage_distribution * this.mdBgtDistCont?.resp?.unit_group?.inhabitr_asset_budget) / 100)/this.mdBgtDistCont?.resp?.unit_group?.no_of_units;
        x.rent_per_month=  ((x.percentage_distribution * this.mdBgtDistCont?.resp?.unit_group?.rent_per_month) / 100)/this.mdBgtDistCont?.resp?.unit_group?.no_of_units;
        x.earnout_amount=  ((this.mdBgtDistCont?.resp?.unit_group?.earnout_amount *x.percentage_distribution) /100)/this.mdBgtDistCont?.resp?.unit_group?.no_of_units;
      }
      return 
    })
  }
  addMbPopup(){
    this.mdBgtDistContOp.emit({type:'create'});
  }
  updatePercentageDistribution(){
    this.mdBgtDistContOp.emit({data:this.mdBgtDistCont?.resp?.result,type:'updateMb'});
  }
  selectRoom(event){
    this.createmdOp.emit({id:event?.target?.value,type:'roomId'})
  }
  
  categoryPopUp(type){
    if(type=='createmdOp'){
      this.createmdOp.emit({form:this.latestcreatMoodboard.value,type:'category'})
    }
    if(type=='updatemdOp'){
      this.updatemdOp.emit({type:'categroyPopup'})
    }
    if(type =='addItemOp'){
      this.addItemOp.emit({type:'categroyPopup',product:this.configureProducts})
    }
  }
  creatMoodboardLatestForm(){
    this.createmdOp.emit({create:this.createmdIn})
  }
  getSelectedCategory(data,type) {
    data.parent = !data.parent;
    if (data.parent === true && data?.sgid && type=='createMb') {
      data['quantity'] = 1
      data['percentage'] = ''
      data['category_id']=data.sgid
      this.configureProducts.push(data);
      console.log(this.configureProducts)
      this.totalQuantity = this.configureProducts.map(x => x.quantity).reduce((a: any, b: any) => a + b,0)
      this.is_Disable = true;
    }
    if(data?.sgid && type == 'editMb' || data?.sgid && type == 'addItem'){
      data['quantity'] = 1
      data['percentage'] = ''
      data['category_id']=data.sgid
      data.sgid= ''
      this.configureProducts.push(data);
      console.log(this.configureProducts)
      this.totalQuantity = this.configureProducts.map(x => x.quantity).reduce((a: any, b: any) => a + b,0)
      this.is_Disable = true;
    }
    else {
      let index = this.configureProducts.findIndex(x => x.sgid == data.sgid);
      if (index != -1) {
        this.configureProducts.splice(index, 1);
      }
    }

  }
  addMoodboardItems(data,type){
    if(type=='createMb'){
      let products = data.filter(x=>x.parent).map(x=>{
        let item  = this.configureProducts.find(y=>y.category_id === x.sgid)
        x['quantity'] = 1,
        x['category_id']=x.sgid
        x['percentage'] = item?.percentage ? item?.percentage :0
        return x
      })
      this.configureProducts = products;
      console.log(this.configureProducts)
      this.percentageValues=0;
        this.totalQuantity = this.configureProducts.map(x => x.quantity).reduce((a: any, b: any) => a + b,0)
      this.toasterService.success(`${this.configureProducts.length} Categories Added Successfully`)
     
      this.categoryOp.emit({data:type,configureProducts:this.configureProducts})
    }
    if(type=='editMb'){
      this.toasterService.success(`${this.configureProducts.length} Categories Added Successfully`)
      this.categoryOp.emit({data:type,configureProducts:this.configureProducts})
    }
    if(type=='addItem'){
      
      this.toasterService.success(`${this.configureProducts.length} Categories Added Successfully`)
      this.categoryOp.emit({data:type,configureProducts:this.configureProducts})
    }
  }
  getRoomType() {
    this.projectService.getRoomType().subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.roomType = res.result
      }
    })
  }
  percentage() {
    let event = this.configureProducts.map((x) => Number(x.percentage)).reduce((a, b) => a + b, 0);
    this.percentageValues = event;
    this.percentageText = true;
    let index = this.configureProducts.findIndex((x: any) => x.percentage == 0);
    if (index != -1 && this.percentageValues == 100) {
      this.isDisableButton = true;
    } else {
      if (this.percentageValues == 100) {
        this.isDisableButton = false;
        this.percentageText = false;
      } else {
        this.isDisableButton = true;
      }
    }
    this.configureProducts.forEach((x) => {
      if (x.inhabitr_asset_budget != -1) {
        x.inhabitr_asset_budget =
          (x.percentage * this.creatMoodboard?.value?.mb_budget) / 100;
        x.rent_per_month =
          (x.percentage * this.creatMoodboard?.value?.rent_per_month) / 100;
        x.earnout_amount =
          (x.percentage * this.creatMoodboard?.value?.earnout) / 100;
      }
      return;
    });
  }
  updateQty(item: any, symbol: any) {
    if (symbol === "+") {
      item.quantity = item.quantity + 1;
      this.totalQuantity = this.configureProducts
        .map((x) => x.quantity)
        .reduce((a: any, b: any) => a + b, 0);
    } else if (symbol === "-") {
      if (item.quantity == 1) {
        return;
      } else {
        item.quantity = item.quantity == 0 ? 0 : item.quantity - 1;
        this.totalQuantity = this.configureProducts
          .map((x) => x.quantity)
          .reduce((a: any, b: any) => a + b, 0);
      }
    }
  }
  deleteDistribution(data,content,mbId){
    console.log(mbId)
    const modalRef = this.modalService.open(DialogboxComponent, {
      size: "md",
      backdrop: "static",
      centered: true,
    });
    let gpData = { dialogType: "deleteGroupDialog", 
    res: data, type:content,
    product:this.configureProducts
  };
    modalRef.componentInstance.gpDeleteData = gpData;
    modalRef.componentInstance.groupDelete.subscribe((res) => {
      console.log(res)
      if (res?.res?.sgid) {
        this.projectService.deleteMoodboardDistribution({
          moodboard_id: mbId,
          category_id: res?.res?.category_id,
          sgid: res?.res?.sgid,
        }).subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.toasterService.success("Item deleted Successfully");
            this.updateMoodboardCategory(mbId);
            modalRef.componentInstance.activeModal.close();
          }
        });
      }
      else{
        this.configureProducts = res?.product;
        let index =  this.configureProducts?.findIndex(x=>x.category_id==res?.res?.category_id)
        if(index !=-1){
          this.configureProducts.splice(index,1)
          modalRef.componentInstance.activeModal.close();
        }
      }
    });
  }
  updateItems(){
    this.addItemOp.emit({type:'updatecategroy',products:this.configureProducts})
  }
  creatMoodboardForm(){
    console.log(this.creatMoodboard.value)
    console.log(this.configureProducts)
    this.updatemdOp.emit({type:'updateMb', form:this.creatMoodboard.value,products:this.configureProducts})
  }
  updateMoodboardCategory(data: any) {
    this.spinner.show()
    this.projectService.updateMoodboardCategory({ moodboard_id: data?.sgid ? data?.sgid : data }).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide()
          this.configureProducts = res.result;
          if(this.updatemdIn?.resp?.moodboard_info?.category_distribution)this.updatemdIn.resp.moodboard_info.category_distribution = this.configureProducts
          this.percentage();
          this.totalQuantity = this.configureProducts.map((x) => x.quantity).reduce((a: any, b: any) => a + b, 0);
        }
      });
  }
  mbOptionView(data:any){
    this.mbOptOp.emit({type:data})
  }
  copyUpdate(){
    this.copyOp.emit(this.showMoodboardCopyId)
  }
  unassignNxtStep(){
    this.unassignOp.emit()
  }
  selectedOption(type:any){
    if(type=='all'){
      this.itemMoreOnce = 0;
      this.clientFilter = 'all';
      this.clientNameValue =''
      this.fileElement =''
      this.blueSkuValue=''
    }
    if(type=='project'){
      this.itemMoreOnce = 1;
      this.clientFilter='project'
      this.fileElement =''
      this.blueSkuValue=''
    }
    if(type=='inspiration'){
      this.clientFilter='inspiration';
      this.clientNameValue ='';
      this.blueSkuValue='';
      this.filterInfo.product = [];
      this.filterInfo.total_products = 0
      this.pageNumber = 1;
      return
    }
    if(type=='blueSku'){
      this.clientFilter='blueSku';
      this.clientNameValue =''
      this.fileElement =''
      this.blueSkuValue = 'all'
    }
    if(type=='RA'){
      this.clientFilter='RA';
      this.clientNameValue =''
      this.fileElement =''
      this.blueSkuValue = ''
    }
    
    this.sizeAttrId = '';
    this.inspResult = [];
    this.filterInfo.product = [];
    this.pageNumber = 1;
    this.getCategoryItemRange(this.filterDataIp.res,'get')
  }
  getCategoryItemRange(data:any,type:any){
    //this.swapId = data?.swap_id;
    let linkInspire
    if(this.inspResult?.length){
      linkInspire = 'yes';

    }
    let params = {
      group_id: data?.unit_group_id,
      moodboard_id: data?.unit_group_moodboard_id,
      category_id: data?.category_id,
      sgid: data?.sgid,
      pagenumber: this.pageNumber,
      pagesize: this.pageSize,
      itemMoreThanOnce: this.itemMoreOnce,
      design_type: this.selectedDevice,
      supplier_id: this.selectedSupp,
      category_rent: this.categoryRent,
      client_name: this.clientNameValue,
      size_attr_id: this.sizeAttrId,
      blue_sku:this.blueSkuValue,
      link_inspire:linkInspire,
      new_sku_var_id:this.inspResult,
      RA:this.RA_value,
    };
    this.spinner.show();
    this.projectService.getCategoryItemRange(params,type).subscribe((res:any)=>{
      if(res.statusCode==200){
        this.spinner.hide()
        this.filterInfo = {
          design_type:res?.design_type,
          item_data:res?.item_data,
          product:[...this.filterInfo.product,...res?.result],
          suppliers:res?.suppliers,
          total_products:res?.total_products
        }
        this.supplierListSettings = {
          idField: "sgid",
          textField: "name",
          enableCheckAll: false,
          selectAllText: String,
        };
        this.designTypeSettings = {
          idField: "sgid",
          textField: "type_name",
          enableCheckAll: false,
          selectAllText: String,
        };
      }
    })
  }
  loadMoreProducts(){
    this.pageNumber += 1;
    if(this.inspResult?.length){
      this.getCategoryItemRange(this.filterDataIp.res,'post')
    }
    if(this.filterDataIp.res){
      this.uploadImage()
    }
    else{
      this.getCategoryItemRange(this.filterDataIp.res,'get')
    }
  }
  itemchange(event,type){
    if(type=='all'){
      this.categoryRent = event.target.value;
    }
    if(type=='+'){
      event.item_rent_per_month +=1 
      this.categoryRent =  event.item_rent_per_month;
    }
    if(type=='-'){
      if(event.item_rent_per_month==1){
        return
      }
      else{
        event.item_rent_per_month = event.item_rent_per_month==0 ? 0 : event.item_rent_per_month - 1; 
        this.categoryRent =  event.item_rent_per_month;
       
      }
    }
    if(this.clientFilter =='inspiration'){
      this.itemMoreOnce = 0;
      this.clientFilter = 'all';
    }
    this.filterInfo.product = [];
    this.inspResult = [];
    this.pageNumber = 1;
    this.sizeAttrId = '';
    this.getCategoryItemRange(this.filterDataIp.res,'get');
  }
  onChange(event,type){
    console.log(event)
    if(type=='size'){
      this.sizeAttrId = event;
    }
    if(type=='clientName'){
      this.clientNameValue = event?.target?.value;
    }
    if(type=='file'){
      this.isLoading = false;
      this.fileElement = event.target.files[0];
      this.filterInfo.product = [];
      return
    }
    if(this.clientFilter =='inspiration'){
      this.itemMoreOnce = 0;
      this.clientFilter = 'all';
    }
    if(type =='blueSKu'){
     this.blueSkuValue =event?.target?.value
    }
    this.filterInfo.product = [];
    this.inspResult = [];
    this.pageNumber = 1;
    this.getCategoryItemRange(this.filterDataIp.res,'get');
  }
  uploadImage() {
    console.log(this.filterDataIp.res)
    if (this.fileElement) {
      var formData = new FormData();
      formData.append('image',this.fileElement);
      formData.append('category_id',this.filterDataIp.res.category_id);
      formData.append('moodboard_id',this.filterDataIp.res.unit_group_moodboard_id);
      formData.append('sgid',this.filterDataIp.res.sgid);
      formData.append('no_of_items','8');
      formData.append('pagenumber',this.pageNumber);
      formData.append('pagesize',this.pageSize);
      this.isLoading = false;
      this.spinner.show();
      this.projectService.getProductFromInspiration(formData).subscribe(
        (res: any) => {
          console.log(res.url)
          if (res.statusCode == 200) {
            this.isLoading = true;
            this.spinner.hide();
            if(res.result?.length){
              this.filterInfo.product=[...this.filterInfo.product,...res.result],
              this.filterInfo.total_products=res?.total_products;
              this.imgUrl = res.url
            }
          }
        },
        (error) => {
          this.isLoading = false;
        }
      );
    } else {
      this.toasterService.error("Please upload similar image");
    }
  }
  checkCheckBoxvalue(event){
    this.sizeAttrId = "";
    this.clientNameValue = ''
    if (event.target.checked == true) {
      this.clientFilter='filter'
    }
    else{
      this.clientFilter='all'
      this.itemMoreOnce = 0;
      this.filterInfo.product = [];
      this.inspResult = [];
      this.pageNumber = 1;
      this.getCategoryItemRange(this.filterDataIp.res,'get');
    }
  }
  supplierSelect(item){
    this.supplierSelectedFilter.push(item);
    let supplierSelectedFilterAll = this.supplierSelectedFilter.map((x) => x.sgid).toString();
    this.selectedSupp = supplierSelectedFilterAll;
    this.filterInfo.product = [];
    this.inspResult = [];
    this.selectedDevice = "";
    this.blueSkuValue=''
    this.getCategoryItemRange(this.filterDataIp.res,'get');
  }
  supplierDeSelect(item){
    let filterIndex = this.supplierSelectedFilter.findIndex((x) => x.sgid === item.sgid);
    if (filterIndex != -1) this.supplierSelectedFilter.splice(filterIndex, 1);
    let selectedSuppValue = this.supplierSelectedFilter.map((x) => x.sgid).toString();
    this.selectedSupp = selectedSuppValue;
    this.filterInfo.product = [];
    this.inspResult = [];
    this.selectedDevice = "";
    this.blueSkuValue=''
    this.getCategoryItemRange(this.filterDataIp.res,'get');
  }
  onDesignSelect(item: any) {
    this.selectedDesign.push(item);
    let DesignSelectedFilterAll = this.selectedDesign.map((x) => x.sgid).toString();
    this.selectedDevice = DesignSelectedFilterAll;
    this.filterInfo.product = [];
    this.inspResult = [];
    this.blueSkuValue=''
    this.getCategoryItemRange(this.filterDataIp.res,'get');
  }
  onDesignDeSelect(item: any) {
    let filterIndex = this.selectedDesign.findIndex((x) => x.sgid === item.sgid);
    if (filterIndex != -1) this.selectedDesign.splice(filterIndex, 1);
    let selecteddesignValue = this.selectedDesign.map((x) => x.sgid).toString();
    this.selectedDevice = selecteddesignValue;
    this.filterInfo.product = [];
    this.inspResult = [];
    this.blueSkuValue=''
    this.getCategoryItemRange(this.filterDataIp.res,'get');
  }
  addItemsToMoodboard(data,type){
    if(type=='moodboard'){
      this.filterDataOp.emit({data,type})
    }
    if(type=='dashboard'){
      this.filterDataOp.emit({data,type})
    }
  }
  backToDashboardPopup(){
    console.log(this.itemMoreOnce)
    this.dashboardDataOp.emit({item:this.itemMoreOnce})
  }
}
