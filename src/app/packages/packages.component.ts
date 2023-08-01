import { LocalStorageService } from './../services/local-storage/local-storage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../services/items.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { SearchService } from '../services/search.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit, OnDestroy {
  showMenu = false;
  page = 0;
  data = [];
  variations= [];
  start:any;
  count:any;
  names=[];
  packagetitle:any;
  resultArray:Array<any>=[];
  resultArray1:Array<any>=[]
  resultArray2:Array<any>=[];
  mySubscription: any;
  modalOptions: NgbModalOptions;
  closeResult: string;
  categoriestypes: any;
  warehouse: any;
  location: any;
  suppliers: any;
  priceRanges: any;
  selectedCategory: any = {};
  selectedSupplier: any = {};
  selectedWarehouse: any = {};
  selectedPriceRange: any = {};
  selectedCategoryId: any = '';
  selectedSupplierId: any = '';
  selectedWarehouseId: any = '';
  typeOfFilter: string;
  parameters = '';
  publishVal = '';
  modalVal = '';
  nodatafound = false;
  loggedUserInfo;
  isPublish: any;
  isUnpublish: any;
  isPublishOps: any;
  isUnpublishOps: any;
  urlParameter:any; 
  isLoadMore: boolean;
  

  constructor(
    private auth: AuthenticateService,
    private spinner: NgxSpinnerService,
    private shop: ItemsService,
    private route: Router,
    private actRoute: ActivatedRoute,
    private modalService: NgbModal,
    private searchSer: SearchService ,
    private toastr :ToastrService,
    private ls:LocalStorageService
  ) {
    this.modalOptions = {
      size: 'lg',
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true
    };
  }
  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.name.toUpperCase();
    const bandB = b.name.toUpperCase();
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }
  ngOnInit() {
    this.loggedUserInfo = this.ls.getFromLocal();
    //this.urlParameter = this.actRoute.snapshot.params.id;
    this.urlParameter = this.actRoute.snapshot.queryParamMap.get('publish');
    this.searchSer.setHeaserSearch(true);
    $('#waterfall').NewWaterfall({
      width: 200,
      delay: 60,
      repeatShow: false
    });
    // this.auth.currentMessage.subscribe(message => this.showMenu = message);
    // this.actRoute.queryParams.subscribe(params => {
    //   this.selectedCategory.name = params.categoryname ? params.categoryname : null;
    //   this.selectedSupplier.name = params.suppliername ? params.suppliername : null;
    //   this.selectedWarehouse.name = params.warehousename ? params.warehousename : null;
    //   this.selectedCategory.id = params.categoryid ? params.categoryid : null;
    //   this.selectedCategoryId = params.categoryid ? params.categoryid : null;
    //   this.selectedSupplier.id = params.supplierid ? params.supplierid : null;
    //   this.selectedSupplierId = params.supplierid ? params.supplierid : null;
    //   this.selectedWarehouse.id = params.warehouseid ? params.warehouseid : null;
    //   this.selectedWarehouseId = params.warehouseid ? params.warehouseid : null;
    // });
    // this.selectedSupplierId = this.ls.getItem('supplier_id');
    // this.parameters = '&category=' + this.selectedCategoryId + '&supplier=' + this.selectedSupplierId +
    //   '&warehouse=' + this.selectedWarehouseId;
    this.parameters = 'start=0' + '&count=12';
    this.getProducts();
    this.getCategories();
    // this.getSuppliers();
    // this.getWarehouse();
    // this.getLocation();
    // this.getPriceRange();
  }
  sortBy(val) {
    if (this.selectedCategoryId) {
      // tslint:disable-next-line: max-line-length
      this.route.navigate(['/admin/packages'], { queryParams: { publish: val, categoryname: this.selectedCategory.name, categoryid: this.selectedCategory.id } });
    } else {
      this.route.navigate(['/admin/packages'], { queryParams: { publish: val } });
    }
  }
  ngOnDestroy() {
    this.isLoadMore = false
    this.searchSer.setHeaserSearch(false);
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  open(content, type) {
    this.modalVal = type;
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  clearAll(type) {
    this.isLoadMore = false
    this.page = 0;
    this.data = [];
    this.variations = [];
    this.resultArray = [];
    this.resultArray1 = []
    this.resultArray2 =[];
    this.packagetitle = null;
    let queryParameter = {};
    queryParameter = {
      start : this.page,
      count : '12',
    };
    this.parameters = 'start=0' + '&count=12';
    this.route.navigate(['/admin/packages'], { queryParams: queryParameter });
    this.getProducts();
  
  }
  getCategories() {
    this.shop.getPackageCategories().subscribe(
      resp => {
        this.categoriestypes = resp.result;
      }, err => {
      }
    );
  }
  getPriceRange() {
    this.priceRanges = [
      {start: 0 , end : 50},
      {start: 50 , end : 100},
      {start: 100 , end : 150},
      {start: 150 , end : 200},
    ];
  }

  resetFilter(){
    this.isLoadMore = false
    this.page = 0;
    this.data = [];
    this.variations = [];
    this.resultArray = [];
    this.resultArray1 = []
    this.resultArray2 =[];
    this.isPublishOps='';
    this.isUnpublishOps = '';
    this.isPublish ='';
    this.isUnpublish = ''; 
    this.packagetitle = null;
    this.page = 0
    this.isPublish =null;
    this.isUnpublish = null; 
    this.selectedCategory = {};
    this.selectedCategoryId = '';
    this.selectedSupplier = {};
    this.selectedSupplierId = '';
    this.selectedWarehouse = {};
    this.selectedWarehouseId = '';
    this.parameters = '';
    this.getProducts();
  }
  filterItems(val, type) {
    this.isLoadMore = false
    this.page = 0;
    this.data = [];
    this.variations = [];
    this.resultArray = [];
    this.resultArray1 = []
    this.resultArray2 =[];
    this.isPublishOps='';
    this.isUnpublishOps = '';
    this.isPublish ='';
    this.isUnpublish = '';  
    if (type === 'All') {
      this.selectedCategory = {};
      this.selectedCategoryId = '';
      this.selectedSupplier = {};
      this.selectedSupplierId = '';
      this.selectedWarehouse = {};
      this.selectedWarehouseId = '';
      this.getProducts();
    } else {

      this.typeOfFilter = type;
      let queryParameter = {};

      if (type === 'room') {
          this.selectedCategory = val;
          this.selectedCategoryId = val.sgid;
          // this.params = '&idCategory=' + this.selectedCategoryId;

        }
        if(type === 'publish_to_saffron') {
          this.isPublish =1;
          this.isUnpublish = null; 

        }  if(type ==='unpublish_to_saffron') {
          this.isPublish =null;
          this.isUnpublish = 1;

        }

        // if(type === 'register_with_ops') {
        //   this.isPublishOps =1;
        //   this.isUnpublishOps = null; 

        // }  if(type ==='unregister_from_ops') {
        //   this.isPublishOps =null;
        //   this.isUnpublishOps = 1;
        // }
        // if(type === 'price'){
        //  this.selectedPriceRange.start = val.start;
        //  this.selectedPriceRange.end = val.end;
        // }

      queryParameter = {
          start : this.page,
          count : 12,
          category: this.selectedCategoryId ? this.selectedCategoryId : '',
        
        };
          this.packagetitle = val.name;
          this.parameters = 'start=' + this.page + '&count=' + queryParameter['count'] + '&category=' + queryParameter['category'] ;

          if(this.isPublish!= ''|| this.isUnpublish !='' ){
            this.parameters = this.parameters+'&is_publish=' + this.isPublish + '&is_unpublish='+ this.isUnpublish;

          }
          
          if(this.isPublishOps!= '' || this.isUnpublishOps!= '' ){
            this.parameters = this.parameters+'&is_publish_ops=' + this.isPublishOps + '&is_unpublish_ops='+ this.isUnpublishOps;

          }
        
      this.getProducts();

     // }
    }

  }
  getProducts() {
    this.spinner.show();
    // tslint:disable-next-line: max-line-length
    if(this.urlParameter=='true' ){
      this.parameters = this.parameters+'&is_publish=1&is_unpublish=null';
    }
    
    this.shop.getPackages(this.page, this.parameters, this.publishVal).subscribe((res: any) => 
    this.onSuccess(res) , 
    error => {
      this.spinner.hide();
      this.toastr.error('Error Occured.')
    });
  }
  /* onSuccess(res) {
    if (res !== undefined || res.result !== []) {
      this.spinner.hide();
      if (res.message === undefined) {
        res.result.forEach((item: any) => {
          this.data.push(item);
        });

      this.data.forEach(i=>{ 
         this.resultArray.push(
         {
          "name":i.name,
         });
      });
      for(let k =0 ; k< this.data.length; k++){
       let categoryname = this.data[k].category;
       this.resultArray1.push(categoryname);
      }

      for(let j =0 ; j< this.data.length; j++){
        let pricevalue = this.data[j];
        this.resultArray2.push(pricevalue);
       }
   
        for(let g=0;g<this.data.length;g++)
        {
          if(this.data[g].variations){
            for(let a=0;a<this.data[g].variations.default_images.length; a++){

              if(this.data[g].sgid == this.data[g].variations.package_id){
      
                let varilength=this.data[g].variations;
                let sgid=this.data[g].sgid
                let namelength = this.resultArray[g];
                let catlength = this.resultArray1[g];
                let pricelength = this.resultArray2[g];
                this.variations.push({varilength,namelength,catlength,pricelength,sgid})
                break;
              }
            }
          }else{
                let varilength=this.data[g].variations;
                let sgid=this.data[g].sgid
                let namelength = this.resultArray[g];
                let catlength = this.resultArray1[g];
                let pricelength = this.resultArray2[g];
                this.variations.push({varilength,namelength,catlength,pricelength,sgid})
          }
      
          
        
        }

      } else {
        this.nodatafound = true;
      }
    }else{
      this.spinner.hide();
      this.nodatafound = true;
    }
  } */

  onSuccess(res) {
    if (res !== undefined || res.result !== []) {
      this.spinner.hide();

      if(this.isLoadMore)
      {
        this.variations = []
      }
      if (res.message === undefined) {
        res.result.forEach((item: any) => {
          this.data.push(item);
        });

      this.data.forEach(i=>{ 
         this.resultArray.push(
         {
          "name":i.name,
         });
      });
      for(let k =0 ; k< this.data.length; k++){
       let categoryname = this.data[k].category;
       this.resultArray1.push(categoryname);
      }

      for(let j =0 ; j< this.data.length; j++){
        let pricevalue = this.data[j];
        this.resultArray2.push(pricevalue);
       }
   
        for(let g=0;g<this.data.length;g++)
        {
          if(this.data[g].variations){
            for(let a=0;a<this.data[g].variations.default_images.length; a++){

              if(this.data[g].sgid == this.data[g].variations.package_id){
      
                let varilength=this.data[g].variations;
                let sgid=this.data[g].sgid
                let namelength = this.resultArray[g];
                let catlength = this.resultArray1[g];
                let pricelength = this.resultArray2[g];
                this.variations.push({varilength,namelength,catlength,pricelength,sgid})
                break;
              }
            }
          }else{
                let varilength=this.data[g].variations;
                let sgid=this.data[g].sgid
                let namelength = this.resultArray[g];
                let catlength = this.resultArray1[g];
                let pricelength = this.resultArray2[g];
                this.variations.push({varilength,namelength,catlength,pricelength,sgid})
          }
      
          
        
        }

      } else {
        this.nodatafound = true;
      }
    }else{
      this.spinner.hide();
      this.nodatafound = true;
    }
  }

  
  onScroll() {
    this.isLoadMore = true
    this.page = this.page + 12;
    this.getProducts();
  }
}
