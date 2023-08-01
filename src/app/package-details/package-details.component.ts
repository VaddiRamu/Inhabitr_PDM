declare var $: any;
import { Subject } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../services/items.service';
import { AuthenticateService } from '../services/authenticate.service';
import { ScrollToTopService } from '../services/scroll-to-top.service';
import { CreateMoodboardService } from '../services/create-moodboard.service';
import { QuoteService } from '../services/quote.service';
import { Renderer2, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { messages } from '../messages/validation_messages';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent implements OnInit {

  changeRegisterInOpsSubject:Subject<string> = new Subject();
  registerInOpsButtonText:string="Register with OPS";
  url: string;
  success = false;
  error: string;
  itemInfo: any;
  includeitems= [];
  optionalItemsArray = [];
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
  displayImage: string;
  supplierName: string;
  supplierPrice: number;
  categoryname: string;
  inhabitrPrice: string;
  supplierAssetPrice: string;
  rentForMonth = 0;
  rentPrice = 0;
  warehouseLocation: string;
  quantity = 0;
  sourcetype: string;
  supplierSKU: string;
  inhabitrSKU: string;
  description: string;
  features: string;
  isPublish: any;
  shouldshow = false;
  editProduct = true;
  editInhabitrPrice = true;
  editProductBuyPrice = true;
  editProductName: string;
  editPrice: string;
  editBuyPrice: string;

  quoteTypes: any;
  quoteTypeName: string;
  quoteTypeId: string;
  floorTypes: any;
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
  messagesVal = {
    VALIDATION_PRODUCT_EMPTY: messages.VALIDATION_PRODUCT_EMPTY,
    SUCCESSFUL_PRODUCT_NAME: messages.SUCCESSFUL_PRODUCT_NAME,
    VALIDATION_PRICE_EMPTY: messages.VALIDATION_PRICE_EMPTY,
    SUCCESSFUL_PRICE_UPDATED: messages.SUCCESSFUL_PRICE_UPDATED,
    SUCCESSFUL_BUYPRICE_UPDATED: messages.SUCCESSFUL_BUYPRICE_UPDATED,
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
  buyusedprice: any;
  publishedToSaffron: string;

  productInfo: any = {};
  prod_id: string;
  productCategoryList = [];
  inhabitrWarehouseList: {}[];
  selectedWarehouseIds: string[];
  modalVal = '';
  monthNums = 12;
  marked = false;
  theCheckbox = false;
  selectedCategory: any;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private item: ItemsService,
    private auth: AuthenticateService,
    private stp: ScrollToTopService,
    private cMbService: CreateMoodboardService,
    private render: Renderer2,
    private el: ElementRef,
    private quoteservice: QuoteService,
    private toastr: ToastrService
    ) { }

    ngOnInit() {
      this.getWarehouseList();
      this.getProductCategoryList();
      this.spinner.show();
      this.changeRegisterInOpsSubject.subscribe(buttonText=>{
        this.registerInOpsButtonText = buttonText;
      });
      this.moodbTypeName = this.messagesVal.FETCHING;
      this.noDataFoundMoodboard = false;
  
      this.cMbService.getMyMoodboards().subscribe(resp => {
        if (resp && !(resp.result === [])) {
          this.moodbTypes = resp.result;
          if(this.moodbTypes.length>0) {
            this.moodbTypeName = this.moodbTypes[0].boardname;
          this.moodboardTypeId = this.moodbTypes[0].sgid;
          } else{
            this.moodbTypeName = this.messagesVal.ERROR_NO_MOODBOARD_FOUND;
          }
          
        } else {
          this.moodbTypeName = this.messagesVal.ERROR_NO_MOODBOARD_FOUND;
          this.moodboardTypeId = this.messagesVal.NOT_FOUND;
          this.noDataFoundMoodboard = true;
        }
  
      }, error => this.errorMsg = error);
      this.auth.currentMessage.subscribe(message => this.showMenu = message);
      this.route.paramMap.subscribe((params) => {
        this.prod_id = params.get('id');
        this.getItem(params.get('id'));
      });
      this.stp.setScrollTop();
  
      this.getQuotes();
      // this.getUnits();
    }

  showEditTitle() {
    this.editTitle = !this.editTitle;
  }

  getPercentageValue(price, percentage) {
    const result = (parseFloat(price) * parseFloat(percentage)) / 100;
    return result;
  }

  getItem(id) {
    this.spinner.show();
    this.item.getPackageItem(id).subscribe(
      resp => {
        this.spinner.hide();
        this.itemInfo = resp.result;
         if(this.itemInfo.variations&&this.itemInfo.variations.is_ops_db===true){
           this.changeRegisterInOpsSubject.next("Update With Ops");
         }
        this.variationImages = this.itemInfo.variations;
        // tslint:disable-next-line: max-line-length
        // this.inhabitrPrice = parseFloat(this.itemInfo.salePrice) + this.getPercentageValue(this.itemInfo.salePrice, this.inhabitrPercentage);
        this.setDetails(this.itemInfo.sgid);
        if (this.itemInfo.features) {
          this.features = this.itemInfo.features.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '');

        }
        if (this.itemInfo.category.description) {
          this.description = this.itemInfo.category.description.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '');
        }

      }, err => {
        this.spinner.hide();
      });
  }

  setDetails(index) {
    this.productName = this.itemInfo.name;
    this.categoryname = this.itemInfo.category.category_name;
    this.supplierName = this.itemInfo.included_items[0].product.product_sku_variation_price_details[0].supplier_name
    this.publishedToSaffron = this.itemInfo.included_items[0].product.is_publish_saffron ? 'Yes' : 'No';
    this.updatedAt = this.itemInfo.updated_at;
    this.buyusedprice = this.itemInfo.included_items[0].product.product_sku_variation_price_details[0].buyUsedPrice;
    // this.warehouseLocation=
    if(this.itemInfo.package_variations[0].images[0].package_id == index){
      this.displayImage = this.itemInfo.package_variations[0].images[0].image_url.large
    }
    if(this.itemInfo.sgid == index){
      this.inhabitrPrice = this.itemInfo.pricing_asset_value;
    }
    if(this.itemInfo.sgid == index){
      this.supplierSKU = this.itemInfo.package_variations[0].sku;
    }
   if(this.itemInfo.sgid == index){
      this.inhabitrSKU = this.itemInfo.sku;
    }
    if(this.itemInfo.sgid== index){
      this.sourcetype = this.itemInfo.included_items[0].product.source
    }

    if(this.itemInfo.included_items !== null)
    {
      for(let i=0; i<this.itemInfo.included_items.length; i++){
        if(this.itemInfo.included_items[i].product.product_sku_variation_price_details[0].default_images.length !== 0){
      let varilength=this.itemInfo.included_items[i].product.product_sku_variation_price_details[0].default_images[0].image_url;
        }
      }
    }else{

    }

    if(this.itemInfo.optional_items !== null)
    {
      for(let i=0; i<this.itemInfo.optional_items.length; i++){
        if(this.itemInfo.optional_items[i].product.product_sku_variation_price_details[0].default_images.length !== 0){
      let optionlength=this.itemInfo.optional_items[i].product.product_sku_variation_price_details[0].default_images[0].image_url;
        }
      }
    }else{

    }
    if(this.itemInfo.sgid == index){
      this.buyPrice = this.itemInfo.buy_new_price
    }
    if(this.itemInfo.sgid == index){
      this.rentPrice = this.itemInfo.package_variations[0].price[11].rental_price
    }
    
    // if(this.itemInfo.sgid == index){
    //   this.supplierPrice = this.itemInfo.pricing_asset_value;
    // }
     // this.rentPrice = this.itemInfo?.variations[index]?.default_price[0]?.rental_price;
    // this.buyPrice = this.itemInfo?.variations[index]?.buyPrice; // this.rentPrice = this.itemInfo?.variations[index]?.default_price[0]?.rental_price;
    // this.buyPrice = this.itemInfo?.variations[index]?.buyPrice;
    
    // this.displayImage = this.itemInfo?.variations[index]?.default_images[0]?.image_url.large;
    // this.inhabitrSKU = this.itemInfo.variations[index].sku;
    // this.source = this.itemInfo?.source;
    // this.isOPsDb = this.itemInfo?.variations[index].is_ops_db

    
    // this.editProductName = this.itemInfo?.name;
    
    
    // this.supplierPrice = this.itemInfo?.variations[index]?.orginal_price;
    
    // this.editPrice = this.itemInfo?.variations[index]?.asset_value;
    // this.rentForMonth = this.itemInfo?.variations[index]?.default_price[0]?.month;
    // this.rentPrice = this.itemInfo?.variations[index]?.default_price[0]?.rental_price;
    // this.buyPrice = this.itemInfo?.variations[index]?.buyPrice;
    // this.editBuyPrice = this.itemInfo?.variations[index]?.buyPrice;
    // this.updatedAt = this.itemInfo?.updated_at;
    // this.publishedToSaffron = this.itemInfo?.is_publish_saffron ? 'Yes' : 'No';
    // if(this.itemInfo?.variations[index]?.supplier.source == "EDI"){
    //   this.quantity = this.itemInfo?.variations[index]?.no_warehouse_location.quantity;
    // }else{
    //   this.quantity = this.itemInfo?.variations[index]?.is_inventory_qty;
    // }
    // this.quantity = this.itemInfo?.variations[index]?.is_inventory_qty;
    // this.sourcetype = this.itemInfo?.source; // source type not there source_type
    
    // this.supplierSKU = this.itemInfo?.supplier_sku; // not htere
    // thsi logic got implement  yeasyterday, no idea baout this 
    // if((this.itemInfo?.variations[index]?.supplier.is_bookmarklet == true) ||){
    //   this.inhabitrSKU = '-';
    // }else{
    //   this.inhabitrSKU = this.itemInfo?.variations[index]?.sku;
    // }

    // if(this.source.toLowerCase() === 'ops dashboard') {
    //   this.supplierAssetPrice = null;
    //   this.inhabitrPrice = this.itemInfo?.variations[index]?.asset_value;

    // } else if(this.source.toLowerCase() === 'api'|| this.source.toLowerCase() === 'edi') {
    //   this.supplierAssetPrice = this.itemInfo?.variations[index]?.asset_value;
    // this.inhabitrPrice =null;
    // if(this.isOPsDb ){
    //   this.inhabitrPrice = this.itemInfo?.variations[index]?.asset_value;

    // }
    // this.rentPrice = this.itemInfo?.variations[index]?.rental_price;

    // }
    // // my logic as per yeastre disscuion about SKU visibility
    // if((this.source.toLowerCase() === 'ops dashboard') || (this.isOPsDb=== true &&(this.source.toLowerCase() === 'api'|| this.source.toLowerCase() === 'edi'))) {
    //   this.inhabitrSKU = this.itemInfo?.variations[index]?.sku;
    // } else {
    //   this.inhabitrSKU = '-';
    // }
    // this.inhabitrSKU = this.itemInfo?.variations[index]?.sku;
    // this.isPublish = this.itemInfo?.status;
    // if(this.itemInfo?.variations[index]?.supplier.source == "EDI"){
    //   this.warehouseLocation = this.itemInfo?.variations[index]?.no_warehouse_location.warehouse_name;
    // } else{
    //   if(this.itemInfo?.variations[index]?.warehouse_location == null){
    //     this.warehouseLocation = '-';
    //   }else{
    //     this.warehouseLocation = this.itemInfo?.variations[index]?.warehouse_location.warehouse_name;
    //   }

    // }
    
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
  }

  activeImage(image) {
    this.spinner.show();
    // alert("active image Clicked");
    this.displayImage = image;
    this.spinner.hide();
    // this.shouldshow = false;

    //  this.el.nativeElement.querySelector('.img-thumbnail').classList.remove("selected");
    //    this.render.addClass($event.target, 'selected');
    // this.setDetails(index);

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
  this.item.updateProductCategoryName(this.prod_id, category.sgid).subscribe((resp)=>{
    if(resp.statusCode === 200){
      this.toastr.success(this.messagesVal.CATEGORY_UPDATED_SUCCESSFULLY);
      this.getItem(this.prod_id);
    }
  })
}

  getQuotes() {
    this.quoteTypeName = this.messagesVal.FETCHING;
    this.noDataFoundQuotes = false;
    this.quoteservice.getQuotes().subscribe(resp => {
      if (resp.statusCode === 200) {
        if (resp.quote && resp.quote.length) {
          this.quoteTypes = resp.quote;
          this.quoteTypeName = this.quoteTypes[0].name;
          this.quoteTypeId = this.quoteTypes[0].sgid;
        } else {
          this.quoteTypeName = this.messagesVal.ERROR_QUOTES_FOUND;
          this.quoteTypeId = this.messagesVal.NOT_FOUND;
          this.noDataFoundQuotes = true;
        }
      } else {
        this.moodbTypeName = this.messagesVal.ERROR_QUOTES_FOUND;
      }
    }, error => {} );
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
      let obj = {floorplan_id : this.floorTypeId, quote_id:this.quoteTypeId,product_id:this.itemInfo.sgid,user_id:this.auth.getProfileInfo('userId'), units:unitsarray}
  
      this.quoteservice.addProductToFloorPlan(obj).subscribe(resp=>{
        if (resp.statusCode === 200) {
          this.toastr.success(this.messagesVal.PRODUCT_FLOOR_PLAN);
        }
      }, error => {} )
    }

    updateInOps() {
    }

    addwithoutFloorPlanUnits(){

      // floorplan_id,quote_id,moodboard_id,units(array format) ex [1,2,3]
      /* let unitsarray = [];
      this.unitWOPlans.forEach(elem  => {
          unitsarray.push(elem.sgid);
      }) */
  
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
  
      let obj = { quote_id:this.quoteTypeId,product_id:this.itemInfo.sgid,user_id:this.auth.getProfileInfo('userId'), units:unitsarray}
  
      this.quoteservice.addProductToFloorPlan(obj).subscribe(resp=>{
        if(resp.statusCode === 200){
          this.toastr.success(this.messagesVal.PRODUCT_ADDED_UNIT);
        }
      },error=>{}) 
  
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
        if (resp.statusCode === 200) {
          if (resp.result.length == 0) 
          {

          } else{
            this.floorTypes = resp.result;
            this.floorTypeName=resp.result[0].floorname;
            this.floorTypeId = resp.result[0].sgid;
            this.loadfpUnits(resp.result[0].sgid,this.quoteTypeId);
            //getFloorplanUnits(planId, quoteid ){
          }
        } else { }
      }, error => {} )
    }

isAllUnit(bool) {
  if (bool) {
 this.isSelectedAll = true;
 this.fpUnitList.forEach(elem  => {
   elem.isActive = true;
 })
  }else{
   this.isSelectedAll = false;
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
  }
 }


  loadfpUnits(fpid,qid){
    this.quoteservice.getFloorplanUnits(fpid , qid).subscribe(resp=>{
     if(resp.statusCode === 200){
       this.fpUnitList = resp.result;
  
       this.fpUnitList.forEach(elem => {
        elem.isActive = false;
        })
  
      }
    },error=>{});
   }

   
selectQuoteType(quoteType) {
  this.quoteTypeName = quoteType.name;
  this.quoteTypeId = quoteType.sgid;
  this.modalTitle = this.quoteTypeName;
}

selectFloorType(floorType){
  this.floorTypeName = floorType.floorname;
  this.floorTypeId = floorType.sgid;
  this.loadfpUnits(this.floorTypeId ,this.quoteTypeId);
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
    this.spinner.show();
    // tslint:disable-next-line: max-line-length
    this.cMbService.addProdsToCart(this.moodboardTypeId , [this.itemInfo.sgid.toString()], this.auth.getProfileInfo('userId')).subscribe(resp => {
    
      if (resp) {
        this.spinner.hide();
        this.toastr.success('Product added successfully to ' + this.moodbTypeName + '.');
      }
    });
  }


  onItemChange(value){
    this.isPublish =  value ;
 }

 onSubmit() {
  this.spinner.show();
  alert("clicked");
  this.item.publishedpackage(this.prod_id, this.isPublish).subscribe(resp => {
    if (resp) {
     this.spinner.hide();
     if (this.isPublish === 0) {
      this.toastr.success(this.messagesVal.PRODUCT_UNPUBLISHED);
     }
     if (this.isPublish === 1) {
        this.toastr.success(this.messagesVal.PRODUCT_PUBLISHED);
     }
    }
 });
}

onlyNumberKey(event) {
  return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
}

registerInOps(){
  this.item.registerInOps(this.itemInfo.sgid,this.inhabitrSKU).subscribe(res=>{
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
    // this.rentPrice = this.itemInfo.package_variations[0].price[event.target.value - 1].rental_price;
  if(this.monthNums == 12){
    this.rentPrice = this.itemInfo.package_variations[0].price[11].rental_price;
  }
  else if(this.monthNums == 11){
    this.rentPrice = this.itemInfo.package_variations[0].price[10].rental_price;
  }
  else if(this.monthNums == 10){
    this.rentPrice = this.itemInfo.package_variations[0].price[9].rental_price;
  }
  else if(this.monthNums == 9){
    this.rentPrice = this.itemInfo.package_variations[0].price[8].rental_price;
  }
  else if(this.monthNums == 8){
    this.rentPrice = this.itemInfo.package_variations[0].price[7].rental_price;
  }
  else if(this.monthNums == 7){
    this.rentPrice = this.itemInfo.package_variations[0].price[6].rental_price;
  }
  else if(this.monthNums == 6){
    this.rentPrice = this.itemInfo.package_variations[0].price[5].rental_price;
  }
  else if(this.monthNums == 5){
    this.rentPrice = this.itemInfo.package_variations[0].price[4].rental_price;
  }
  else if(this.monthNums == 4){
    this.rentPrice = this.itemInfo.package_variations[0].price[3].rental_price;
  }
  else if(this.monthNums == 3){
    this.rentPrice = this.itemInfo.package_variations[0].price[2].rental_price;
  }
  else if(this.monthNums == 2){
    this.rentPrice = this.itemInfo.package_variations[0].price[1].rental_price;
  }
  else if(this.monthNums == 1){
    this.rentPrice = this.itemInfo.package_variations[0].price[0].rental_price;
  }
}
}
