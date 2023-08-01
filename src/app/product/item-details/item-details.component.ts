declare var $: any;
import { Subject } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../../services/items.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { ScrollToTopService } from '../../services/scroll-to-top.service';
import { CreateMoodboardService } from '../../services/create-moodboard.service';
import { QuoteService } from '../../services/quote.service';
import { Renderer2, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { messages } from '../../messages/validation_messages';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'; 
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})

export class ItemDetailsComponent implements OnInit {
  customOptions2: OwlOptions = {
    loop: true,
    dots: false,
    nav: true,
    autoplay:false,
      responsive: {
          0: {
              items: 3,
              nav: false
          },
          480: {
              items: 3,
              nav: false
          },
          768: {
              items: 3,
              nav: true
          },
          992: {
              items: 3,
              nav: true,
              loop: true
          }
      },
  
      navText: [ '<i class="fa fa-chevron-left" aria-hidden="true"></i>', '<i class="fa fa-chevron-right" aria-hidden="true"></i>' ]
    }
  changeRegisterInOpsSubject:Subject<string> = new Subject();
  registerInOpsButtonText:string ="Register with OPS";
  url: string;
  success = false;
  error: string;
  itemInfo: any;
  editTitle = false;
  showMenu = false;
  // inhabitrPercentage = 20;
  edit_percentage = false;
  errorMsg: string;
  moodbTypes: any;
  moodbTypeName: string;
  moodboardTypeId: string;
  selectedVariationImages: string;
  variationImages: any;
  productName: string;
  attributes:any;
  variationid:any;
  displayImage: string;
  supplierName: string;
  supplierPrice: number;
  categoryname: string;
  categoryId: string;
  inhabitrPrice: string;
  supplierAssetPrice: string;
  rentForMonth = 0;
  rentPrice = 0;
  warehouseLocation: string;
  warehouseLocations:any =[];
  quantity = 0;
  unassignedquantity = 0;
  supplierInv =0;
  invquantity =0;
  TotalInv =0;
  warehouse_location:any;
  AssignedInv =0;
   UnassignedInv =0;
   AssignedtoquoteInv =0;
   B2bstorage =0;
   intransit =0;
  is_inventoryCount =0;
  isinventry:boolean =false;
  isinventert:any =0;
  BuyOutPrice:any =0;
  sourcetype: string;
  supplierSKU: string;
  inhabitrSKU: string;
  sku_variation_inhabitr:string;
  description: string;
  features: string;
  dimension: string;
  isPublish: any;
  UFValue: any;
  isbuyUsedPublish: any;
  shouldshow = false;
  editProduct = true;
  editAttr = false;
  attrList: any
  List = []
  Listids = []
  selectedVariations: any
  editInhabitrPrice = true;
  editProductBuyPrice = true;
  editDescription = true;
  updateDesc: string;
  editFeatures = true;
  updateFeat: string;
  editDimension = true;
  updateDim: string;
  editProductName: string;
  editPrice: string;
  editBuyPrice: string;
  inhabitr_price:any;
  months =[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11},{id:12}]

  quoteTypes: any;
  isquote =false;
  ismoodboard =false;
  quoteTypeName: string;
  quoteTypeId: string;
  floorTypes: any;
  isfp =false;
  floorTypeName: string;
  floorTypeId: string;
  modalTitle: string;
  fpUnitList: any;

  isFloorPlan = false;
  isUnitTab = false;
  isSelectedAll = true;
  isUnitSelectedAll = false;
  unitWOPlans = [];
  nodatafoundUnit: boolean;
  noDataFoundMoodboard: boolean;
  noDataFoundQuotes: boolean;
  buyPrice: any;
  buyUsedPrice: any;
  buyPriceM: any;
  buyUsedPriceM: any;
  warehouse_id :any;

  commonQty = 1;
  messagesVal = {
    VALIDATION_PRODUCT_EMPTY: messages.VALIDATION_PRODUCT_EMPTY,
    VALIDATION_DESC: messages.VALIDATION_DESC,
    VALIDATION_FEAT: messages.VALIDATION_FEAT,
    VALIDATION_DIMENSION: messages.VALIDATION_DIMENSION,
    SUCCESSFUL_PRODUCT_NAME: messages.SUCCESSFUL_PRODUCT_NAME,
    VALIDATION_PRICE_EMPTY: messages.VALIDATION_PRICE_EMPTY,
    SUCCESSFUL_PRICE_UPDATED: messages.SUCCESSFUL_PRICE_UPDATED,
    SUCCESSFUL_BUYPRICE_UPDATED: messages.SUCCESSFUL_BUYPRICE_UPDATED,
    SUCCESSFUL_DESC: messages.SUCCESSFUL_DESC,
    SUCCESSFUL_FEAT: messages.SUCCESSFUL_FEAT,
    SUCCESSFUL_DIMENSION: messages.SUCCESSFUL_DIMENSION,
    FETCHING: messages.FETCHING,
    ERROR_NO_MOODBOARD_FOUND: messages.ERROR_NO_MOODBOARD_FOUND,
    ERROR_NO_MOODBOARDS_FOUND: messages.ERROR_NO_MOODBOARDS_FOUND,
    ERROR_QUOTES_FOUND: messages.ERROR_QUOTES_FOUND,
    PRODUCT_FLOOR_PLAN: messages.PRODUCT_FLOOR_PLAN,
    PRODUCT_ADDED_UNIT: messages.PRODUCT_ADDED_UNIT,
    PRODUCT_UNPUBLISHED: messages.PRODUCT_UNPUBLISHED,
    PRODUCT_PUBLISHED: messages.PRODUCT_PUBLISHED,
    NOT_FOUND: messages.NOT_FOUND,
    SUCCESSFUL_REGISTER_OPS:messages.SUCCESSFUL_REGISTER_OPS,
    SUCCESSFUL_SYNC_OPS:messages.SUCCESSFUL_SYNC_OPS,
    CATEGORY_UPDATED_SUCCESSFULLY: messages.CATEGORY_UPDATED_SUCCESSFULLY
  };
  source: any;
  isOPsDb: any;
  updatedAt: any;
  updatedAtUsedFurniture: any;
  updateOps: any;
  publishedToSaffron: string;
  publishedToBuyUsed: string;
  google_lens_info;
 

  productInfo: any = {};
  prod_id: string;
  productCategoryList = [];
  inhabitrWarehouseList: {}[];
  selectedWarehouseIds: string[];
  modalOptions2: NgbModalOptions;
  modalOptions3:NgbModalOptions;
  modalOptions4:NgbModalOptions;
  modalVal = '';
  monthNums = 12;
  marked = false;
  theCheckbox = false;
  selectedCategory: any;
  isOpsButtonFlag = true;
  invprodid:any;
  selectedSku: string;
  inhabitrQty: string;
  supplierQty: string;
  totalQtyOfSku = 0;
  totalInv = 0;
  defaultVar: any
  activeIndex: any; 

  floorPlanName = "";
  search = "";
  floorTypesList = []
  selectedFloorPlanType = "";
  selectedFloorPlanTypeId ="";
  floorPlanUnit = "";

  floorPlanList = [];
  selectedFloorPlan = "";
  selectedFloorPlanId = "";
  selectedButtonType = "0"

  mainCheck = true;
  optionalCheck = true;
  enableCheckbox = false;
  productSku = "";
  submitDisabled: any;
  defaultImages: any = [];
  varIndex: any;
//  @Input() moodbTypes:any
  @ViewChild('scrollDiv') scrollDiv: ElementRef | null = null;
  sizeValues: any=[];
  selectedSize: any;
  warningMsg: any;
  googleLensData: any=[];
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private item: ItemsService,
    private auth: AuthenticateService,
    private stp: ScrollToTopService,
    private cMbService: CreateMoodboardService,
    private render: Renderer2,
    private el: ElementRef,
    private quoteservice: QuoteService,
    private toastr: ToastrService,
    private config: NgbCarouselConfig,
    private router:Router
    ) { 
      this.modalOptions2 = {
        size: 'lg',
        // backdrop: 'static',
        backdropClass: 'product-details-modal',
        centered: true,
        windowClass: 'createQuotes'
      };
      this.modalOptions3 ={
        size: 'lg',
        backdrop: 'static',
        backdropClass: 'product-details-modal',
        centered: true,
        windowClass: 'createMoodboard'
      }
      this.modalOptions4 ={
        size: 'lg',
        backdrop: 'static',
        backdropClass: 'product-details-modal',
        centered: true,
        windowClass: 'createMoodboard'
      }
      config.interval = 0;
        config.showNavigationIndicators = false;
        config.keyboard = true;
        config.pauseOnHover = false;
        config.showNavigationArrows = true;
      // config.autopa
    }
    
    ngOnInit() {
      this.getWarehouseList();
      this.getProductCategoryList();
      this.getMoodboardUserList();
      this.getHistory()
      this.spinner.show();
      this.changeRegisterInOpsSubject.subscribe(buttonText => {
        this.registerInOpsButtonText = buttonText;
      });
      this.moodbTypeName = this.messagesVal.FETCHING;
      this.noDataFoundMoodboard = false;
      this.auth.currentMessage.subscribe(message => this.showMenu = message);
      this.route.paramMap.subscribe((params) => {
        this.prod_id = params.get('id');
        this.getItem(this.prod_id);
      });
      this.stp.setScrollTop();
      this.getQuotes();
      this.getFloorTypes();
    }
    optionalChangeStatus(){
      if(this.mainCheck && this.optionalCheck){
        this.mainCheck = false;
      }
      this.setRoomBuilder();
    }
    mainChangeStatus(){
      if(this.optionalCheck && this.mainCheck){
        this.optionalCheck = false;
      }
      this.setRoomBuilder();
    }
   
    setRoomBuilder(){
      let obj = {
        "product_id":this.itemInfo.sgid,
        "product_number":this.supplierSKU,
        "sku":this.productSku,
        "roombuilder":this.mainCheck ? 1:0,
        "optional":this.optionalCheck ?1:0
      }
      this.item.setRoomBuilder(obj).subscribe((resp:any)=>{
        if(resp.statusCode ==200){
          this.toastr.success(resp.message)
        } else {
          this.toastr.success(resp.message)
        }
      })
    }
  //   ngAfterViewInit(): void{
  //     this.isinventry=true;
  // }

  // add floor plan
  addProductToQuote(){
    let unitsarray = [];
    this.fpUnitList.forEach(elem  => {
      if (this.isSelectedAll) {
        unitsarray.push(elem.sgid);
      } else {
        if (elem.isActive) {
         unitsarray.push(elem.sgid);
        }
      }
    });
    var quoteQty = (<HTMLInputElement>document.getElementById("commonQty"))?.value;
    let obj = {
      floorplan_id : this.selectedFloorPlanId, 
      quote_id:this.quoteTypeId,
      product_id:this.itemInfo.sgid,
      user_id:this.auth.getProfileInfo('userId'), 
      units:unitsarray, 
      sku: this.variationid, 
      quantity: quoteQty,
      button_type : this.selectedButtonType,
      month:this.monthNums,
      warehouse_id : this.warehouse_id
    }
   
      this.quoteservice.addProductToQuoteWithoutMoodBoard(obj).subscribe((resp:any)=>{
        if(resp.statusCode == 200){
          this.toastr.success('Product Added to Floor Plan.')
        } else {
          if(typeof resp?.message ==  'string'){
            this.toastr.error(resp.message);
          } else {
            this.toastr.error(Object.values(resp.message).toString());
            
          }
          
        }
      })
  }
  getQuotes(update?) {
    this.quoteTypeName = this.messagesVal.FETCHING;
    this.noDataFoundQuotes = false;
    this.quoteservice.getQuotes('','').subscribe(resp => {
      this.quoteTypes = [];
      if (resp.statusCode === 200) {
        if (resp.quote && resp.quote.length) {
          this.quoteTypes = resp.quote;
          if(this.quoteTypes.length > 0)
          {
            this.isquote = true;
          }
          if(this.quoteTypeId){
            let quote = this.quoteTypes.find(x=>x.sgid ==this.quoteTypeId);
            if(quote){
              this.quoteTypeName  = quote.name;
              this.quoteTypeId = quote.sgid
            }
          } else {
            this.quoteTypeName = this.quoteTypes[0]?.name;
            this.quoteTypeId = this.quoteTypes[0]?.sgid;
          }
          this.getFloorPlans(update);
        } else {
          this.quoteTypeName = this.messagesVal.ERROR_QUOTES_FOUND;
          this.quoteTypeId = ''
          this.noDataFoundQuotes = true;
        }
      } else {
        this.moodbTypeName = this.messagesVal.ERROR_QUOTES_FOUND;
      }
    }, error => {} );
  }

  buttonTypeChecked(value){
    this.selectedButtonType =  value;
  }

  addFloorPlans(){
    const obj = {
      quote_id: this.quoteTypeId,
      floorplan_name: this.floorPlanName,
      floorplan_type_id: this.selectedFloorPlanTypeId,
      units: this.floorPlanUnit,
      userid: this.auth.getProfileInfo('userId')
    };
    this.spinner.show()
    this.quoteservice.addFloorPlan(obj).subscribe(resp=>{
      if(resp.statusCode==200){
        this.spinner.hide()
        this.toastr.success(resp.message);
        document.getElementById("mbModalFloor")
        this.getQuotes(true)
        setTimeout(() => {
          this.floorPlanName = "";
          this.floorPlanUnit = "";
        });
      } else {
        this.spinner.hide();
        this.toastr.success('Try again Later.');
      }
    })
  }

  selectFloorTypes(floor){
    this.selectedFloorPlanType = floor.name;
    this.selectedFloorPlanTypeId = floor.sgid;
  }
  getFloorTypes(){
    this.quoteservice.getFloorTypes().subscribe(resp=>{
      if (resp.statusCode === 200) {
        this.floorTypesList = resp.result;
        this.selectedFloorPlanTypeId = this.floorTypesList[0]?.sgid ?? "";
        this.selectedFloorPlanType =  this.floorTypesList[0]?.name ?? "";
      } else {
        this.floorTypesList = []
      }
    })
  }

  getFloorPlans(update?){
    this.quoteservice.getFloorPlanDetails(this.quoteTypeId).subscribe(resp=>{
      if (resp.statusCode === 200) {
         this.floorPlanList =  resp.result;
          this.selectedFloorPlan = this.floorPlanList[0]?.floorname ?? "";
          this.selectedFloorPlanId = this.floorPlanList[0]?.sgid ?? "";
          if(this.selectedFloorPlanId){
          this.loadfpUnits(this.selectedFloorPlanId,this.quoteTypeId)
          if(update){
            setTimeout(()=>{
              let ele = document.getElementById('floorPlan');
              ele?.click()
            })
          }
         }
      }
    })
  }

  // add floor plan
  getAttributes() {
    this.spinner.show()
    
    this.item.getAttributesList(this.categoryId).subscribe(resp => {
      this.spinner.hide()
      this.attrList = resp.result
      
      
        
    });
  }
  increaseQty() {

    if(this.commonQty < this.totalQtyOfSku) {
      ++this.commonQty
    } else {
      this.toastr.error("Cannot increase quantity above available quantity")
    }
  
    // this.checkQty = 0
    // if(incQty > this.skuAvailQty) {
      
    //   this.toastr.error("Quantity exceeds available quantity")
    //   this.checkQty = 1
    // }
  }
  
  decreaseQty() {
    if(this.commonQty === 0) {
  
      this.commonQty = 1;
      return;
    }
  
    if(this.commonQty <= this.totalQtyOfSku) {
      --this.commonQty
    }
  }
  selectMultipleAttr(event) {

    let val = event.target.value.toString().trim()

    // if exist remove else add to list
    this.List.includes(val) ? this.remove(this.List, val) : this.List.push(val)

    
  }
  selectAttr(event) {

    let val = event.target.value.toString().trim()

    // if exist remove else add to list
    this.Listids.includes(val) ? this.remove(this.Listids, val) : this.Listids.push(val)
  }

  saveAttr() {
    this.spinner.show()
    this.item.addOrUpdateAttribute(this.itemInfo.sgid,this.Listids).subscribe(resp => {
      if(resp.message == "Attribute updated") {
        this.spinner.hide()
        this.toastr.success("Attributes  updated successfully")
      } else {
        this.toastr.error("Error")
      }
    })
  }

  remove(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  
  removeAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }

  showEditTitle() {
    this.editTitle = !this.editTitle;
  }

  getPercentageValue(price, percentage) {
    const result = (parseFloat(price) * parseFloat(percentage)) / 100;
    return result;
  }
  getInventeryqty()
  {
   
    
   this.item.getInventoryqty(this.prod_id,this.sku_variation_inhabitr).subscribe(resp => {
      
  //     this.is_inventoryCount =1;
  //   this.invquantity=resp.result.nonassigned;
  //   this.TotalInv=resp.result.total;
  // this.AssignedInv=resp.result.assigned;
  //  this.UnassignedInv=resp.result.nonassigned;
  //  this.B2bstorage=resp.result.b2bnonassigned;
   
    
    
  //   // sessionStorage.setItem('isinventry', this.prod_id);
  //   // sessionStorage.setItem('isinventryqty', this.invquantity);
  this.toastr.success(resp.message);
    
   });
   this.getItem(this.prod_id) 
    
  }
  skId:any
  getItem(id, variationId?) {
    this.spinner.show();
    this.item.getItem(id).subscribe(
      resp => {      
        this.spinner.hide();
        this.itemInfo = resp.result;
        // this.sizeValues = this.itemInfo.bed_size;
        this.submitDisabled = resp.result.enable_for_uf
        if (this.submitDisabled == false) {
          this.toastr.warning('Product cannot be Published to Used Furniture');
        }
        if(this.itemInfo){

          if(this.itemInfo?.bed_size?.length !=0) this.sizeValues = this.itemInfo?.bed_size;
          if(this.itemInfo?.mattress_size?.length !=0) this.sizeValues = this.itemInfo?.mattress_size;
          console.log(this.sizeValues)
        }
       
        this.enableCheckbox = this.itemInfo?.enableCheckbox ?? true;
       
        if(this.itemInfo?.source === 'Ops Dashboard'){
          this.isOpsButtonFlag = false;
        }
        if(this.itemInfo?.source === 'Ops'){
          this.isOpsButtonFlag = false;
        }

         if(this.itemInfo?.variations && this.itemInfo?.variations.is_ops_db === true){
           this.changeRegisterInOpsSubject.next("Update With Ops");
         }
         //showing variation imgs in slider
        this.variationImages = this.itemInfo.variations;
        let queryParams = this.route.snapshot.queryParams

         if(queryParams && queryParams.skuid && !variationId){
          variationId = Number(queryParams.skuid)
         }
        // this.variationImages.forEach(element => {
        
        //   this.defaultImages = element.default_images
        // });
        
        let index = this.variationImages.findIndex(x=> x.sgid== variationId);
        console.log(index)
        if(index<0){
          index = 0;
        }
        this.defaultImages =this.variationImages[index]?.default_images
        // this.fetchLensData();
        this.getLensPriceDetails()
        console.log(this.defaultImages)
         this.skId = this.defaultImages[0].sku_variation_id
        console.log(this.skId)
        if(queryParams && queryParams.attribute && !variationId){
          let variationIndex = this.itemInfo.variations.findIndex(x=>{
            let selectedAttribute = Number(queryParams.attribute);
            let varCombiIds = x.attribute_combination.map(y=>y.attribute_id)
            return varCombiIds.some(z=>z == selectedAttribute)
          })
          if(variationIndex !=-1){
            index = variationIndex
          }
         let size = this.sizeValues.find(x=>x.attribute_id==queryParams.attribute)
         this.selectedSize = size?.attribute_value
        }
        this.getHistory()
       
        // select default sku and inventories
        this.selectedSku = this.variationImages[index].inhabitr_sku ? this.variationImages[index].inhabitr_sku : "Not Found";
        console.log(this.selectedSku);
        
      
        
        
        if(!this.variationImages[index].warehouse_location_new) {
         

          this.inhabitrQty = this.variationImages[index].warehouse_location_new[index].sum_inhabitr_quantity;
          this.supplierQty = this.variationImages[index].warehouse_location_new[index].sum_inhabitr_quantity;
        }
        
        if(!this.inhabitrQty) {
          this.inhabitrQty = '0';
        }

        if(!this.supplierQty) {
          this.supplierQty = '0';
        }
       
        // tslint:disable-next-line: max-line-length
        // this.inhabitrPrice = parseFloat(this.itemInfo.salePrice) + this.getPercentageValue(this.itemInfo.salePrice, this.inhabitrPercentage);
        this.setDetails(index);
        if (this.itemInfo?.features) {
          this.features = this.itemInfo.features.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '').replace(/<p>/g, '').replace(/<\/p>/g, '');
          this.updateFeat = this.itemInfo.features.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '');

        }
        if (this.itemInfo?.description) {
          this.description = this.itemInfo?.description.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '');
          this.updateDesc = this.itemInfo?.description.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '');
        }

      }, err => {
        this.spinner.hide();
      });
  }

  invpopupModelShow(id) {
    $("#invpopup").show();
    for(var i =0;i < this.warehouseLocations.length;i++)
    {
      if(this.warehouseLocations[i].warehouse_id == id)
      {
        this.AssignedInv = this.warehouseLocations[i].assigned_inv;
        this.B2bstorage = this.warehouseLocations[i].b2b_non_assigned_inv;
        this.invquantity = this.warehouseLocations[i].non_assigned_inv;
        this.intransit = this.warehouseLocations[i].in_transit;
      }
    }
  }

  invpopupModelHide() {
    $("#invpopup").hide();
  }

  setDetails(index) {
    console.log(index)
    this.activeIndex = index; 
    this.source = this.itemInfo?.source;
    this.isOPsDb = this.itemInfo?.variations[index].is_ops_db

    this.productName = this.itemInfo?.name;
    this.editProductName = this.itemInfo?.name;
    this.displayImage = this.itemInfo?.variations[index]?.default_images[0]?.image_url.large;
    this.dimension = this.itemInfo?.variations[index]?.dimension;
    this.updateDim = this.itemInfo?.variations[index]?.dimension;
    this.supplierName = this.itemInfo?.variations[index]?.supplier_name;
    this.supplierPrice = this.itemInfo?.variations[index]?.orginal_price;
    this.categoryId = this.itemInfo?.category?.sgid;
    this.categoryname = this.itemInfo?.category?.category_name;
    this.editPrice = this.itemInfo?.variations[index]?.asset_value;
    this.rentForMonth = this.itemInfo?.variations[index]?.default_price[0]?.month;
    this.rentPrice = this.itemInfo?.variations[index]?.default_price[24]?.rental_price;
    this.buyPrice = this.itemInfo?.variations[index]?.buyPrice;
    this.buyUsedPrice = this.itemInfo?.variations[index]?.buyUsedPrice;
    this.buyPriceM = this.itemInfo?.variations[index]?.supplier?.business_pdm_buy_new_multiplier;
    this.buyUsedPriceM = this.itemInfo?.variations[index]?.supplier?.business_pdm_buy_used_multiplier;
    this.editBuyPrice = this.itemInfo?.variations[index]?.buyPrice;
    this.updatedAt = this.itemInfo?.updated_in_Saffron;
    this.updatedAtUsedFurniture = this.itemInfo?.updated_in_usedfurniture;
    this.updateOps = this.itemInfo?.updated_in_OPS;
    this.publishedToSaffron = this.itemInfo?.is_publish_saffron ? 'Yes' : 'No';
    this.publishedToBuyUsed = this.itemInfo?.variations[index]?.is_publish_usedfurniture ? 'Yes' : 'No';
    this.isbuyUsedPublish = this.itemInfo?.variations[index]?.is_publish_usedfurniture;
    this.attributes = this.itemInfo?.variations[index]?.attribute_info?.split(',');
    this.warningMsg = this.itemInfo?.variations[index]?.warning_msg;
    this.variationid = this.itemInfo?.variations[index]?.sgid;
    this.inhabitrPrice = this.itemInfo?.variations[index]?.pricing_asset_value;
    this.defaultVar = this.defaultSelectedVar(index)
   
    this.warehouse_id = this.itemInfo?.variations[index]?.warehouse_location?.warehouse_id;
    
    this.optionalCheck = this.itemInfo?.variations[index]?.optional ??  false;
    this.mainCheck =  this.itemInfo?.variations[index]?.main ??  false;
    // this.supplierAssetPrice=this.itemInfo?.variations[index]?.inhabitr_price;
    // if(this.itemInfo?.variations[index]?.supplier.source == "EDI"){
    //   this.quantity = this.itemInfo?.variations[index]?.no_warehouse_location.quantity;
    // }else{
 
     
    //   this.quantity = this.itemInfo?.variations[index]?.warehouse_location?.quantity;
      
    // }
  //  if(this.itemInfo?.inventoryCount !=null)
  //  {
  //   this.invquantity=this.itemInfo?.inventoryCount;
    
  //  }
   this.is_inventoryCount = this.itemInfo?.is_inventoryCount;
    //this.quantity = this.itemInfo?.variations[index]?.is_inventory_qty;
    this.sourcetype = this.itemInfo?.source; // source type not there source_type
    
    this.supplierSKU =  this.itemInfo?.variations[index]?.product_number //this.itemInfo?.supplier_sku; // not htere
   
    // thsi logic got implement  yeasyterday, no idea baout this 
    // if((this.itemInfo?.variations[index]?.supplier.is_bookmarklet == true) ||){
    //   this.inhabitrSKU = '-';
    // }else{
    //   this.inhabitrSKU = this.itemInfo?.variations[index]?.sku;
    // }
    // if(this.itemInfo){
    //   this.itemInfo.sgid = this.itemInfo?.variations[index]?.sgid
    // }
    this.productSku = this.itemInfo?.variations[index]?.sku;


    this.warehouseLocations = this.itemInfo?.variations[index]?.warehouse_location_new;

    let tots: number;
    let supTots: number;
    tots = 0;
    supTots = 0;
    this.itemInfo?.variations[index]?.warehouse_location_new.forEach(element => {
      if(element.is_inhabitr_warehouse == 'Y' && element.non_assigned_inv !== null) {
        tots += element.non_assigned_inv;
      }
      if(element.is_inhabitr_warehouse == 'N' && element.supplier_quantity !== null) {
        supTots += element.supplier_quantity;
      }
    });
    
    this.totalQtyOfSku = tots + supTots;

    if(this.itemInfo?.variations[index]?.supplier.source == "EDI"){
      this.warehouseLocation = this.itemInfo?.variations[index]?.no_warehouse_location.warehouse_name;
    } else{
      if(this.itemInfo?.variations[index]?.warehouse_location == null){
        this.warehouseLocation = '-';
      }else{
        this.warehouseLocation = this.itemInfo?.variations[index]?.warehouse_location?.warehouse_name;
    }
   
    this.warehouse_location = this.itemInfo?.variations[index]?.warehouse_location;
    if(this.source?.toLowerCase() === 'ops dashboard') {
      this.supplierAssetPrice = null;
      this.inhabitrPrice = this.itemInfo?.variations[index]?.pricing_asset_value;
      if(this.itemInfo?.is_inventoryCount == 1)
      {
        this.TotalInv = this.itemInfo?.total_inv;
      }
       else{
      this.TotalInv = this.itemInfo?.variations[index]?.warehouse_location?.inhabitr_quantity;
       }
      if(this.itemInfo?.variations[index]?.warehouse_location?.supplier_quantity != null && this.itemInfo?.variations[index]?.warehouse_location?.supplier_quantity == '')
      {
      this.quantity = this.itemInfo?.variations[index]?.warehouse_location?.supplier_quantity;
      }
      else{
        this.quantity = 0;
      }

    } else if(this.source?.toLowerCase() === 'API' || this.source?.toLowerCase() === 'EDI' || this.source?.toLowerCase() === 'bookmarklet') {
      this.supplierAssetPrice = this.itemInfo?.variations[index]?.asset_value;

      this.inhabitrPrice = this.itemInfo?.variations[index]?.pricing_asset_value;
      this.quantity = this.itemInfo?.variations[index]?.warehouse_location?.supplier_quantity; 
    if(this.itemInfo?.variations[index]?.warehouse_location?.inhabitr_quantity != null && this.itemInfo?.variations[index]?.warehouse_location?.inhabitr_quantity == '')
    {
      this.TotalInv = this.itemInfo?.variations[index]?.warehouse_location?.inhabitr_quantity;
    }
    else
    {
    this.TotalInv = 0;
    }
    
    if(this.isOPsDb ){
      this.inhabitrPrice = this.itemInfo?.variations[index]?.pricing_asset_value;

    }
    // this.rentPrice = this.itemInfo?.variations[index]?.rental_price;

    }
    // my logic as per yeastre disscuion about SKU visibility
    // if((this.source?.toLowerCase() === 'ops dashboard') || (this.isOPsDb=== true && (this.source?.toLowerCase() === 'api'|| this.source?.toLowerCase() === 'edi' || this.source?.toLowerCase() === 'bookmarklet'))) {
    //  this.sku_variation_inhabitr = this.inhabitrSKU = this.itemInfo?.source === 'Ops Dashboard' ? this.itemInfo?.variations[index]?.sku : this.itemInfo?.variations[index]?.inhabitr_sku;
    // } 
    // else {
    //   this.inhabitrSKU = '-';
    //   this.sku_variation_inhabitr = null;
    // }
    //this.inhabitrSKU = this.itemInfo?.variations[index]?.sku;
    this.inhabitrSKU = this.itemInfo?.variations[index]?.inhabitr_sku;
    this.isPublish = this.itemInfo?.status;
    // this.isbuyUsedPublish = this.itemInfo?.status;
    
    if(this.itemInfo?.variations[index]?.is_publish_usedfurniture === 1) {
      this.UFValue = 0;
    } else {
      this.UFValue = 1;
    }

    this.onItemBuyUsedChange(this.UFValue, 'load')
    

    }
    
  }

  defaultSelectedVar(index) {
    this.itemInfo?.variations[index]?.attribute_combination?.forEach(val => {
      if(val?.attribute?.sgid !== undefined) {

        this.List.push(val?.attribute?.sgid.toString())
      }
    });

    
    
    return this.List
    
  }


  invpopup()
  {
    $('#inv').modal('show'); 
  }
  invpopupclose()
  {
    $('#inv').modal('hide'); 
  }

  procure() {
    const itemObj = this.itemInfo;
    delete itemObj.createdTime;
    delete itemObj.updatedDate;
    this.spinner.show();
    this.success = false;
    this.item.procure(itemObj).subscribe(
      resp => {
        this.spinner.hide();
        this.addImage(resp);
      }, err => {
        this.spinner.hide();
      }
    );
  }
  unpublish() {
    this.spinner.show();
    this.item.unpublish(this.itemInfo.id).subscribe(
      resp => {
        this.spinner.hide();
        this.itemInfo.isProcured = 0;
      },
      err => {
        this.spinner.hide();
      }
    );
  }
  publish() {
    this.spinner.show();
    this.item.publish(this.itemInfo.id).subscribe(
      resp => {
        this.spinner.hide();
        this.publishAdd();
      },
      err => {
        this.spinner.hide();
      }
    );
  }
  publishAdd() {
    this.spinner.show();
    this.item.publishAdd(this.itemInfo.id).subscribe(
      resp => {
        this.spinner.hide();
        this.addImage(resp);
      },
      err => {
        this.spinner.hide();
      }
    );
  }
  addImage(obj) {
    this.spinner.show();
    this.item.addImage(obj).subscribe(
      resp => {
        this.spinner.hide();
        this.itemInfo.isProcured = 1;
        this.itemInfo.updatedDate = new Date();
        this.success = true;
      }, err => {
        this.spinner.hide();
      }
    );
  }
  manage_percentage() {
    this.edit_percentage = !this.edit_percentage;
  }
  selectMoodbType(moodboardType) {
    this.moodbTypeName = moodboardType.boardname;
    this.moodboardTypeId = moodboardType.sgid;
    // this.getMoodboardUserList()
  }

  activeImage(index) {
    let variation = this.variationImages[index];
    this.getItem(this.prod_id,variation.sgid);
    
    // //  this.el.nativeElement.querySelector('.img-thumbnail').classList.remove("selected");
    // //    this.render.addClass($event.target, 'selected');
    // this.setDetails(index);

  }
  activeImage1(index) {
   
    this.varIndex = index;
    // this.variationImages.forEach(element => {
     
    //   this.defaultImages = element.default_images
    // });
    console.log(this.defaultImages)
    this.displayImage = this.defaultImages[this.varIndex]?.image_url.large;
   
  }

  setSku(sku) {
    this.selectedSku = sku.inhabitr_sku;
   
    
    
  }

  updateDescription() {
  if (this.updateDesc === '') {
      this.updateDesc = this.description;
      this.toastr.error(this.messagesVal.VALIDATION_DESC);
    } else {
      this.spinner.show();
      this.item.editDesc(this.updateDesc , this.prod_id).subscribe(resp => {
        if (resp) {
        this.description = this.updateDesc;
        this.spinner.hide();
        this.toastr.success(this.messagesVal.SUCCESSFUL_DESC);
        }
      }, error => this.errorMsg = error);
    }
  }
  updateFeature() {
  if (this.updateFeat === '') {
      this.updateFeat = this.features;
      this.toastr.error(this.messagesVal.VALIDATION_FEAT);
    } else {
      this.spinner.show();
      this.item.editFeat(this.updateFeat , this.prod_id).subscribe(resp => {
        if (resp) {
        this.features = this.updateFeat;
        this.spinner.hide();
        this.toastr.success(this.messagesVal.SUCCESSFUL_FEAT);
        }
      }, error => this.errorMsg = error);
    }
  }
  updateDimension() {
  if (this.updateDim === '') {
      this.updateDim = this.dimension;
      this.toastr.error(this.messagesVal.VALIDATION_DIMENSION);
    } else {
      this.spinner.show();
      this.item.editDesc(this.updateDim , this.prod_id).subscribe(resp => {
        if (resp) {
        this.dimension = this.updateDim;
        this.spinner.hide();
        this.toastr.success(this.messagesVal.SUCCESSFUL_DIMENSION);
        }
      }, error => this.errorMsg = error);
    }
  }
  updateProductName() {
  if (this.editProductName.trim() === '') {
      this.editProductName = this.productName;
      this.toastr.error(this.messagesVal.VALIDATION_PRODUCT_EMPTY);
    } else {
      this.spinner.show();
      this.item.updateProductName(this.editProductName , this.itemInfo).subscribe(resp => {
        if (resp) {
        this.productName = this.editProductName;
        this.spinner.hide();
        this.toastr.success(this.messagesVal.SUCCESSFUL_PRODUCT_NAME);
        }
      }, error => this.errorMsg = error);
    }
  }
  lodTrue:boolean
  countOfMatch:any;
  priceDestails:any
  getLensPriceDetails(){
    let obj =  this.defaultImages[0]
    this.item.getLensPriceDetails(obj.sgid,obj.sku_variation_id).subscribe((res:any) =>{
      this.priceDestails = res.result
      console.log(this.priceDestails);
      this.google_lens_info = JSON.parse(res.result?.google_lens_info);
        console.log(this.google_lens_info);
        this.countOfMatch = this.google_lens_info.item.match.length;
    })
  }

  fetchLensData(){
    let obj =  this.defaultImages[0]
    let params = {
        image:obj.image_url.large,
        product_id:obj.sgid,
        variation_id:obj.sku_variation_id
      }
    this.spinner.show();
    this.lodTrue = true
    this.item.getGoogleLensPrice(params).subscribe((res:any)=>{
      console.log(res);
      if(res.statusCode==200){
        this.lodTrue = false
        this.google_lens_info = JSON.parse(res.result?.google_lens_info);
        console.log(this.google_lens_info);
        this.countOfMatch = this.google_lens_info.item.match.length;
        
      }
      this.spinner.hide();
    })
  }

  updateAssetPrice() {
    if (this.editPrice === null ) {
      this.editPrice = this.inhabitrPrice;
      this.toastr.error(this.messagesVal.VALIDATION_PRICE_EMPTY);
    } else {
      this.spinner.show();
      this.item.updateAssetPrice(this.itemInfo.sgid, this.variationid, this.editPrice, this.auth.getProfileInfo('userId')).subscribe(resp => {
        if (resp) {
          this.inhabitrPrice = this.editPrice;
          this.changeRegisterInOpsSubject.next("Update In OPS")
          // this.spinner.hide();
          this.toastr.success(this.messagesVal.SUCCESSFUL_PRICE_UPDATED);
          this.getItem(this.prod_id);
        }
      }, error => this.errorMsg = error);
    }
  }

  updatePrice() {
    if (this.editPrice === null ) {
      this.editPrice = this.inhabitrPrice;
      this.toastr.error(this.messagesVal.VALIDATION_PRICE_EMPTY);
    } else {
      this.spinner.show();
      this.item.updatePrice(this.editPrice, this.inhabitrSKU, this.itemInfo.sgid).subscribe(resp => {
        if (resp) {
          this.inhabitrPrice = this.editPrice;
          this.changeRegisterInOpsSubject.next("Update In OPS")
          this.spinner.hide();
          this.toastr.success(this.messagesVal.SUCCESSFUL_PRICE_UPDATED);
        }
      }, error => this.errorMsg = error);
    }
  }

  updateBuyPrice(){
    if(this.editBuyPrice) {
      this.item.updateBuyPrice(this.editBuyPrice, this.prod_id).subscribe(resp => {
        if (resp) {
          this.buyPrice = this.editBuyPrice;
          this.spinner.hide();
          this.toastr.success(this.messagesVal.SUCCESSFUL_BUYPRICE_UPDATED);
        }
      }, error => this.errorMsg = error);
    } else {
      this.buyPrice = this.editBuyPrice;
      this.toastr.error(this.messagesVal.VALIDATION_PRICE_EMPTY);
      this.spinner.hide();
    }
  }

  getWarehouseList(){
    this.inhabitrWarehouseList = [
      {id: 1, name: 'Chicago'},
      {id: 2, name: 'Arizona'},
      {id: 3, name: 'Atlanta'},
      {id: 4, name: 'Austin'},
      {id: 5, name: 'Dallas'},
      {id: 6, name: 'Hyattsville'},
      {id: 7, name: 'Indiana'},
      {id: 8, name: 'Miami'},
    ];
  }

  getValues() {
    $('.ng-select .ng-select-container .ng-value-container').css('display', 'inline-block');
    // $('.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value').css('background-color', '#d7dcdf');
  }

  getProductCategoryList(){
    this.item.getProductCategoryList().subscribe(resp => {
      if (resp.statusCode === 200) {
        this.productCategoryList = resp.result;
      }
  })
}

getSelectedCategory(category){
  this.selectedCategory = category;
}

onUpdateCategory(category){
  this.item.updateProductCategoryName(this.prod_id, category.sgid).subscribe((resp) => {
    if(resp.statusCode === 200){
      this.toastr.success(this.messagesVal.CATEGORY_UPDATED_SUCCESSFULLY);
      this.getItem(this.prod_id);
    }
  })
}

 

  floorPlanTab() {
    this.isFloorPlan = true;
    this.isUnitTab = false;
  }

  unitTab() {
    this.isFloorPlan = false;
    this.isUnitTab = true;
   // this.getUnits();

  }

  addProductinFloorPlan() {
    this.spinner.show();
    // floorplan_id,quote_id,moodboard_id,units(array format) ex [1,2,3]
      let unitsarray = [];
      this.fpUnitList.forEach(elem  => {
        if (this.isSelectedAll) {
          unitsarray.push(elem.sgid);
        } else {
          if (elem.isActive) {
           unitsarray.push(elem.sgid);
          }
        }
      });
      var quoteQty = (<HTMLInputElement>document.getElementById("quote_qty"))?.value;
     
      let obj = {floorplan_id : this.floorTypeId, quote_id:this.quoteTypeId,product_id:this.itemInfo.sgid,user_id:this.auth.getProfileInfo('userId'), units:unitsarray, sku: this.variationid, quantity: quoteQty}
      
      this.quoteservice.addProductToFloorPlan(obj).subscribe(resp => {
        if (resp.statusCode === 200) {
          this.spinner.hide();
          this.toastr.success(this.messagesVal.PRODUCT_FLOOR_PLAN);
        }
      }, error => {
        this.toastr.error("error occured");
      } )
    }

    updateInOps() {
    }

    addwithoutFloorPlanUnits(){

      // floorplan_id,quote_id,moodboard_id,units(array format) ex [1,2,3]
      /* let unitsarray = [];
      this.unitWOPlans.forEach(elem  => {
          unitsarray.push(elem.sgid);
      }) */
      this.spinner.show();
      let unitsarray = [];
      this.unitWOPlans.forEach(elem  => {
        if(this.isUnitSelectedAll){
          unitsarray.push(elem.sgid);
        }else{
          if(elem.isActive){
           unitsarray.push(elem.sgid);
          }  
        }
        
      })
      var quoteQty = (<HTMLInputElement>document.getElementById("quote_qty")).value;
  
      let obj = {floorplan_id : this.floorTypeId, quote_id:this.quoteTypeId,product_id:this.itemInfo.sgid,user_id:this.auth.getProfileInfo('userId'), units:unitsarray, sku: this.variationid, quantity: quoteQty}
      
      this.quoteservice.addProductToFloorPlan(obj).subscribe(resp => {
        if(resp.statusCode === 200){
          this.spinner.hide();
          this.toastr.success(this.messagesVal.PRODUCT_ADDED_UNIT);
        }
      },error => {}) 
  
    }


    
selectUnitsWithoutFloorPlan(unit){
  if(unit.isActive){
    let checker = 0;
    this.unitWOPlans.forEach(elem  => {
      //unitsarray.push(elem.sgid);

      if(elem.isActive){
        checker++;
      }
      

    });
    if(checker > 1){
      unit.isActive =  false;
    }else{

    }
   
  } else{
    unit.isActive = true;
  }  
}


  getUnits() {
    this.quoteservice.getUnitWithoutPlan(this.quoteTypeId).subscribe(resp => {
      if(resp.statusCode === 200 && resp.result.length > 0){
        this.unitWOPlans = resp.result;
        this.nodatafoundUnit = false;
      }else{
        this.unitWOPlans = [];
        this.nodatafoundUnit = true;
      }
    }, error => { this.nodatafoundUnit = true; });  
  }

  getFloorPlan() {
      this.getUnits();
      this.modalTitle = this.quoteTypeName;

      this.floorTypeName = '..';
      this.quoteservice.getFloorPlanDetails(this.quoteTypeId).subscribe(resp => {
        this.floorTypes = [];
        if (resp.statusCode === 200) {
          if (resp.result.length == 0) 
          {
            this.isfp = false;
          } else{
            this.floorTypes = resp.result;
            if(this.floorTypes.length > 0)
            {
              this.isfp = true;
            }
            this.floorTypeName = resp.result[0].floorname;
            this.floorTypeId = resp.result[0].sgid;
            this.loadfpUnits(resp.result[0].sgid,this.quoteTypeId);
            //getFloorplanUnits(planId, quoteid ){
          }
        } else { }
      }, error => {} )
}

  // merged both above methods in one logic
  addProductToMoodboardOrQuote() {

    this.spinner.show();
    let btnType = '0';
    // check which one is selected
    if ((<HTMLInputElement>document.getElementById("rent")).checked) {
      btnType = (<HTMLInputElement>document.getElementById("rent")).value;
    } else {
      btnType = (<HTMLInputElement>document.getElementById("buy")).value;
      
    }
    
    var commonQty = (<HTMLInputElement>document.getElementById("commonQty")).value;
    
      let obj = { floorplan_id:null,units:null,moodboard_id:null, button_type:btnType, product_id: this.prod_id, quote_id: this.quoteTypeId, user_id: this.auth.getProfileInfo('userId'), sku:this.itemInfo.sgid, quantity: commonQty, month:this.monthNums, warehouse_id:this.warehouse_id}
     
      this.quoteservice.addProductCartQuote(obj).subscribe(resp => {
        if(resp.statusCode === 200) {
          this.spinner.hide();
          this.toastr.success("Product added to quote successfully");
        }
      }, error => {})
  }

addCartQuote() {

  this.spinner.show();
  var quoteQty = (<HTMLInputElement>document.getElementById("quote_qty")).value;

  

  let obj = { floorplan_id:null,units:null,moodboard_id:null, button_type:null, product_id: this.itemInfo.sgid, quote_id: this.quoteTypeId, user_id: this.auth.getProfileInfo('userId'), sku:this.itemInfo.variations[0].sgid, quantity: quoteQty}

  this.quoteservice.addProductCartQuote(obj).subscribe(resp => {
    if(resp.statusCode === 200) {
      this.spinner.hide();
      this.toastr.success("Product added to quote successfully");
    }
  }, error => {})

}

isAllUnit(bool) {
  if (bool) {
 this.isSelectedAll = true;
 this.fpUnitList.forEach(elem  => {
   elem.isActive = true;
 })
  }else{
   this.isSelectedAll = false;
   this.fpUnitList.forEach(elem  => {
    elem.isActive = false;
  })
  }
 }

 
 isAllUnitWtihoutFP(bool){
  if(bool){
    this.isUnitSelectedAll = true;
    this.unitWOPlans.forEach(elem  => {
       elem.isActive = true;
    })
  }else{
   this.isUnitSelectedAll = false;
   this.unitWOPlans.forEach(elem  => {
    elem.isActive = false;
 })
  }
 }


  loadfpUnits(fpid,qid){
    this.quoteservice.getFloorplanUnits(fpid , qid).subscribe(resp => {
     if(resp.statusCode === 200){
       this.fpUnitList = resp.result;
  
       this.fpUnitList.forEach(elem => {
        elem.isActive = false;
        })
  
      }
    },error => {});
   }

   
selectQuoteType(quoteType) {
  this.quoteTypeName = quoteType.name;
  this.quoteTypeId = quoteType.sgid;
  this.modalTitle = this.quoteTypeName;
  this.getFloorPlans();
}

selectFloorPlan(floorType){
  this.selectedFloorPlan = floorType.floorname;
  this.selectedFloorPlanId = floorType.sgid;
  this.loadfpUnits(this.selectedFloorPlanId  ,this.quoteTypeId);
}


selectUnitsForPlans(unit){
  if(unit.isActive){
    let checker = 0;
    this.fpUnitList.forEach(elem  => {
      if(elem.isActive){
        checker++;
      }
    });
    if(checker > 1){
      unit.isActive =  false;
    }else{

    }
   
  } else{
    unit.isActive = true;
  }  
}
addtoMoodboard() {
  if(this.moodboardTypeId != 'undefined' && this.moodboardTypeId != null && this.moodboardTypeId != "")
  {
    this.spinner.show();

    var moodboardQty = (<HTMLInputElement>document.getElementById("commonQty")).value;
    let btnType = '0';
    btnType = this.selectedButtonType;
    // if ((<HTMLInputElement>document?.getElementById("rent"))?.checked) {
    //   btnType = (<HTMLInputElement>document?.getElementById("rent"))?.value;
    // } else {
    //   btnType = (<HTMLInputElement>document?.getElementById("buy"))?.value;
      
    // }
    var prodId = this.itemInfo.sgid.toString();
  // tslint:disable-next-line: max-line-length
  this.cMbService.addProdsToCart1(this.moodboardTypeId , [this.itemInfo.sgid.toString()], this.auth.getProfileInfo('userId'),this.variationid, prodId, moodboardQty,btnType,this.monthNums,null).subscribe(resp => {
  
    if (resp) {
      this.spinner.hide();
      this.toastr.success('Product added successfully to ' + this.moodbTypeName + '.');
    }
  });
}
  else{
    this.toastr.error("No moodboards avaliable");
  }
  }


  onItemChange(value) {
    this.isPublish =  value ;
 }

 onItemBuyUsedChange(value, type) {
   if(type === 'click' || type === 'load') {
     this.isbuyUsedPublish = value;
   } else {
     if(value === 0) {
      this.isbuyUsedPublish = 1
     } else {
       this.isbuyUsedPublish = 0
     }
   }
 }

 onSubmit(publishPlatform) {
  // this.spinner.show();
  if (publishPlatform === 'saffron') {
    this.item.published(this.prod_id, this.isPublish).subscribe(resp => {
      this.spinner.hide();
      if (resp) {
        if (this.isPublish === 0) {
          this.publishedToSaffron = 'No';
          this.toastr.success(this.messagesVal.PRODUCT_UNPUBLISHED);
        }
        if (this.isPublish === 1) {
            this.publishedToSaffron = 'Yes';
            this.toastr.success(this.messagesVal.PRODUCT_PUBLISHED);
        }
      }
    });
  } else {
    
      this.item.buyUsedPublished(this.prod_id, this.sku_variation_inhabitr, this.isbuyUsedPublish).subscribe(resp => {
        this.spinner.hide();
        
        if (resp) {
          if (this.isbuyUsedPublish === 0) {
            this.publishedToBuyUsed = 'No';
            this.toastr.success(this.messagesVal.PRODUCT_UNPUBLISHED);
            this.r()
          }
          if (this.isbuyUsedPublish === 1) {
              this.publishedToBuyUsed = 'Yes';
              this.updatedAtUsedFurniture = resp.updated_in_usedfurniture;
              this.toastr.success(this.messagesVal.PRODUCT_PUBLISHED);
              this.r()
          }
          this.onItemBuyUsedChange(this.isbuyUsedPublish, 'toggle')
        }
      });
    }
}

r(){
  window.location.reload();
}

onlyNumberKey(event) {
  return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
}

registerInOps(){
  this.item.registerInOps(this.itemInfo.sgid,this.variationid).subscribe(res => {
    if(!this.isOPsDb){
      this.toastr.success(this.messagesVal.SUCCESSFUL_REGISTER_OPS);
    }else{
      this.toastr.success(this.messagesVal.SUCCESSFUL_SYNC_OPS);
    }
    this.getItem(this.prod_id);
  });
}

updateRent(event) {
  this.monthNums = event.target.value;
  let temp = 36 - (this.monthNums);
  this.rentPrice = this.itemInfo?.variations[this.activeIndex]?.default_price[temp]?.rental_price;
  // if(this.monthNums == 1){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[11]?.rental_price;
  // }
  // else if(this.monthNums == 2){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[10]?.rental_price;
  // }
  // else if(this.monthNums == 3){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[9]?.rental_price;
  // }
  // else if(this.monthNums == 4){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[8]?.rental_price;
  // }
  // else if(this.monthNums == 5){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[7]?.rental_price;
  // }
  // else if(this.monthNums == 6){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[6]?.rental_price;
  // }
  // else if(this.monthNums == 7){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[5]?.rental_price;
  // }
  // else if(this.monthNums == 8){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[4]?.rental_price;
  // }
  // else if(this.monthNums == 9){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[3]?.rental_price;
  // }
  // else if(this.monthNums == 10){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[2]?.rental_price;
  // }
  // else if(this.monthNums == 11){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[1]?.rental_price;
  // }
  // else if(this.monthNums == 12){
  //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[0]?.rental_price;
  // }
}

getQuoteInventeryqty()
{
  this.item.getquoteInventoryqty(this.prod_id,this.sku_variation_inhabitr).subscribe(resp => {  
 this.AssignedtoquoteInv = resp.productQuoteCount;
  this.toastr.success(resp.message);
  
  })
  
}

createQuotesPopUp(createQuotes) {
  this.modalService.open(createQuotes, this.modalOptions2).result.then((result) => {
  }, (reason) => {
  });
 }

 createNewMoodboardPopUp(createMoodboard) {
  this.modalService.open(createMoodboard, this.modalOptions3).result.then((result) => {
  }, (reason) => {
  });
 }

  sumTotal(totData) {
    let invTotal: number;
    invTotal = 0;
    totData.forEach(tot => {
      if(tot.is_inhabitr_warehouse == 'Y' && tot.non_assigned_inv !== null) {
        invTotal += parseInt( tot.non_assigned_inv)
      }
    });
    
    return invTotal;
  }
  
  sumSUpplierTotal(sData) {
    let supTotal: number;
    supTotal = 0;
    sData.forEach(stot => {
      if(stot.is_inhabitr_warehouse == 'N' && stot.supplier_quantity !== null) {
        supTotal += parseInt( stot.supplier_quantity)
      }
    });

    return supTotal;
  }

  scroll(by: number) {
    this.scrollDiv?.nativeElement?.scrollBy(by, 0);
  }

    /**
   * Item changed
   * @param index number
   */  @Input() list: Array<any> = [];
     @Output() onChange = new EventEmitter();
     selectedIndex: number = 0;
     itemChanged(index: number) {
      this.selectedIndex = index;
      this.onChange.emit(this.list[index]);
    }
    openModal1(template1) {
      this.modalService.open(template1, this.modalOptions4).result.then((result) => {
      }, (reason) => {
      });
    }

    getMoodboardUserList(){
      this.cMbService.getMyMoodboards().subscribe(resp => {
        if (resp && !(resp.result == '')) {
          this.moodbTypes = resp.result;
          if(this.moodbTypes.length > 0) {
            this.ismoodboard = true;
            this.moodbTypeName = this.moodbTypes[0].boardname;
          this.moodboardTypeId = this.moodbTypes[0].sgid;
          } else{
            this.moodbTypeName = this.messagesVal.ERROR_NO_MOODBOARD_FOUND;
            this.moodboardTypeId = ''
          }
          
        } else {
          this.moodbTypeName = this.messagesVal.ERROR_NO_MOODBOARD_FOUND;
          this.moodboardTypeId = ''
          this.noDataFoundMoodboard = true;
        }
  
      }, error => this.errorMsg = error);
    }
    // sizeVariationValue(event:any){
    // this.selectedSize = event.target.value;
    // let value = this.sizeValues.find(x=>x.attribute_value==event.target.value);
    // this.getItem(this.prod_id,value?.sku_variation_id);

    // }
    variation_id:any
    sizeVariationValue(data:any){
      this.selectedSize = data?.attribute_value;
      this.variation_id = data?.sku_variation_id
     this.getItem(this.prod_id,data?.sku_variation_id);
    }
    decode(test){
      return decodeURIComponent(test)
    }

     serialize (obj) {
      var str = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    }
    
    imageLens(){
      let obj =  this.defaultImages[0]
      let params={
        image:obj.image_url.large,
        product_id:obj.sgid,
        variation_id:obj.sku_variation_id
      }
      let param = this.serialize(params)
      console.log(param);
      window.open(`/admin/products/imageLens?image=${obj.image_url.large}&product_id=${obj.sgid}&variation_id=${obj.sku_variation_id}`, '_blank');
      // window.open(`${window.origin}/admin/products/imageLens?${param}`,'_blank')
    }
    new_asset_price:any
    old_asset_price:any
    updated_date:any
    user_name:any
    old_user_name: any;
    old_updated_date:any

  getHistory(){ 
    this.old_asset_price = null;
    this.new_asset_price = null;
    this.updated_date =null;
    this.old_updated_date = null;
    this.user_name = null;
    this.old_user_name = null;
    let skId 
    console.log(this.skId);
    this.quoteservice.getHistryDetials(this.prod_id,this.skId,).subscribe(data =>{
      console.log(data);
    this.old_asset_price= data.result.old_asset_price
    this.new_asset_price= data.result.new_asset_price
    this.updated_date =data.result.updated_date
    this.old_updated_date = data.result.old_updated_date
    this.user_name = data.result.user_name
    this.old_user_name = data.result.old_updated_user_name
    })
  }

}
