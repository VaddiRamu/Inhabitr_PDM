import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AuthenticateService } from '../../services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from '../../services/items.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { CreateMoodboardService } from '../../services/create-moodboard.service';
import { QuoteService } from '../../services/quote.service';
import {Location} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PdfGenerationService } from './pdf-generation.service';
import { messages } from '../../messages/validation_messages';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Options } from 'ng5-slider';
import { SharedService } from '../../services/shared.service';
declare var $: any;




@Component({
  selector: 'app-moodboard-details',
  templateUrl: './moodboard-details.component.html',
  styleUrls: ['./moodboard-details.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MoodboardDetailsComponent implements OnInit {
  attributesLists: any = [];
  objattr = {};
  namesattr: any;
  selectedattributelist: any = [];
  selctedattributename: any = [];
  attributenames: any;
  attributeList: any[];
  attrselected: boolean = false;
  categorySel: boolean = false;
  wareCategory: boolean = false;
  catSel: boolean = false;
  catSelWareHouse: boolean = false;
  catSelSupplier: boolean = false;
  warehouseLocations = [];
  monthNums = 12;
  monthNums1 = 12;
  itemInfo: any;
  productName: string;
  productId;
  attribute: any;
  multipleskuattribute: any = '';
  displayImage: string;
  selectedVariationImages: string;
  variationImages: any;
  supplierName: string;
  supplierPrice: number;
  categoryname: string;
  isPublish: any;
  shouldshow = false;
  editProduct = true;
  editProductName: string;
  editPrice: string;
  inhabitrPrice: string;
  buyPrice: any;
  buyUsedPrice: any;
  rentForMonth = 0;
  rentPrice = 0;
  warehouseLocation: string;
  quantity = 0;
  SupplierInv = 0;
  invQuantity = 0;
  TotalInv = 0;
  AssignedInv = 0;
  UnassignedInv = 0;
  AssignedtoquoteInv = 0;
  B2bstorage = 0;
  TotalAssetPrice = 0;
  prod_id: any;
  moodboardcounts = [];
  prodmd_id: any;
  Priduct_id: any;
  moodboard_id: any;
  is_inventoryCount = 0;
  moodboard_count = 0;
  supplierAssetPrice: string;
  sourcetype: string;
  supplierSKU: string;
  inhabitrSKU: string;
  sku_variation_inhabitr: string;
  variationsgid: any;
  description: string;
  features: string;
  moodboardForm;
  createMoodboardForm;
  moodbTypeName: string;
  moodbTypes: any;
  showAuth = false;
  errorMsg: string;
  parameters: any;
  modalOptions: NgbModalOptions;
  modalOptions3: NgbModalOptions;
  modalOptions1: NgbModalOptions;
  moodboardTypeId: string;
  whName: string;
  whId: string;
  start = 0;
  count = 12;
  productid: any;
  supplierFileterID = [];
  supplierFileterName = [];
  userInfo = {
    userId: ''
  };
  loggedUserInfo;
  isPublishOps: any;
  isUnpublishOps: any;
  isUnpublish: any;
  isOPsDb: any;
  pricevalueslist: any = ['$0', '$200', '$400', '$600', '$800', '$1000', '$2000', '$5000'];
  selectedminval: number = 0;
  selectedmaxval: number = 0;
  isfilterenable = false;
  supplierPartnerFlag = false;
  onlyWarehouseFlag = true;
  prvsSelectedSupplierId: any;
  selectedCategoryList: any;
  categoryIds = [];
  displayFilterNames = [];
  displayFilterList = [];
  productData: any;
  isFilterFlag = false;
  selections = [];
  names = [];
  selectedCategoryIds: string[][];
  selectedSupplierIds: string[][];
  selectedWarehouseIds: string[][];
  imagePDFData = [];
  selectedCategoryids: string;
  selectedSupplierids: string;
  selectedWarehouseids: string;
  mood_inv: any = 1;
  categoryList: any[];
  SgId: any;
  moodbTypess:any
  selectedData: any;
  supplierList: any[];
  warehouseList: any;
  selectedType: any;
  selectedProductFilters1: any[];
  selectedPriceRangeStartVals: string;
  selectedPriceRangeEndVals: string;
  priceRangesList: any;
  supplierPartnerList: any[];
  isLoadMore: boolean;
  publishStatus: any;
  existParameters = '';
  reset_minValue: number = 0;
  reset_maxValue: number = 5000;
  reset_boolean = false;
  minValue: number = 0;
  isadd: any = false;
  maxValue: number = 5000;
  value=100
  options: Options = {
    floor: 0,
    ceil: 500
  };
  isSupplier: boolean = false;
  isWare: boolean = false;
  skunumber;
  skunumberarray = 0;
  searchproduct: any;
  startvalue = 0;
  moodboardname;
  assetfilterstatus = true;
  activeIndex: any;

  assetInvStatus = true;
  selectedminvalInv = '';
  selectedmaxvalInv = '';
  steps = [{label: 'Tutti', value: 0}, {label:'Visibili', value:1}, {label:'Non visibili', value:2}];
  mbId: any;
  newLoader:any;
  isLocation: boolean;
  locationList:any =[];
  selectedLocationIds: string[][];
  newLoaderMoreButton: any;
  varIndex: any;
  defaultImages: any;
  MoodboardPublic:any;
  isMoreProducts: boolean;
  isLoading: any;
  PublicHistoryList=[];
  publicHistoryResultTable: any;
  showMoodBoard='myMoodboard';
  disMsg: any;
  firstName: any;
  lastName: any;
 
  // options: Options = {
  //   showTicks: true,
  //   showTicksValues: true,
  //   stepsArray: this.steps.map((s): CustomStepDefinition => {
  //     return { value: s.value };
  //   }),
  //   translate: (value: number, label: LabelType): string => {
  //     return this.indexToLetter(value);
  //   }
  // };

  indexToLetter(index: number): string {
    return this.steps[index].label;
  }
  invMinVal = 0;
  invMaxVal = 0;
  invValType = '';
  isInv = false;
  isinvType = false;
  inventoryAttr = [
    { name: 'inhabitr', selected: false, DisplayName: 'Inhabitr Inv', disable: false },
    { name: 'supplier', selected: false, DisplayName: 'Supplier Inv', disable: false },
    { name: 'all', selected: false, DisplayName: 'Either Inhabitr Inv OR Supplier Inv', disable: false },
    { name: 'both', selected: false, DisplayName: 'Both Inhabitr Inv AND Supplier Inv', disable: false }
  ];
  invTypeArr = [];
  modalOptions2: NgbModalOptions;
  totalQtyOfSku = 0;
  totalInv = 0;

  stateList = []
  selectedState;
  addCompany = false;
  companyList = [];

  floorPlanName = "";
  search = "";
  floorTypesList = []
  selectedFloorPlanType = "";
  selectedFloorPlanTypeId ="";
  floorPlanUnit = "";

  floorPlanList = [];
  selectedFloorPlan = "";
  selectedFloorPlanId = "";
  constructor(private auth: AuthenticateService,
    private cMbService: CreateMoodboardService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private shop: ItemsService,
    private route: Router,
    private rte: ActivatedRoute,
    private toastr: ToastrService,
    private mbs: CreateMoodboardService,
    private pdfservice: PdfGenerationService,
    private ls: LocalStorageService,
    private quoteservice: QuoteService, private item: ItemsService, private sharedService: SharedService,
    private _location: Location
 ) {
  this.firstName = auth.getProfileInfo('firstName')
  this.lastName = auth.getProfileInfo('lastName')
   this.mbId =  this.rte.snapshot.paramMap.get('id');
    this.modalOptions = {
      size: 'xl',
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,
      windowClass: 'moodboardPopup'
    };
    this.modalOptions1 = {
      size: 'xl',
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,
      windowClass: 'moodboardPopup'
    };
    this.modalOptions2 = {
      size: 'lg',
      // backdrop: 'static',
      backdropClass: 'product-details-modal',
      centered: true,
      windowClass: 'createQuotes'
    };
    this.modalOptions3 = {
      size: 'md',
      // backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true
    };
    this.quoteservice.getModalClose().subscribe(res=>{
      this.modalService.dismissAll();
      this.getQuotes(this.mbId)
    })
    this.getMoodBoardDetails(this.mbId);
  }
  addProject = false;
  projectList: any = [];
  showMenu = false;
  showCreateForm = false;
  showStudio = false;
  showBoards = true;
  listQuote = false;
  moodboardTypes: any;
  hideOnPrint = false;
  quoteTypes: any;
  isquote = false;
  quoteTypeName: string;
  quoteTypeId: string;
  floorTypes: any;
  isfp = false;
  floorTypeName: string;
  floorTypeId: string;
  modalTitle: string;
  fpUnitList: any;
  updateOps: any;

  isFloorPlan = false;
  isUnitTab = false;

  isSelectedAll = true;
  isUnitSelectedAll = true;


  page = 0;
  data = [];
  closeResult: string;
  categories: any;
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
  selectedLocation: any = '';
  typeOfFilter: string;
  noInventorySelected;
  commonQty = 1;
  publishVal = '';
  modalVal = '';
  selectedCompany: any = {};
  newName = '';
  private canvas: any;
  selected: any;
  showMBForm = false;
  moodboardDetails: any;
  selectedProductIds = [];
  selectedProducts = [];
  unitWOPlans = [];
  nodatafoundUnit: boolean;
  quotesNodataFound: boolean;
  filteredData = [];
  filterSelections: { type: string; names: string[]; selections: string[] }[] = [];
  types = [];
  spIds = [];
  finalFilterList = [];
  selectedPriceRangeStart = [];
  selectedPriceRangeEnd = [];
  selectedPriceRangeList = [];
  currentPage: string = 'moodboards';
  InventorySelected: any ='prod_name';
  coasterLogo = '../assets/images/coaster-logo.png';
  noInventoryAttr = [
    {name: 'Product Name', value: 'ProductsName'},
    {name: 'Supplier SKU', value: 'SupplierSKU'},
    {name: 'Inhabitr SKU', value: 'InhabitrSKU'},
  ];
  moodbTypesImg = [{
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
    value: 'Dining',
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

  btnType12:string ='';
 
  onChangeState(item) {
    this.getCityList(item.sgid)
  }

  onChangeOf(event:any){
    this.InventorySelected =event
   }

   /** Add Floor Plan */
   getQuotes(update?) {
    // this.quoteTypeName = messages.FETCHING;
    this.quotesNodataFound = false;
    this.quoteservice.getQuotes('', '').subscribe(resp => {
      this.quoteTypes = [];
      if (resp.statusCode === 200) {
        if (resp.quote && resp.quote.length) {
          this.quoteTypes = resp.quote;
          if (this.quoteTypes.length > 0) {
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
          this.quoteTypeName = messages.ERROR_QUOTES_FOUND;
          this.quoteTypeId = messages.NOT_FOUND;
          this.quotesNodataFound = true;
        }
      } else {
        this.quoteTypeName = '';
        this.quoteTypeId = messages.ERROR_QUOTES_FOUND;
        this.quotesNodataFound = true;
      }

    }, error => { });


  }

  selectQuoteType(quoteType) {
    this.quoteTypeName = quoteType.name;
    this.quoteTypeId = quoteType.sgid;
    this.modalTitle = this.quoteTypeName;
    this.getFloorPlans()
  }

  loadfpUnits(fpid, qid) {
    this.quoteservice.getFloorplanUnits(fpid, qid).subscribe(resp => {
      if (resp.statusCode === 200) {
        this.fpUnitList = resp.result;

        this.fpUnitList.forEach(elem => {
          elem.isActive = false;
        });

      }
    }, error => { });
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



   /** Add Floor Plan */

  getStateList() {
    this.sharedService.getStates().subscribe(list => {
      this.stateList = list;
    }, () => {
      this.stateList = []
    })
  }

  onclick(){
    location.reload()
  }

  getCityList(state_id) {

  }
  getProjectListMD(compid: any){
    this.cMbService.getProjectListMD(compid).subscribe(list=> {
      if(typeof list == 'string') this.projectList = [];
      else this.projectList = list;
    });
}
toggleAddButtonProject(){
  this.addProject = !this.addProject;
  if(this.addProject){
    this.moodboardForm.patchValue({project_name:'',project_id:0});
  } else {
    this.moodboardForm.patchValue({project_id:0,project_name:''})
  }
}

  getCompanyListByUserMD() {
    let cmp = this.ls.getFromLocal()?.company_name ?? '';
    this.sharedService.getCompanyList('?company_type=moodboard').subscribe(list => {
      this.companyList = list;
      let companyId = list.find(x=> x.company == cmp)?.sgid;
      this.selectedCompany = list.find(x=> x.company == cmp);
      if(companyId){
//        this.moodboardForm.patchValue({company_name: this.selectedCompany.company});
        this.getProjectListMD(companyId)
      }

    })
  }

  selectCompany() {
    if (!this.addCompany) {
      this.createMoodboardForm.patchValue({ newCompanyName: 'test' })
    } else {
      this.createMoodboardForm.patchValue({ newCompanyName: '' })
    }
  }
  onChangeCompany(){
    if (!this.addCompany) {
      this.moodboardForm.patchValue({ newCompanyName: 'test' })
    } else {
      this.moodboardForm.patchValue({ newCompanyName: '' })
    }
  }

  toggleAddButton() {
    this.addCompany = !this.addCompany;
    if (this.addCompany) {
      this.createMoodboardForm.patchValue({ newCompanyName: '', company_name: 'test' });

    } else {
      this.createMoodboardForm.patchValue({ company_name: '', newCompanyName: 'test' })
    }
  }
  onToggleAddButton(){
    this.addCompany = !this.addCompany;
    if (this.addCompany) {
      this.moodboardForm.patchValue({ newCompanyName: '', company_name: 'test' });

    } else {
      this.moodboardForm.patchValue({ company_name: '', newCompanyName: 'test' })
    }
  }


  saveBoard() {
    this.spinner.show();
    // tslint:disable-next-line: max-line-length
    this.mbs.addProdsToCart(this.moodboardDetails.moodboard.sgid, this.selectedProductIds, this.auth.getProfileInfo('userId')).subscribe(resp => {
      this.spinner.hide();
      this.moodboardDetails = resp;
      // this.monthNums1 = this.moodboardDetails?.moodboard_items[0].months

    }, error => {
      this.spinner.hide();
      this.toastr.error('Error Occured.');
    });
  }
  resetPrice() {
    this.minValue = 0;
    this.maxValue = 5000;
  }
  getQuote() {
    this.listQuote = !this.listQuote;
    if (this.listQuote) {
      document.getElementById('mainTable').style.display = 'block';
    } else {
      document.getElementById('mainTable').style.display = 'none';
    }

  }

  generateImagePDFData(moodboard_items) {
    this.imagePDFData = [];
    for (let i = 0; i < moodboard_items.length; i++) {
      let cleanText = '';
      if(moodboard_items[i].variation.product.features != null )
       cleanText = moodboard_items[i].variation.product.features.replace(/<\/?[^>]+(>|$)/g, "");
      if (i % 4 == 0) {
        let rows = [];
        rows.push({image: moodboard_items[i].imagee, name: moodboard_items[i].name,  desc: moodboard_items[i].description
          , dimension:moodboard_items[i].variation.dimension, feature:cleanText
        });
        this.imagePDFData.push(rows);
      } else {
        this.imagePDFData[this.imagePDFData.length - 1].push({image: moodboard_items[i].imagee, name: moodboard_items[i].name,  desc: moodboard_items[i].description , dimension:moodboard_items[i].variation.dimension, feature:cleanText});
      }
    }
  }

  buycalLater(mi, ma) {
    this.reset_boolean = false;

    // localStorage.setItem('price_slider_start', mi);
    // localStorage.setItem('price_slider_end', ma);
    this.getPriceRangeList({ start: mi, end: ma, selected: false }, 'price');
  }


  inventInit() {
    this.selectedminvalInv = JSON.parse(localStorage.getItem('inv_slider_start')) ? JSON.parse(localStorage.getItem('inv_slider_start')) : '';
    this.selectedmaxvalInv = JSON.parse(localStorage.getItem('inv_slider_end')) ? JSON.parse(localStorage.getItem('inv_slider_end')) : '';
    this.invTypeArr = JSON.parse(localStorage.getItem('invTypeArray')) ? JSON.parse(localStorage.getItem('invTypeArray')) : this.invTypeArr;

    if (this.invTypeArr.length > 0) {

      if (this.invTypeArr.length > 1) {
        this.inventoryAttr.forEach((ele, index) => {
          //if (this.invTypeArr.includes(ele.name)) {
          ele.selected = true
          /* if(ele.name !== 'all')
            ele.disable = true */
          //}
        });
      } else {
        this.inventoryAttr.forEach((ele, index) => {
          if (this.invTypeArr.includes(ele.name)) {
            ele.selected = true
          } else {
            ele.selected = false
          }
        });
      }

      this.isinvType = true;
      this.invValType = this.invTypeArr.join();
      localStorage.setItem('inv_slider_type', this.invTypeArr.join());
    }

    if (this.selectedminvalInv != '') {
      this.isInv = true;

      this.invMinVal = Number(this.selectedminvalInv);
      // this.invMaxVal = Number(this.selectedmaxvalInv);
      localStorage.setItem('inv_slider_start', this.selectedminvalInv);
      // localStorage.setItem('inv_slider_end', this.selectedmaxvalInv);
    }
  }
  selectProject(item){
    if(!this.addProject){
      let project = this.projectList.find(x=> x.sgid == item.target.value);
      this.moodboardForm.patchValue({project_id:item.target.value, project_name:project?.project || ''})
    } else {
      this.moodboardForm.patchValue({project_name:''})
    }
  }
  ngOnInit() {
    this.newLoader=true;
    this.searchMoodBoardList()
    this.currentPage = this.route.url;
    localStorage.setItem('currentPage', this.currentPage);
    if(this.currentPage != 'products'){
      localStorage.removeItem('parameters')
      this.resetFilter()
    }
    if (localStorage.getItem('noInventoryFilter')) {
      this.noInventorySelected = this.sharedService.getNoInventoryString(localStorage.getItem('noInventoryFilter'));
    }
    this.inventInit();
    this.loggedUserInfo = this.ls.getFromLocal();

   
    
    if (this.isinvType && this.isInv) {
      this.assetInvStatus = false;
      this.isfilterenable = true;
    }

    // this.getStateList();
    // this.getCompanyListByUserMD()
    this.userInfo.userId = this.auth.getProfileInfo('userId');
    // this.getMoodboardType();
    this.auth.currentMessage.subscribe(message => this.showMenu = message);
    this.getCategories();
    this.getLocation();
    this.getSuppliers();
    this.getWarehouse();
    this.getQuotes();
    // this.productsCountInCategory()
    // this.warehousesCountInCategory()
    // this.getUnits();
    this.getPriceRange();
    // this.getSupplierPartner();
    this.selectedProductFilters1 = JSON.parse(localStorage.getItem('selectedProductFilters1')) ? JSON.parse(localStorage.getItem('selectedProductFilters1')) : this.selectedProductFilters1;
    this.selectedPriceRangeList = JSON.parse(localStorage.getItem('selectedPriceRangeList1')) ? JSON.parse(localStorage.getItem('selectedPriceRangeList1')) : this.selectedPriceRangeList;
    this.publishStatus = localStorage.getItem('publishStatus1') ? localStorage.getItem('publishStatus1') : this.publishStatus;
    this.getAllProducts();
    $('.moodboardPopup').addClass('mbware');
    // this.getFloorTypes()
    // this.getQuote();
  }

  async clearFilter(product) {
    this.filterSelections.forEach((element, index) => {
      if (element.names.includes(product.name)) {
        element.names.splice(index, 1);
      }
      if (element.selections.includes(product.sgid)) {
        element.selections.splice(index, 1);
      }
    });
    if (product.type === 'publish_to_saffron') {
      this.isPublish = null;
      this.isUnpublish = null;

    } if (product.type === 'unpublish_to_saffron') {
      this.isPublish = null;
      this.isUnpublish = null;

    }

    if (product.type === 'register_with_ops') {
      this.isPublishOps = null;
      this.isUnpublishOps = null;

    } if (product.type === 'unregister_from_ops') {
      this.isPublishOps = null;
      this.isUnpublishOps = null;
    }
    await this.getAllProducts();
  }

  async getAllFilterList() {

    this.finalFilterList = [];
    // this.categoryList = JSON.parse(localStorage.getItem('categoryList')) ? JSON.parse(localStorage.getItem('categoryList')) : this.categoryList;
    // this.supplierList = JSON.parse(localStorage.getItem('supplierList')) ? JSON.parse(localStorage.getItem('supplierList')) : this.supplierList;
    // this.warehouseList = JSON.parse(localStorage.getItem('selectedWarehouseList')) ? JSON.parse(localStorage.getItem('selectedWarehouseList')) : this.warehouseList;
    // this.supplierPartnerList = JSON.parse(localStorage.getItem('selectedSupplierPartnerList')) ? JSON.parse(localStorage.getItem('selectedSupplierPartnerList')) : this.supplierPartnerList;

    if (this.selectedType === 'category') {
      await this.categoryList.forEach((element, index) => {
        if (element.sgid === this.selectedData.sgid) {
          element.selected = this.selectedData.selected;
          this.categoryList[index] = element;
        }
      });
      localStorage.setItem('categoryList1', JSON.stringify(this.categoryList));
    }
    if (this.selectedType === 'supplier') {
      await this.supplierList.forEach((element, index) => {
        if (element.sgid === this.selectedData.sgid) {
          element.selected = this.selectedData.selected;
          this.supplierList[index] = element;
        }
      });
      // await this.countOfCategorys.forEach((element, index) => {
      //   if (element.sgid === this.selectedData.sgid) {
      //     element.selected = this.selectedData.selected;
      //     this.supplierList[index] = element;
      //   }
      // });
      localStorage.setItem('supplierList1', JSON.stringify(this.supplierList));
      localStorage.setItem('supplierList1', JSON.stringify(this.countOfCategorys));
      this.getCategories();
    }
    if (this.selectedType === 'loc') {
      await this.locationList.forEach((element, index) => {
        if (element.sgid === this.selectedData.sgid) {  
          element.selected = this.selectedData.selected;
          this.locationList[index] = element;
        }
      });
      this.getSuppliers();
      this.productsCountInCategory()  
      this.getCategories();
    }
    if (this.selectedType === 'ware') {
      if (this.onlyWarehouseFlag && !this.supplierPartnerFlag) {
        await this.warehouseList.forEach((element, index) => {
          if (element.sgid === this.selectedData.sgid) {
            element.selected = this.selectedData.selected;
            this.warehouseList[index] = element;
          }
        });
        localStorage.setItem('selectedWarehouseList1', JSON.stringify(this.warehouseList));
        this.warehousesCountInCategory()
        this.getWarehouse()
      } else {
        if (this.supplierPartnerList) {
          await this.supplierPartnerList.forEach((element, index) => {
            if (element.wsgid === this.selectedData.wsgid) {
              element.selected = this.selectedData.selected;
              this.supplierPartnerList[index] = element;
            }
          });
        }
        localStorage.setItem('selectedSupplierPartnerList1', JSON.stringify(this.supplierPartnerList));
      }
    }

    

    // this.finalFilterList = [...this.categoryList, ...this.supplierList, ...this.warehouseList, ...this.supplierPartnerList,...this.locationList];
  }

  async getInventotyList(val, type) {
    // this.reset_boolean = false
    this.page = 0;
    if (this.invTypeArr.length > 0) {
      if (this.invTypeArr.length > 1) {
        this.inventoryAttr.forEach((ele, index) => {
          //if (this.invTypeArr.includes(ele.name)) {
          ele.selected = true
          /*  if(ele.name !== 'all')
             ele.disable = true */
          //}
        });
      } else {
        this.inventoryAttr.forEach((ele, index) => {
          if (this.invTypeArr.includes(ele.name)) {
            ele.selected = true
          } else {
            ele.selected = false
          }
        });
      }
    } else {
      this.inventoryAttr = [
        { name: 'inhabitr', selected: false, DisplayName: 'Inhabitr Inv', disable: false },
        { name: 'supplier', selected: false, DisplayName: 'Supplier Inv', disable: false },
        { name: 'all', selected: false, DisplayName: 'Either Inhabitr Inv OR Supplier Inv', disable: false },
        { name: 'both', selected: false, DisplayName: 'Both Inhabitr Inv AND Supplier Inv', disable: false }
      ];
    }


    this.isinvType = true;
    this.invValType = val.invVal;
    localStorage.setItem('inv_slider_type', val.invVal);

    if (this.invTypeArr.length > 0) {
      this.getParameter();
      await this.getAllProducts();



    }


  }
  async removeInventory() {

    this.invMinVal = 0;
    this.invMaxVal = 0;
    this.invValType = '';
    localStorage.removeItem('inv_slider_type');
    localStorage.removeItem('invTypeArray');
    localStorage.removeItem('inv_slider_start');
    localStorage.removeItem('inv_slider_end');
    this.invTypeArr = [];
    this.selectedminvalInv = '';
    this.selectedmaxvalInv = '';
    this.isInv = false;
    this.isinvType = false;
    this.assetInvStatus = true;
    this.assetInvStatus = false;
    this.inventoryAttr = [
      { name: 'inhabitr', selected: false, DisplayName: 'Inhabitr Inv', disable: false },
      { name: 'supplier', selected: false, DisplayName: 'Supplier Inv', disable: false },
      { name: 'all', selected: false, DisplayName: 'Either Inhabitr Inv OR Supplier Inv', disable: false },
      { name: 'both', selected: false, DisplayName: 'Both Inhabitr Inv AND Supplier Inv', disable: false }
    ];

    this.getParameter();
    await this.getAllProducts();
    this.checkFilter();
  }

  async getInvSelect(val, i) {
    this.productData=[];
    this.data=[];
    this.isfilterenable = true;
    this.assetInvStatus = true;
    let selectedminval = (<HTMLInputElement>document.getElementById('selectedminvalInv')).value;
    // let selectedmaxval = (<HTMLInputElement> document.getElementById('selectedmaxvalInv')).value;

    if (false) {
      this.assetInvStatus = true;
      $('#wave' + i).prop('checked', false);
      // this.assetfilterstatus = true;
      this.toastr.error('Max value should be greater than Min Value');
    } else {
      if (selectedminval != '') {
        this.isInv = true;
        // this.isLoadMore = false;
        this.selectedminvalInv = selectedminval;
        // this.selectedmaxvalInv = selectedmaxval;
        this.invMinVal = Number(selectedminval);
        // this.invMaxVal = Number(selectedmaxval);
        localStorage.setItem('inv_slider_start', selectedminval);
        // localStorage.setItem('inv_slider_end', selectedmaxval);


        this.assetInvStatus = false;
        val.selected = !val.selected;
        this.invTypeArr = JSON.parse(localStorage.getItem('invTypeArray')) ? JSON.parse(localStorage.getItem('invTypeArray')) : this.invTypeArr;
        if (val.name !== 'all') {
          if (this.invTypeArr.length > 0) {
            if (val.selected) {
              this.invTypeArr = [];
              this.invTypeArr.push(val.name);
            } else {
              this.invTypeArr = this.invTypeArr.filter(x => x !== val.name);
            }
          } else {
            if (val.selected) {
              this.invTypeArr.push(val.name);
            } else {
              this.invTypeArr = this.invTypeArr.filter(x => x !== val.name);
            }
          }
        } else {
          if (val.selected) {
            this.invTypeArr = [];
            this.invTypeArr.push(val.name);
          } else {
            this.invTypeArr = [];
          }
        }

        setTimeout(() => {
          localStorage.setItem('invTypeArray', JSON.stringify(this.invTypeArr));
          if (val == 'all') {
            let obj = { invVal: this.invTypeArr.join() };
            this.getInventotyList(obj, 'invType');
          } else {

            let obj1 = { invVal: this.invTypeArr };
            this.getInventotyList(obj1, 'invType');
          }
        }, 1000);

      } else {
        this.toastr.error('Select Minimum and Maximum value.');
        $('#wave' + i).prop('checked', false);
      }

    }

  }

  async MinvaluechanageInv(event) {
    let selectedminval = (<HTMLInputElement>document.getElementById('selectedminvalInv')).value;
    let selectedmaxval = (<HTMLInputElement>document.getElementById('selectedmaxvalInv')).value;

   

    if (parseFloat(selectedminval) > parseFloat(selectedmaxval)) {
     
      // this.assetfilterstatus = true;
      // this.toastr.error("Max value should be greater than Min Value")
    } else {
    

      if (selectedmaxval && selectedmaxval != '' && selectedminval != '') {
        //this.assetfilterstatus = false;



        this.isInv = true;
        // this.isLoadMore = false;
        this.selectedminvalInv = selectedminval;
        this.selectedmaxvalInv = selectedmaxval;
        this.invMinVal = Number(selectedminval);
        this.invMaxVal = Number(selectedmaxval);
        localStorage.setItem('inv_slider_start', selectedminval);
        localStorage.setItem('inv_slider_end', selectedmaxval);
        if (this.isinvType) {
          this.getParameter();
          await this.getAllProducts();
        }

        //this.getInventotyList(obj, 'inv')
      }
    }

  }

  async MaxvaluechanageInv(event) {

    let selectedminval = (<HTMLInputElement>document.getElementById('selectedminvalInv')).value;
    let selectedmaxval = (<HTMLInputElement>document.getElementById('selectedmaxvalInv')).value;



   

    if (parseFloat(selectedminval) > parseFloat(selectedmaxval)) {
     
      // this.assetfilterstatus = true;
      // this.toastr.error("Max value should be greater than Min Value")
    } else {
    
      if (selectedminval && selectedmaxval != '' && selectedminval != '') {
        let obj = {
          end: selectedmaxval,
          start: selectedminval
        };


        this.isInv = true;
        // this.isLoadMore = false;
        this.selectedminvalInv = selectedminval;
        this.selectedmaxvalInv = selectedmaxval;
        this.invMinVal = Number(selectedminval);
        this.invMaxVal = Number(selectedmaxval);
        localStorage.setItem('inv_slider_start', selectedminval);
        localStorage.setItem('inv_slider_end', selectedmaxval);
        if (this.isinvType) {
          this.getParameter();
          await this.getAllProducts();
        }

        //this.getParameter();
        // await this.getProducts();

        //this.getInventotyList(obj, 'inv')
      }
    }

  }

  async getPublishStatusFilter(type) {
    this.isfilterenable = true;
    this.start = 0;
    this.count = 12;
    this.isFilterFlag = true;
    this.isLoadMore = false;
    this.isPublish = null;
    this.isUnpublish = null;
    this.isPublishOps = null;
    this.isUnpublishOps = null;
    if (type !== 'remove') {
      if (type === 'publish_to_saffron') {
        this.isPublish = 1;
        this.isUnpublish = null;
        this.publishStatus = 'Published to Saffron';
      }

      if (type === 'unpublish_to_saffron') {
        this.isPublish = null;
        this.isUnpublish = 1;
        this.publishStatus = 'Not published in Saffron';
      }

      if (type === 'register_with_ops') {
        this.isPublishOps = 1;
        this.isUnpublishOps = null;
        this.publishStatus = 'Published to Inhabitr.com';

      }

      if (type === 'unregister_from_ops') {
        this.isPublishOps = null;
        this.isUnpublishOps = 1;
        this.publishStatus = 'Not Published to Inhabitr.com';
      }
      localStorage.setItem('publishStatus1', this.publishStatus);
    } else {
      if (type === 'publish_to_saffron') {
        this.isPublish = null;
        this.isUnpublish = null;
      }

      if (type === 'unpublish_to_saffron') {
        this.isPublish = null;
        this.isUnpublish = null;
      }

      if (type === 'register_with_ops') {
        this.isPublishOps = null;
        this.isUnpublishOps = null;
      }

      if (type === 'unregister_from_ops') {
        this.isPublishOps = null;
        this.isUnpublishOps = null;
      }
      this.publishStatus = '';
      localStorage.removeItem('publishStatus1');
    }
    this.getParameter();
    await this.getAllProducts();
  }

  checkIsLocatoionSelect(productModal){
    let filters = localStorage.getItem('filterSelections1');
    this.filterSelections =  filters ? JSON.parse(filters) : []
    let index = this.filterSelections.findIndex(x=>x.type === 'loc');
    if(index!=-1 && this.filterSelections[index].selections.length){
      this.open(productModal,'warehouseContent')
      return;
    }
    this.open(productModal,'ware')
}

checkIsWareHouseSelect(productModal){
  let filters = localStorage.getItem('filterSelections1');
  this.filterSelections =  filters ? JSON.parse(filters) : []
  let index = this.filterSelections.findIndex(x=>x.type === 'ware');
  if(index!=-1 && this.filterSelections[index].selections.length){
    this.open(productModal,'cityContent')
    return;
  }
  this.open(productModal,'loc')
}

  async getSelectedCategory(val, type, r = null) {
    // debugger
    this.newLoader= true
    this.isfilterenable = true;
    this.productData = [];
    this.data=[];
    this.isFilterFlag = true;
    this.isLoadMore = false;
    val.selected = !val.selected;
    this.selectedData = val;
    this.selectedType = type;
    this.start = 0;
    this.count = 12;
    let types = localStorage.getItem('types1') 
    this.types =  types ? JSON.parse(types) : []
    if(!this.types.includes(type)) this.types.push(type)
    let filters = localStorage.getItem('filterSelections1');
    this.filterSelections =  filters ? JSON.parse(filters) : []
    let  selectedProductFilters:any = localStorage.getItem('selectedProductFilters1') ;
    selectedProductFilters = selectedProductFilters ? JSON.parse(selectedProductFilters) : [];
    let index = this.filterSelections.findIndex(x=>x.type === type);
    if(val.selected) {

      if(index !=-1) {
       this.filterSelections[index].selections.push(val.sgid)
       this.filterSelections[index].names.push(type ==='ware' || type==='loc' || type==='supplier' ? val.warehouse_name  : val.supplier_name)
       
      } else {
       this.filterSelections.push({
         type: type,
         names:[type ==='ware' || type==='loc'  || type==='supplier' ? val.warehouse_name  : val.supplier_name],
         selections :[val.sgid],
       })
      }
 
      let filterIndex = selectedProductFilters.findIndex(x=>x.sgid===val.sgid)
      if(filterIndex==-1)selectedProductFilters.push(val);
 
     } else {
       if(index !=-1){
        let subSgIndex =  this.filterSelections[index].selections.findIndex(x=>x ===val.sgid);
        if(subSgIndex!=-1) this.filterSelections[index].selections.splice(subSgIndex,1)
        // let nameIndex = this.filterSelections[index].names.findIndex(x=>x ===x[ type ==='ware' || type==='loc' ? 'warehouse_name' : 'name'])
        // if(nameIndex!=-1) this.filterSelections[index].names.splice(nameIndex,1)
 
        let filterIndex = selectedProductFilters.findIndex(x=>x.sgid===val.sgid)
        if(filterIndex!=-1)selectedProductFilters.splice(filterIndex,1);
       }
     }
     this.selectedProductFilters1 = selectedProductFilters;
     localStorage.setItem('selectedProductFilters1', JSON.stringify(this.selectedProductFilters1));
     localStorage.setItem('filterSelections1', JSON.stringify(this.filterSelections));
     localStorage.setItem('types1', JSON.stringify(this.types));
    await this.getAllFilterList();
    await this.getParameter();
    // this.getCategories();
    

    if (r !== 'rm') {
      if ((type === 'category' || this.catSel == true) && this.isSupplier == false && this.isWare == false) {
       
        this.catSel = true;
        this.categorySel = true;
        if (type === 'category') {
          await this.getCategorySupplier();
          await this.getCategoryWarehouse();
          await this.getSupplierWarehouseFilter();
          await this.getAttributes();

        } else {
          if ((type === 'supplier' || this.catSelSupplier == true) && this.catSelWareHouse == false) {
            this.catSelWareHouse = false;
            this.catSelSupplier = true;
            if (type === 'supplier') {
              await this.getCategorySelectedWarehouse();
              await this.getSupplierWarehouseFilter();
            }

          } else if ((type === 'ware' || this.catSelWareHouse == true) && this.catSelSupplier == false) {
            this.catSelWareHouse = true;
            this.catSelSupplier = false;
            if (type === 'ware') {
              await this.getCategorySelectedSupplier();
            }
          }
        }
      } else {
      
        this.catSel = false;

        if ((type === 'ware' || this.isWare == true) && this.isSupplier == false) {
          this.isSupplier = false;
          this.isWare = true;
          if (type === 'ware') {
            this.isWare = true;
            await this.getSuppliersFilter();
            // await this.getCategoriesFilter();
            await this.getCategoriesFilterSupp();
            await this.updatewareLocal();
          } else {
            let r = new URL('http://abcd.com?' + this.parameters);
          
            if (type === 'category') {
              if (r.searchParams.get('supplier') == '' || r.searchParams.get('supplier') == null || r.searchParams.get('supplier') == 'null') {
                this.wareCategory = true;
                await this.categoriesSupplierList();
              }
            } else {
              if (!this.wareCategory) {
                await this.rmcata();
                await this.getCategoriesFilter();
              }/* else{
                this.wareCategory = false
              } */

            }
          }
        } else if ((type === 'supplier' || this.isSupplier == true) && this.isWare == false) {
          this.isSupplier = true;
          this.isWare = false;
          if (type === 'supplier') {
            this.isSupplier = true;
            await this.getWarehouseFilter();
            await this.getSupplierWarehouseFilter();
            await this.getCategoriesFilterSupp();
            await this.updateSupplierLocal();

          } else {
            let r = new URL('http://abcd.com?' + this.parameters);
            if (type === 'category') {
              // this.wareCategory = true
              if (r.searchParams.get('warehouse') == '' || r.searchParams.get('warehouse') == null || r.searchParams.get('warehouse') == 'null') {
                this.wareCategory = true;
                await this.categoriesWarehouseList();
                await this.getSupplierWarehouseFilter();
              }
              //  await this.categoriesWarehouseList()
            } else {
              if (!this.wareCategory) {
                await this.rmcata();
                await this.getCategoriesFilterSupp();
              }

            }
          }
        }
        else if ((type === 'loc' || this.isLocation == true) && this.isWare == false) {
          this.isLocation = true;
          this.isWare = false
          if (type === 'loc') {
            this.isLocation = true
            await this.getWarehouseFilter()
            await this.getSupplierWarehouseFilter()
            await this.getCategoriesFilterSupp()
            await this.getLocation()

          } else {
            let r = new URL("http://abcd.com?" + this.parameters)
            if (type === 'category') {
              await this.getAttributes();
              // this.wareCategory = true
              if (r.searchParams.get('warehouse') == "" || r.searchParams.get('warehouse') == null || r.searchParams.get('warehouse') == "null") {
                this.wareCategory = true
                //  this. categorySel=true;
                await this.categoriesWarehouseList()
                await this.getSupplierWarehouseFilter()
                await this.getAttributes();
              }
              //await this.categoriesWarehouseList()

            } else {
              if (!this.wareCategory) {
                await this.getCategoriesFilterSupp()
              }

            }
          }
        }
      }



    }

    await this.getAllProducts();
    setTimeout(() => {
      localStorage.setItem('selectedWarehouseList1', JSON.stringify(this.warehouseList));
      localStorage.setItem('categoryList1', JSON.stringify(this.categoryList));
      localStorage.setItem('supplierList1', JSON.stringify(this.supplierList));
      this.getAllProducts();
    }, 1500);

  }


  getCategorySelectedSupplier() {
    let r = new URL('http://abcd.com?' + this.parameters);
    this.shop.getwarehouseCategoriesFilter(r.searchParams.get('warehouse'), r.searchParams.get('category')).subscribe(
      resp => {
        this.suppliers = resp.result.sort(this.compare);
        this.supplierList = [];
        this.supplierFileterID = [];
        this.supplierFileterName = [];
        let selectedFiler = this.filterSelections.find(x=>x.type==='supplier');
        this.suppliers.forEach(element => {
          element.selected = selectedFiler && selectedFiler.selections.includes(element.sgid) ? true : false;
          element.type = 'supplier';
          element.spid = '';
          this.supplierFileterID.push(element.sgid);
          this.supplierFileterName.push(element.name);
          this.supplierList.push(element);
        });
      
        localStorage.setItem('supplierList1', JSON.stringify(this.supplierList));
        /* this.categories = resp.result;
        this.categoryList = [];
        this.categories.forEach(element => {
          element.selected = false;
          element.type = 'category';
          element.spid = '';
          this.categoryList.push(element);
        }); */
      }, err => {
      }
    );
  }

  getCategorySelectedWarehouse() {
    let r = new URL('http://abcd.com?' + this.parameters);
    this.shop.getWarehouseCategoryFilter(r.searchParams.get('supplier'), r.searchParams.get('category')).subscribe(
      resp => {
        this.warehouse = resp.data;
        this.warehouseList = [];
        this.warehouse.forEach(element => {
          element.selected = false;
          element.type = 'ware';
          this.warehouseList.push(element);
        });
      }, err => {
      }
    );
  }

  getCategoryWarehouse() {
    let r = new URL('http://abcd.com?' + this.parameters);
    this.shop.getCategoryWarehouse(r.searchParams.get('category')).subscribe(
      resp => {
        this.warehouse = resp.data;
        this.warehouseList = [];
        this.warehouse.forEach(element => {
          element.selected = false;
          element.type = 'ware';
          this.warehouseList.push(element);
        });
      }, err => {
      }
    );
  }


  getCategorySupplier() {

    let r = new URL('http://abcd.com?' + this.parameters);
    this.shop.getCategorySupplier(r.searchParams.get('category')).subscribe(
      resp => {
        this.suppliers = resp.result.sort(this.compare);
        this.supplierList = [];
        this.supplierFileterID = [];
        this.supplierFileterName = [];
        let selectedFiler = this.filterSelections.find(x=>x.type==='supplier');
        this.suppliers.forEach(element => {
          element.selected = selectedFiler && selectedFiler.selections.includes(element.sgid) ? true : false;
          element.type = 'supplier';
          element.spid = '';
          this.supplierFileterID.push(element.sgid);
          this.supplierFileterName.push(element.name);
          this.supplierList.push(element);
        });
      }, err => {
      }
    );

  }

  categoriesWarehouseList() {
    let r = new URL('http://abcd.com?' + this.parameters);
    this.shop.getWarehouseCategoryFilter(r.searchParams.get('supplier'), r.searchParams.get('category')).subscribe(
      resp => {
        this.warehouse = resp.data;
        this.warehouseList = [];
        this.warehouse.forEach(element => {
          element.selected = false;
          element.type = 'ware';
          this.warehouseList.push(element);
        });
      }, err => {
      }
    );
  }

  categoriesSupplierList() {
    let r = new URL('http://abcd.com?' + this.parameters);
    this.shop.getwarehouseCategoriesFilter(r.searchParams.get('warehouse'), r.searchParams.get('category')).subscribe(
      resp => {
        this.suppliers = resp.result.sort(this.compare);
        this.supplierList = [];
        this.supplierFileterID = [];
        this.supplierFileterName = [];
        let selectedFiler = this.filterSelections.find(x=>x.type==='supplier');
        this.suppliers.forEach(element => {
          element.selected = selectedFiler && selectedFiler.selections.includes(element.sgid) ? true : false;
          element.type = 'supplier';
          element.spid = '';
          this.supplierFileterID.push(element.sgid);
          this.supplierFileterName.push(element.name);
          this.supplierList.push(element);
        });
        localStorage.setItem('supplierList1', JSON.stringify(this.supplierList));
        /* this.categories = resp.result;
        this.categoryList = [];
        this.categories.forEach(element => {
          element.selected = false;
          element.type = 'category';
          element.spid = '';
          this.categoryList.push(element);
        }); */
      }, err => {
      }
    );
  }

  async removeduplicateParameters() {
    let slpf = JSON.parse(localStorage.getItem('selectedProductFilters1')) ? JSON.parse(localStorage.getItem('selectedProductFilters1')) : [];
    let slpf1 = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : [];
    let temp_categorySid = [];
    let temp_categorysname = [];
    let temp_suppliersname = [];
    let temp_supplierSid = [];
    let temp_warename = [];
    let temp_wareid = [];
    let final_array = [];
    let filterArr = [];
    slpf.forEach(e => {
      if (e.type === 'category' && !temp_categorySid.includes(e.sgid)) {
        temp_categorySid.push(e.sgid)
        temp_categorysname.push(e.name)
        final_array.push(e)
      } else if (e.type === 'supplier' && !temp_supplierSid.includes(e.sgid)) {
        temp_supplierSid.push(e.sgid)
        temp_suppliersname.push(e.name)
        final_array.push(e)
      } else if (e.type === 'ware' && !temp_wareid.includes(e.sgid)) {
        temp_wareid.push(e.sgid)
        temp_warename.push(e.warehouse_name)
        final_array.push(e)
      }
    });
    if (temp_categorySid.length > 0) {
      filterArr.push({ type: 'category', names: temp_categorysname, selections: temp_categorySid });
    }
    if (temp_supplierSid.length > 0) {
      filterArr.push({ type: 'supplier', names: temp_suppliersname, selections: temp_supplierSid });
    }
    if (temp_wareid.length > 0) {
      filterArr.push({ type: 'ware', names: temp_warename, selections: temp_wareid });
    }

    this.selectedProductFilters1 = JSON.parse(localStorage.getItem('selectedProductFilters1')) ? JSON.parse(localStorage.getItem('selectedProductFilters1')) : [];
  }

  updateSupplierLocal() {
    let slpf = JSON.parse(localStorage.getItem('selectedProductFilters1')) ? JSON.parse(localStorage.getItem('selectedProductFilters1')) : [];
    let slpf1 = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : [];

    slpf1.forEach(element => {
      if (element.type !== 'supplier') {
        element.selections = [];
        element.names = [];
      }
    });

    let nw = slpf.filter(x => x.type === 'supplier');


  }

  getCategoriesFilterSupp() {
    let r = new URL('http://abcd.com?' + this.parameters);
    let filters:any = localStorage.getItem('filterSelections1');
    filters =  filters ? JSON.parse(filters) : []
    let isLocationSearch = false;
   let index = filters.findIndex(x=>x.type === 'loc');
   if(index!=-1 && filters[index].selections &&  filters[index].selections.length){
     isLocationSearch = true;
   }
   this.parameters = this.parameters +`&location=${isLocationSearch ? 1 :0}`
    this.shop.getCategoriesFilterSupp(r.searchParams.get('supplier'), r.searchParams.get('warehouse'),this.parameters).subscribe(
      resp => {
        this.categories = resp.result;
        this.categoryList = [];
        let selectedFiler = this.filterSelections.find(x=>x.type==='category');
        this.categories.forEach(element => {
          element.selected = selectedFiler && selectedFiler.selections.includes(element.sgid) ? true : false;
          element.type = 'category';
          element.spid = '';
          this.categoryList.push(element);
        });
      }, err => {
      }
    );
  }

  rmcata() {
    let slpf = JSON.parse(localStorage.getItem('selectedProductFilters1')) ? JSON.parse(localStorage.getItem('selectedProductFilters1')) : [];
    let slpf1 = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : [];


    let wareId = [];
    let warename = [];
    let supplierID = [];
    let suppliername = [];

    slpf.forEach(element => {
      if (element.type === 'ware') {
        warename.push(element.warehouse_name);
        wareId.push(element.sgid);
      } else if (element.type === 'supplier') {
        suppliername.push(element.name);
        supplierID.push(element.sgid);
      }
      /*  element.selected = false;
       element.type = 'supplier';
       element.spid = '';
       this.supplierFileterID.push(element.sgid);
       this.supplierFileterName.push(element.name);
       this.supplierList.push(element); */
    });

    slpf1.forEach(element => {
      if (element.type === 'ware') {
        element.names = warename;
        element.selections = wareId;
        // wareId.push(element.sgid)
      } else if (element.type === 'supplier') {
        element.names = suppliername;
        element.selections = supplierID;
        // supplierID.push(element.sgid)
      }
    });

    if (this.spIds) {
      for (let i = 0; i < this.spIds.length; i++) {
        supplierID.push(this.spIds[i]);
      }
    }
    supplierID = supplierID.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });

    let pr = localStorage.getItem('parameters1') ? localStorage.getItem('parameters1') : '';
    let r = new URL('http://abcd.com?' + pr);
    r.searchParams.set('supplier', supplierID.length > 0 ? supplierID.toString() : null);
    r.searchParams.set('warehouse', wareId.length > 0 ? wareId.toString() : null);
   // r.searchParams.set('category', null);

    this.parameters = r.search.toString().replace(/%2C/g, ',');
    this.parameters = this.parameters.replace('?', '&');

    localStorage.setItem('parameters1', this.parameters);
  }


  getWarehouseFilter() {
    let r = new URL('http://abcd.com?' + this.parameters);

    this.shop.getWarehouseFilter(r.searchParams.get('supplier')).subscribe(
      resp => {
        this.warehouse = resp.data;
        this.warehouseList = [];
        this.warehouse.forEach(element => {
          element.selected = false;
          element.type = 'ware';
          this.warehouseList.push(element);
        });
      }, err => {
      }
    );

  }

  getCategoriesFilter() {
    let r = new URL('http://abcd.com?' + this.parameters);
    this.shop.getCategoriesFilter(r.searchParams.get('warehouse'), r.searchParams.get('supplier')).subscribe(
      resp => {
        this.categories = resp.result;
        this.categoryList = [];
        let selectedFiler = this.filterSelections.find(x=>x.type==='category');
        this.categories.forEach(element => {
          element.selected = selectedFiler && selectedFiler.selections.includes(element.sgid) ? true : false;
          element.type = 'category';
          element.spid = '';
          this.categoryList.push(element);
        });
      }, err => {
      }
    );
  }

  updatewareLocal() {
    let slpf = JSON.parse(localStorage.getItem('selectedProductFilters1')) ? JSON.parse(localStorage.getItem('selectedProductFilters1')) : [];
    let slpf1 = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : [];


    slpf1.forEach(element => {
      if (element.type !== 'ware') {
        element.selections = [];
        element.names = [];
      }
    });




    let nw = slpf.filter(x => x.type === 'ware');


  }
  getSupplierWarehouseFilter() {
    let r = new URL('http://abcd.com?' + this.parameters);

    this.shop.getSupplierWarehouseFilter(r.searchParams.get('supplier'), r.searchParams.get('warehouse'), r.searchParams.get('category')).subscribe(
      resp => {
        this.warehouse = resp.data;
        this.supplierPartnerList = [];
        this.warehouse.forEach(element => {
          let supParObj = {};
          supParObj['sgid'] = element.warehouse;
          supParObj['wsgid'] = element.sgid;
          supParObj['warehouse_name'] = element.warehouse_name;
          supParObj['count'] = element.count;
          supParObj['selected'] = false;
          supParObj['spid'] = element.supplier;
          supParObj['type'] = 'ware';
          this.supplierPartnerList.push(supParObj);
        });
      }, err => {
      }
    );

  }

  getSuppliersFilter() {
    let r = new URL('http://abcd.com?' + this.parameters);
    this.shop.getSuppliersFilter(r.searchParams.get('warehouse'), r.searchParams.get('supplier')).subscribe(
      resp => {
        this.suppliers = resp.result.sort(this.compare);
        this.supplierList = [];
        this.supplierFileterID = [];
        this.supplierFileterName = [];
        let selectedFiler = this.filterSelections.find(x=>x.type==='supplier');
        this.suppliers.forEach(element => {
          element.selected = selectedFiler && selectedFiler.selections.includes(element.sgid) ? true : false;
          element.type = 'supplier';
          element.spid = '';
          this.supplierFileterID.push(element.sgid);
          this.supplierFileterName.push(element.name);
          this.supplierList.push(element);
        });
      }, err => {
      }
    );
  }

  async getPriceRangeList(val, type) {
    localStorage.setItem('price_slider_start1', val.start);
    localStorage.setItem('price_slider_end1', val.end);
    this.start = 0;
    this.count = 12;
    this.isFilterFlag = true;
    this.isLoadMore = false;
    val.selected = true;
    this.getSelectedPriceRangeList(val);
    this.selectedPriceRangeStart = JSON.parse(localStorage.getItem('selectedPriceRangeStart1')) ? JSON.parse(localStorage.getItem('selectedPriceRangeStart1')) : this.selectedPriceRangeStart;
    this.selectedPriceRangeStart = JSON.parse(localStorage.getItem('selectedPriceRangeEnd1')) ? JSON.parse(localStorage.getItem('selectedPriceRangeEnd1')) : this.selectedPriceRangeEnd;

    this.filterSelections = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : this.filterSelections;

    if (type !== 'remove') {
      if (val.selected) {
        if (!this.selectedPriceRangeStart.includes(val.start)) {
          this.selectedPriceRangeStart.push(val.start);
        }
        if (!this.selectedPriceRangeStart.includes(val.end)) {
          this.selectedPriceRangeEnd.push(val.end);
        }
        this.selectedPriceRange.start = val.start;
        this.selectedPriceRange.end = val.end;

        this.selectedPriceRangeList.forEach(ele => {
          if (ele.start !== val.start && ele.end !== val.end) {
            this.selectedPriceRangeList.push(this.selectedPriceRange);
          }
        });
      } else {
        this.selectedPriceRangeStart = this.selectedPriceRangeStart.filter(x => x !== val.start);
        this.selectedPriceRangeEnd = this.selectedPriceRangeEnd.filter(x => x !== val.end);
        this.selectedPriceRangeList.forEach((ele, index) => {
          if (ele.start === val.start && ele.end === val.end) {
            this.selectedPriceRangeList.splice(index, 1);
          }
        });
      }
    } else {
      val.selected = false;
      this.reset_boolean = true;
      this.selectedPriceRangeStart = this.selectedPriceRangeStart.filter(x => x !== val.start);
      this.selectedPriceRangeEnd = this.selectedPriceRangeEnd.filter(x => x !== val.end);
      this.selectedPriceRangeList.forEach((ele, index) => {
        if (ele.start === val.start && ele.end === val.end) {
          this.selectedPriceRangeList.splice(index, 1);
        }
      });
      await localStorage.removeItem('priceRangesList1');
      await localStorage.removeItem('selectedPriceRangeList1');
      await localStorage.removeItem('selectedPriceRangeStart1');
      await localStorage.removeItem('selectedPriceRangeEnd1');
    }
    localStorage.setItem('selectedPriceRangeStart1', JSON.stringify(this.selectedPriceRangeStart));
    localStorage.setItem('selectedPriceRangeEnd1', JSON.stringify(this.selectedPriceRangeEnd));
    this.getParameter();
    await this.getAllProducts();
    this.checkFilter();
  }
  Minvaluechanage(event) {

    let selectedminval = (<HTMLInputElement>document.getElementById('selectedminval')).value;
    let selectedmaxval = (<HTMLInputElement>document.getElementById('selectedmaxval')).value;

    if (selectedminval) {
    } else {
      this.assetfilterstatus = true;
    }

    if (parseFloat(selectedminval) > parseFloat(selectedmaxval)) {

      this.assetfilterstatus = true;
      // this.toastr.error("Max value should be greater than Min Value")
    } else {
      if ((selectedmaxval && selectedmaxval != '') || selectedminval != '') {
        this.assetfilterstatus = false;
        let obj = {
          end: selectedmaxval,
          selected: false,
          start: selectedminval
        };
        this.isfilterenable = true;
        this.getPriceRangeList(obj, 'price');
      }
    }

 


  }
  Maxvaluechanage(event) {
    this.data=[];
    this.productData=[];
    // this.selectedmaxval=event.target.value;
    // let min;let max;
    // if(this.selectedminval !=""&& this.selectedminval!='undefined' && this.selectedminval!=null && this.selectedminval !='Select Min Value')
    // {
    //    min=Number(this.selectedminval.substring(1));
    // }
    // if(this.selectedmaxval !=""&& this.selectedmaxval!='undefined' && this.selectedmaxval!=null && this.selectedmaxval !='Select Max Value')
    // {
    //    max=Number(this.selectedmaxval.substring(1));
    // }
    // if(max>min)
    // {
    //   var obj={end: max,
    //     selected: false,
    //     start: min}
    //   this.getPriceRangeList(obj, 'price')
    // }
    // else{
    //   if(this.selectedmaxval !=undefined && this.selectedmaxval !='Select Max Value' )
    //   {
    //     if(this.selectedminval=='Select Min Value')
    //     {
    //       this.toastr.error("Select Min Value")
    //     }
    //     else{
    //     this.toastr.error("Max value should be greater than Min Value")
    //     this.selectedmaxval='Select Max Value';
    //     }
    //   }
    // }

    let selectedminval = (<HTMLInputElement>document.getElementById('selectedminval')).value;
    let selectedmaxval = (<HTMLInputElement>document.getElementById('selectedmaxval')).value;

    if (selectedmaxval) {
    } else {
      this.assetfilterstatus = true;
    }

    if (parseFloat(selectedminval) > parseFloat(selectedmaxval)) {
      this.assetfilterstatus = true;
      //this.toastr.error("Max value should be greater than Min Value")
    } else {
      if ((selectedminval && selectedminval != '') || selectedmaxval != '') {
        this.assetfilterstatus = false;
        let obj = {
          end: selectedmaxval,
          selected: false,
          start: selectedminval
        };
        this.isfilterenable = true;
        this.getPriceRangeList(obj, 'price');
      }
    }
  }

  async getSelectedPriceRangeList(val) {
    await this.priceRangesList.forEach((element, index) => {
      if (element.start === val.start || element.end === val.end) {
        element.selected = val.selected;
        this.priceRangesList[index] = element;
      }
    });
    localStorage.setItem('priceRangesList1', JSON.stringify(this.priceRangesList));

    if (val.selected) {
      this.selectedPriceRangeList = [val];

    } else {
      //  this.minValue = this.reset_minValue;
      // this.maxValue =  this.reset_maxValue
      // this.reset_boolean = !this.reset_boolean
      localStorage.removeItem('price_slider_start1');
      localStorage.removeItem('price_slider_end1');
    }

    // this.selectedPriceRangeList = this.priceRangesList.filter(x => x.selected === true);
    localStorage.setItem('selectedPriceRangeList1', JSON.stringify(this.selectedPriceRangeList));
  }

  getParameter() {
    this.filterSelections = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : this.filterSelections;
    this.selectedCategoryIds = this.filterSelections.filter(x => x.type === 'category').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
    this.selectedSupplierIds = this.filterSelections.filter(x => x.type === 'supplier').map(x => x.selections).filter((ele) => { return ele.length !== 0; });

  
    this.selectedWarehouseIds = this.filterSelections.filter(x => x.type === 'ware').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
    this.selectedLocationIds = this.filterSelections.filter(x => x.type === 'loc').map(x => x.selections).filter((ele) => { return ele.length !== 0 });
    if(this.selectedLocationIds.length){
      this.selectedWarehouseIds = [...this.selectedWarehouseIds,...this.selectedLocationIds]
    }
    this.selectedPriceRangeStart = JSON.parse(localStorage.getItem('selectedPriceRangeStart1')) ? JSON.parse(localStorage.getItem('selectedPriceRangeStart1')) : this.selectedPriceRangeStart;
    this.selectedPriceRangeEnd = JSON.parse(localStorage.getItem('selectedPriceRangeEnd1')) ? JSON.parse(localStorage.getItem('selectedPriceRangeEnd1')) : this.selectedPriceRangeEnd;
    // this.selectedWarehouseIds = this.filterSelections.filter(x=>x.type === 'loc').map(x=>x.selections).filter((ele)=>{return ele.length !== 0});
    this.selectedPriceRangeStartVals = this.selectedPriceRangeStart.length > 0 ? (this.selectedPriceRangeStart.toString() ? this.selectedPriceRangeStart.toString() : null) : null;
    this.selectedPriceRangeEndVals = this.selectedPriceRangeEnd.length > 0 ? (this.selectedPriceRangeEnd.toString() ? this.selectedPriceRangeEnd.toString() : null) : null;
    this.selectedCategoryids = this.selectedCategoryIds.length > 0 ? (this.selectedCategoryIds.toString() ? this.selectedCategoryIds.toString() : null) : null;
    this.selectedSupplierids = this.selectedSupplierIds.length > 0 ? (this.selectedSupplierIds.toString() ? this.selectedSupplierIds.toString() : null) : null;
    this.selectedWarehouseids = this.selectedWarehouseIds.length > 0 ? (this.selectedWarehouseIds.toString() ? this.selectedWarehouseIds.toString() : null) : null;

    this.parameters = '&category=' + this.selectedCategoryids + '&supplier=' + this.selectedSupplierids +
      '&warehouse=' + this.selectedWarehouseids;

    if (this.attrselected) {
      this.parameters = this.parameters + '&attribute=' + this.selectedattributelist;

    }

    if (this.selectedPriceRangeStartVals) {
      this.parameters = this.parameters + '&price_start=' + this.selectedPriceRangeStartVals;
    }

    if (this.isInv) {
      this.parameters = this.parameters + '&min_price_inventory=' + this.invMinVal;
      this.parameters = this.parameters + '&inventory_filter_request_type=' + this.invValType;
    }

    if (this.selectedPriceRangeEndVals) {
      this.parameters = this.parameters + '&price_end=' + this.selectedPriceRangeEndVals;
    }

    if (this.isPublish || this.isUnpublish) {
      this.parameters = this.parameters + '&is_publish=' + this.isPublish + '&is_unpublish=' + this.isUnpublish;
    }

    if (this.isPublishOps || this.isUnpublishOps) {
      this.parameters = this.parameters + '&is_publish_ops=' + this.isPublishOps + '&is_unpublish_ops=' + this.isUnpublishOps;
    }
    localStorage.setItem('parameters1', this.parameters);
  }

  checkFilter() {
    this.data = [];
    this.data = this.productData;
    // if(type === 'category'){
    // this.getUpdatedCategories();
    // }
    // if(type === 'sup'){

    // }
    localStorage.setItem('categoryList1', JSON.stringify(this.categoryList));
    localStorage.setItem('supplierList1', JSON.stringify(this.supplierList));
    // location.reload()
  }



  //   case 'loc':
  //     this.selectedWarehouseId = val.sgid;
  //     break;
  //   case 'publish_to_saffron':
  //     this.isPublish =1;
  //     this.isUnpublish = null;
  //   break;
  //   case 'unpublish_to_saffron':
  //     this.isPublish =null;
  //     this.isUnpublish = 1;
  //   break;
  //   case 'register_with_ops':
  //     this.isPublishOps =1;
  //     this.isUnpublishOps = null;
  //   break;
  //   case 'unregister_from_ops':
  //     this.isPublishOps =null;
  //     this.isUnpublishOps = 1;
  //   break;
  //   default:
  //     this.selectedCategoryId = '';
  //     this.selectedSupplierId = '';
  //     this.selectedWarehouseId = '';
  // }

  isAllUnit(bool) {
    if (bool) {
      this.isSelectedAll = true;
      this.fpUnitList.forEach(elem => {
        elem.isActive = true;
      });
    } else {
      this.isSelectedAll = false;
      this.fpUnitList.forEach(elem => {
        elem.isActive = false;
      });
    }
  }



  isAllUnitWtihoutFP(bool) {
    if (bool) {
      this.isUnitSelectedAll = true;
      this.unitWOPlans.forEach(elem => {
        elem.isActive = true;
      });
    } else {
      this.isUnitSelectedAll = false;
    }
  }


  selectUnitsForPlans(unit) {
    if (unit.isActive) {
      let checker = 0;
      this.fpUnitList.forEach(elem => {
        if (elem.isActive) {
          checker++;
        }
      });
      if (checker > 1) {
        unit.isActive = false;
      } else {

      }

    } else {
      unit.isActive = true;
    }
  }

  floorPlanModel(){
    this.getFloorTypes()
    this.getUnits();
  }


  selectUnitsWithoutFloorPlan(unit) {
    if (unit.isActive) {
      let checker = 0;
      this.unitWOPlans.forEach(elem => {
        //unitsarray.push(elem.sgid);

        if (elem.isActive) {
          checker++;
        }


      });
      /* this.fpUnitList.forEach(elem  => {
        if(elem.isActive){
          checker++;
        }
      }); */
      if (checker > 1) {
        unit.isActive = false;
      } else {

      }

    } else {
      unit.isActive = true;
    }
  }


  hideForms() {
    this.showMBForm = false;
    this.showCreateForm = false;
    this.showAllData = true;
  }
  showCopyForm() {
    this.getStateList()
    this.getCompanyListByUserMD()
    this.getMoodboardType()
    this.showCreateForm = true;
    this.showMBForm = false;
    this.showAllData = false;
    this.moodbTypeName = this.moodboardDetails?.moodboard.moodboard_type_name;
    this.moodboardTypeId = this.moodboardDetails?.moodboard.boardtypeid;
    this.whName = this.moodboardDetails?.moodboard.warehouse_name;
    this.whId = this.moodboardDetails?.moodboard.warehouse_id;
    this.selectedState = {sgid: this.moodboardDetails?.moodboard?.states?.sgid,name:this.moodboardDetails?.moodboard?.states?.name}
    this.createMoodboardForm = this.formBuilder.group({
      moodboard_name: [this.moodboardDetails?.moodboard.boardname, Validators.required],
      city:[this.moodboardDetails?.moodboard?.city, Validators.required],
      state :[this.selectedState, Validators.required],
      zipcode : [this.moodboardDetails?.moodboard?.zipcode,Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')],
      company_name : [this.moodboardDetails?.moodboard?.company_name, Validators.required],
      newCompanyName : ['test', Validators.required],
      project_name : [this.moodboardDetails?.moodboard?.project_name, Validators.required],
      mb_type_detail : [this.moodboardDetails?.moodboard?.mb_type_detail]
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
  sortBy(val) {
    if (this.selectedCategoryId) {
      // tslint:disable-next-line: max-line-length
      this.route.navigate(['/admin/products/list'], { queryParams: { publish: val, categoryname: this.selectedCategory.name, categoryid: this.selectedCategory.id } });
    } else {
      this.route.navigate(['/admin/products/list'], { queryParams: { publish: val } });
    }
  }
  clearAll(type) {
    this.page = 0;
    this.data = [];
    if (type === 'sort') {
      if (this.selectedCategoryId) {
        // tslint:disable-next-line: max-line-length
        this.route.navigate(['/admin/products/list'], { queryParams: { categoryname: this.selectedCategory.name, categoryid: this.selectedCategory.id } });
      } else {
        this.route.navigate(['/admin/products/list']);
      }
      this.getAllProducts();

    } else {
      if (type === 'category') {
        this.selectedCategory = {};
        this.selectedCategoryId = '';

      } else if (type === 'warehouse') {
        this.selectedWarehouse = {};
        this.selectedWarehouseId = '';
        if (this.supplierPartnerFlag && !this.onlyWarehouseFlag) {
          if (this.prvsSelectedSupplierId) {
            this.selectedSupplierId = this.prvsSelectedSupplierId;
          } else {
            this.prvsSelectedSupplierId = '';
            this.selectedSupplierId = this.prvsSelectedSupplierId;
          }
        }
      } else if (type === 'supplier') {
        this.selectedSupplier = {};
        this.selectedSupplierId = '';

      } else if (type === 'pricerange') {
        this.selectedPriceRange = {};

      } else if (type === 'loc') {
        this.selectedWarehouse = {};
      }

      this.parameters = '&category=' + this.selectedCategoryId + '&supplier=' + this.selectedSupplierId +
        '&warehouse=' + this.selectedWarehouseId;

      this.getAllProducts();

    }
  }
  open(content, type) {
    this.onlyWarehouseFlag = true;
    this.supplierPartnerFlag = false;
    this.assetfilterstatus = true;
    this.categoryList = JSON.parse(localStorage.getItem('categoryList1')) ? JSON.parse(localStorage.getItem('categoryList1')) : this.categoryList;
    this.supplierList = JSON.parse(localStorage.getItem('supplierList1')) ? JSON.parse(localStorage.getItem('supplierList1')) : this.supplierList;
    this.priceRangesList = JSON.parse(localStorage.getItem('priceRangesList1')) ? JSON.parse(localStorage.getItem('priceRangesList1')) : this.priceRangesList;

    if (this.onlyWarehouseFlag && !this.supplierPartnerFlag) {
      this.warehouseList = JSON.parse(localStorage.getItem('selectedWarehouseList1')) ? JSON.parse(localStorage.getItem('selectedWarehouseList1')) : this.warehouseList;
    }
    // this.warehouseList = JSON.parse(localStorage.getItem('warehouseList'));
    // let selectedWarehouseList = JSON.parse(localStorage.getItem('selectedWarehouseList'));
    // this.warehouseList = selectedWarehouseList ? selectedWarehouseList : this.warehouseList;
    this.modalVal = type.toString();
    if (type == 'price') {
      this.modalService.open(content, this.modalOptions3).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else if (type == 'inv') {
      this.modalService.open(content, this.modalOptions3).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else if (type == 'cityContent') {
      
      this.modalService.open(content, this.modalOptions2).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;

      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else if (type == 'warehouseContent') {
      
      this.modalService.open(content, this.modalOptions2).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;

      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else {
      this.modalService.open(content, this.modalOptions).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }
  productdetailsModel(productid) {

    $('#productmodal').modal('show');
    this.shop.getItem(productid).subscribe(
      resp => {
        this.spinner.hide();
        this.itemInfo = resp.result;
        this.productid = productid;
        this.variationImages = this.itemInfo.variations;
        this.multipleskuattribute = '';
        if (this.variationImages.length) {
          for (let i = 0; i < this.variationImages.length; i++) {
            if (this.variationImages[i].attribute_info) {

              this.multipleskuattribute = this.multipleskuattribute + '.' + this.variationImages[i].attribute_info;

            }
          }

        }
        this.multipleskuattribute = this.multipleskuattribute.substring(1);
        this.setDetails(0);
      });
  }


  hideproductdetailsModel() {
    $('#productmodal').modal('hide');
  }
  getPriceRange() {
    this.priceRangesList = [
      { start: 0, end: 200, selected: false },
      { start: 200, end: 400, selected: false },
      { start: 400, end: 600, selected: false },
      { start: 600, end: 800, selected: false },
      { start: 800, end: 1000, selected: false },
      { start: 1000, end: 2000, selected: false },
      { start: 2000, end: 5000, selected: false },
    ];
  }
  filterItems(val, type) {
    this.page = 0;
    this.data = [];
    if (type === 'All') {
      this.selectedCategory = {};
      this.selectedCategoryId = '';
      this.selectedSupplier = {};
      this.selectedSupplierId = '';
      this.selectedWarehouse = {};
      this.selectedWarehouseId = '';
      this.getAllProducts();
    } else {

      this.typeOfFilter = type;
      let queryParameter = {};
      if (type === 'category') {
        this.selectedCategory = val;
        this.selectedCategoryId = val.sgid;
        // this.params = '&idCategory=' + this.selectedCategoryId;

      }
      if (type === 'supplier') {
        this.prvsSelectedSupplierId = val.sgid;
        this.selectedSupplier = val;
        this.selectedSupplierId = val.sgid;
        }

      if (type === 'ware') {
        this.selectedWarehouse = val;
        if (this.onlyWarehouseFlag && !this.supplierPartnerFlag) {
          this.selectedWarehouseId = val.sgid;
        } else {
          this.selectedSupplierId = val.supplier;
          this.selectedWarehouseId = val.warehouse;
        }
        }

      if (type === 'loc') {
        this.selectedWarehouse = val;
        this.selectedWarehouseId = val.sgid;
        }
      // if(type === 'price'){
      //  this.selectedPriceRange.start = val.start;
      //  this.selectedPriceRange.end = val.end;
      // }

      if (type === 'publish_to_saffron') {
        this.isPublish = 1;
        this.isUnpublish = null;

      } if (type === 'unpublish_to_saffron') {
        this.isPublish = null;
        this.isUnpublish = 1;

      }

      if (type === 'register_with_ops') {
        this.isPublishOps = 1;
        this.isUnpublishOps = null;

      } if (type === 'unregister_from_ops') {
        this.isPublishOps = null;
        this.isUnpublishOps = 1;
      }
      // if(type === 'price'){
      //  this.selectedPriceRange.start = val.start;
      //  this.selectedPriceRange.end = val.end;
      // }
      queryParameter = {
        categoryname: this.selectedCategory.name ? this.selectedCategory.name : '',
        categoryid: this.selectedCategoryId ? this.selectedCategoryId : '',
        suppliername: this.selectedSupplier.name ? this.selectedSupplier.name : '',
        supplierid: this.selectedSupplierId ? this.selectedSupplierId : '',
        warehousename: this.selectedWarehouse.warehouse_name ? this.selectedWarehouse.warehouse_name : '',
        warehouseid: this.selectedWarehouseId ? this.selectedWarehouseId : '',
        price_start: this.selectedPriceRange.start ? this.selectedPriceRange.start : '',
        price_end: this.selectedPriceRange.end ? this.selectedPriceRange.end : '',

      };

      this.parameters = '&category=' + this.selectedCategoryId + '&supplier=' + this.selectedSupplierId +
        '&warehouse=' + this.selectedWarehouseId;
      if (this.isPublish || this.isUnpublish) {
        this.parameters = this.parameters + '&is_publish=' + this.isPublish + '&is_unpublish=' + this.isUnpublish;
        this.isPublishOps = '';
        this.isUnpublishOps = '';
      }

      if (this.isPublishOps || this.isUnpublishOps) {
        this.parameters = this.parameters + '&is_publish_ops=' + this.isPublishOps + '&is_unpublish_ops=' + this.isUnpublishOps;
        this.isPublish = '';
        this.isUnpublish = '';
      }
      this.getAllProducts();

      // }
    }

  }
  showAllData:boolean = true;
  editMB() {
    this.getStateList()
    this.getCompanyListByUserMD()
    this.getMoodboardType()
    this.showMBForm = true;
    this.showCreateForm = false;
    this.showAllData = false;
    this.moodbTypeName = this.moodboardDetails?.moodboard.moodboard_type_name;
    this.moodboardTypeId = this.moodboardDetails?.moodboard.boardtypeid;
    this.whName = this.moodboardDetails?.moodboard.warehouse_name;
    this.whId = this.moodboardDetails?.moodboard.warehouse_id;
    this.selectedState = {sgid: this.moodboardDetails?.moodboard?.states?.sgid,name:this.moodboardDetails?.moodboard?.states?.name}
    this.moodboardForm = this.formBuilder.group({
      moodboard_name: [this.moodboardDetails?.moodboard.boardname, Validators.required],
      city:[this.moodboardDetails?.moodboard?.city, Validators.required],
      state :[this.selectedState, Validators.required],
      zipcode : [this.moodboardDetails?.moodboard?.zipcode,Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')],
      company_name : [this.moodboardDetails?.moodboard?.company_name, Validators.required],
      newCompanyName : ['test', Validators.required],
      project_id : [this.moodboardDetails?.moodboard?.project_id, Validators.required],
      project_name : [this.moodboardDetails?.moodboard?.project_name, Validators.required],
      mb_type_detail : [this.moodboardDetails?.moodboard?.mb_type_detail]
    });
  }

  selectMoodbType(moodboardType) {
    this.moodbTypeName = moodboardType.typename;
    this.moodboardTypeId = moodboardType.type_id;
  }




  selectFloorType(floorType) {
    this.selectedFloorPlan = floorType.floorname;
    this.selectedFloorPlanId = floorType.sgid;
    this.loadfpUnits(this.selectedFloorPlanId, this.quoteTypeId);
  }

  selectWarehouse(wh) {
    this.whName = wh.warehouse_name;
    this.whId = wh.sgid;
  }
  async isZipCodeValid() {
    if(this.moodboardForm.value.zipcode){
      let data = {
        city_name: this.moodboardForm.value.city,
        state_id: this.moodboardForm.value.state.sgid,
        zipcode: this.moodboardForm.value.zipcode
      }
      return this.sharedService.validateZipCode(data).toPromise()
    } 
  }
  checkObjValueChange(orginal,current){
    let modifiedCoumns = [];
    current['boardname'] = current.moodboard_name
    current['sgid'] = current.moodboard_id
    current['boardtypeid'] = Number(current.moodboard_type)

    delete current.moodboard_name;
    delete current.moodboard_id;
    delete current.moodboard_type;

    Object.keys(current).forEach(key=>{
      if(current[key] !== orginal[key]){
        modifiedCoumns.push({[key]:{original:orginal[key],update:current[key]}})
      }
    })
    return modifiedCoumns
  }

  updateMBChangesHistory(changesData){
    let currentUserId = this.auth.getProfileInfo('userId');
    let ownerId = this.moodboardDetails?.moodboard.userid;
    if(currentUserId === ownerId){
      return
    }
    changesData.updated_input?.find(x=>{
      if(x.state){
        x.state.original=this.moodboardDetails?.moodboard.states.name;
      }
    })
    let reqPayload={
      "moodboard_id": this.moodboardDetails?.moodboard.sgid , 
      "org_user_id": ownerId ,
       "other_user_id": currentUserId,
      "updated_input" : {}, 
      "added_items" : [],  
      "deleted_items" :[], 
      "updated_qty": [],
      "changed_mb_type": []
      
    }
    reqPayload = {...reqPayload,...changesData}
    this.mbs.updateMoodboardByPublic(reqPayload).subscribe(res=>{
    })
   
  //  this.PublicHistoryResult()
  }
  PublicHistoryResult(){
    this.isLoading = true;
    this.mbs.updateMoodboardByPublicHistory(this.moodboardDetails.moodboard.sgid,this.page).subscribe(res=>{
      this.page += 12;
      this.isLoading = false;
      if (res.result && res.result.length){
        for(let item of res.result){
          if(item.changed_type ==='updated_input'){
            item.input_names = typeof item.input_names ==='string' ? JSON.parse(item.input_names) : item.input_names
          }
        }
        this.PublicHistoryList = [...this.PublicHistoryList,...res.result];
      }
      this.isMoreProducts = res.result && res.result.length ? true : false;

    })
  }
  // on scroll product list
  @HostListener("window:scroll", ["$event"])
  getScrollHeight(event: any) {
    let remaining =
      document.documentElement.scrollHeight -
      (window.innerHeight + window.pageYOffset);
    if (Math.round(remaining) < 800 && !this.isLoading && this.isMoreProducts) {
      this.onScroll();
    }
  }
  onScroll() {
   if(this.publicHistoryResultTable == true){
    this.PublicHistoryResult();
   }
  }
  historyResult(){
    this.publicHistoryResultTable = true;
    this.showAllData=false;
    this.page=0;
    this.PublicHistoryList=[];
    this.onScroll();
   
  }
  navigationBack(){
    this.publicHistoryResultTable = false;
    this.showAllData=true;
  }
  // on scroll product list
  // userid,unit,customer_reference,option_reference
  async onSubmit() {
    if(this.moodboardForm.value.zipcode){
      let status = false;
      try {
       status  = await this.isZipCodeValid();
      } catch (error) {
        
      }
    
     if(!status){
       this.toastr.warning('ZipCode Invalid');
       return;
     }
    }
    this.spinner.show();
    this.moodboardForm.value.moodboard_id = this.moodboardDetails.moodboard.sgid;
    this.moodboardForm.value.userid = this.auth.getProfileInfo('userId');
    this.moodboardForm.value.state =  this.moodboardForm.value.state.sgid;
    this.moodboardForm.value.mb_type_detail = this.moodboardForm.value.mb_type_detail;
    this.moodboardForm.value.moodboard_type = this.moodboardTypeId.toString();
    delete this.moodboardForm.value.newCompanyName;
    if(this.moodboardDetails?.moodboard.userid !== this.auth.getProfileInfo('userId')){
      let inputChanges = this.checkObjValueChange(this.moodboardDetails.moodboard,this.moodboardForm.value)
      this.updateMBChangesHistory({updated_input:inputChanges})
    }
    this.mbs.updateMoodBoard(this.moodboardForm.value).subscribe(data => {
      if (data) {
        this.spinner.hide();
        this.showMBForm = false;
        this.showAllData = true;
        this.toastr.success('Moodboard updated successfully');
        this.getMoodBoardDetails(this.moodboardDetails.moodboard.sgid);
      }

    }, error => () => {
      this.errorMsg = error;
      this.spinner.hide();

    });

  }

  getMoodboardType() {
    this.mbs.MoodboardTypeList().subscribe(resp => {
      if (resp) {
        this.moodbTypes = resp.result;
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
  }
  addProduct(prod) {
    if (!this.selectedProductIds.includes(prod.product_id.toString())) {
      this.selectedProductIds.push(prod.product_id.toString());
      this.selectedProducts.push(prod);
    }
  }

  rentTotalMonths:any;
  getMoodBoardDetails(id) {
    this.moodboard_id = id;
    this.spinner.show();
    this.mbs.getMoodBoardDetails(id).subscribe(resp => {
      console.log(resp)
      this.moodboardDetails = resp;
      // this.moodboardDetails = [...this.moodboardDetails,...this.moodboardDetails]
      if(this.userInfo.userId !=resp?.moodboard?.userid && resp?.moodboard?.is_public == 0){
        this.toastr.info('Not Your Moodboard');
      }
      if(this.userInfo.userId !=resp?.moodboard?.userid && resp?.moodboard?.is_public == 1){
        this.toastr.info('This is Public Moodboard');
      }
      this.moodboardname = this.moodboardDetails.moodboard.boardname;
      this.TotalAssetPrice = this.moodboardDetails.moodboard.asset_value;
      this.rentTotalMonths = this.moodboardDetails.moodboard.monthly_rent
      // for(var i=0;i<this.moodboardDetails.moodboard_items.length;i++)
      // {
      //  let asset= Number(this.moodboardDetails.moodboard_items[i].asset_value);
      //   this.TotalAssetPrice=asset+this.TotalAssetPrice;
      // }
      this.spinner.hide();
      if (this.userInfo.userId === this.moodboardDetails.moodboard.userid) {
        this.showAuth = true;
      }
      if (this.moodboardDetails.moodboard.discount === null) {
        this.moodboardDetails.moodboard.discount = 0;
        this.moodboardDetails.moodboard.moodboard_discount_price = 0;
      }
      if (resp.moodboard_items.length > 0) {
        var itemsProcessed = 0;
        resp.moodboard_items.forEach(elem => {
          this.selectedProductIds.push(elem.product_id.toString());
          this.mbs.getImageUrl(elem.variation?.images[0].image_url.small).subscribe(image => {
            elem.imagee = 'data:image/jpeg;base64,' + image.imageurl;
            this.selectedProducts.push(elem);
            itemsProcessed++;
            if (itemsProcessed === resp.moodboard_items.length) {
              this.generateImagePDFData(resp.moodboard_items ? resp.moodboard_items : []);
            }
          });
        });
      }
      if(resp?.moodboard){
        if (resp?.moodboard?.is_public == 1) {
          this.MoodboardPublic = true;
          this.showAuth = true;
        } else {
          this.MoodboardPublic = false;
        }
      }
    });
  }

  getMoodboardName(id) {
    this.moodboardTypes.result.forEach(element => {
      if (id === element.type_id) {
        return element.typename;
      }
    });
  }

  getCategories() {
    let scId = null;
    let whId = null;
    let spId = null;
    let fs = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : '';
    if (fs) {
      scId = fs.filter(x => x.type === 'category').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
      whId = fs.filter(x => x.type === 'ware').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
      spId = fs.filter(x => x.type === 'supplier').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
    }



    if (whId && whId.length > 0) {
      // let r  =  new URL("http://abcd.com?"+whId[0].toString())
      this.shop.getCategoriesFilter(whId[0]?.toString(), spId).subscribe(
        resp => {
          this.categories = resp.result;
          this.categoryList = [];
          this.categories.forEach(element => {
            element.selected = false;
            element.type = 'category';
            element.spid = '';
            this.categoryList.push(element);
          });
        }, err => {
        }
      );
    } else if (spId && spId.length > 0) {
      this.shop.getCategoriesFilterSupp(spId[0]?.toString(), whId[0]?.toString(),null).subscribe(
        resp => {
          this.categories = resp.result;
          this.categoryList = [];
          this.categories.forEach(element => {
            element.selected = false;
            element.type = 'category';
            element.spid = '';
            this.categoryList.push(element);
          });
        }, err => {
        }
      );
    } else {
      this.shop.getCategories().subscribe(
        resp => {
          this.categories = resp.result;
          this.categoryList = [];
          this.categories.forEach(element => {
            element.selected = false;
            element.type = 'category';
            element.spid = '';
            this.categoryList.push(element);
          });
        }, err => {
        }
      );
    }

  }

  getUpdatedCategories() {
    let s_ids = this.selectedSupplierids;
    let c_ids = this.selectedCategoryids;
    let w_ids = this.selectedWarehouseids;
    this.shop.getUpdatedCategories(s_ids, c_ids, w_ids).subscribe(
      resp => {
        this.categories = resp.result;
      }, err => {
      }
    );
  }

  getLocation() {
    this.shop.getLocation().subscribe(
      resp => {
        this.location = resp.data;
          let filters:any = localStorage.getItem('filterSelections1');
          filters = filters ? JSON.parse(filters) : []
        this.location = this.location.map(x=>{
          x['selected'] = filters.filter(y=>y.type==='loc').some(z=>z.selections.includes(x.sgid));
          x['type'] = 'loc';
          return x
        })
      }, err => {
      }
    );
  }
  getSuppliers() {

    let scId = null;
    let whId = null;
    let spId = null;
    let fs = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : '';
    if (fs) {
      scId = fs.filter(x => x.type === 'category').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
      whId = fs.filter(x => x.type === 'ware').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
      spId = fs.filter(x => x.type === 'supplier').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
    }


    if (whId && whId.length > 0) {
      //let r  =  new URL("http://abcd.com?"+this.parameters)
      this.shop.getSuppliersFilter(whId[0].toString(), spId).subscribe(
        resp => {
          this.suppliers = resp.result.sort(this.compare);
          this.supplierList = [];
          let selectedFiler = this.filterSelections.find(x=>x.type==='supplier');
          this.suppliers.forEach(element => {
            element.selected = selectedFiler && selectedFiler.selections.includes(element.sgid) ? true : false;
            element.type = 'supplier';
            element.spid = '';
            this.supplierList.push(element);
          });
          this.productsCountInCategory()
        }, err => {
        }
      );
    } else {
      this.shop.getSuppliers().subscribe(
        resp => {
          this.suppliers = resp.result.sort(this.compare);
          this.supplierList = [];
          let selectedFiler = this.filterSelections.find(x=>x.type==='supplier');
          this.suppliers.forEach(element => {
            element.selected = selectedFiler && selectedFiler.selections.includes(element.sgid) ? true : false;
            element.type = 'supplier';
            element.spid = '';
            this.supplierList.push(element);
          });
          this.productsCountInCategory()
        }, err => {
        }
      );
    }

    /* this.shop.getSuppliers().subscribe(
      resp => {
        this.suppliers = resp.result.sort(this.compare);
        this.supplierList = [];
        this.suppliers.forEach(element => {
          element.selected = false;
          element.type = 'supplier';
          element.spid = '';
          this.supplierList.push(element);
        });
        // localStorage.setItem('supplierList', JSON.stringify(this.supplierList));
      }, err => {
      }
    ); */
  }
  getWarehouse() {
    let scId = [];
    let whId = [];
    let spId = [];
    let fs = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : '';
    if (fs) {
      scId = fs.filter(x => x.type === 'category').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
      whId = fs.filter(x => x.type === 'ware').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
      spId = fs.filter(x => x.type === 'supplier').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
    }

    this.supplierPartnerFlag = false;
    this.onlyWarehouseFlag = true;
    let selectedWarehouse = JSON.parse(localStorage.getItem('selectedWarehouseList1'));
    if (selectedWarehouse) {
      this.warehouseList = selectedWarehouse;
      // localStorage.setItem('warehouseList', JSON.stringify(this.warehouseList));
    } else {
      if (spId.length > 0) {
        this.shop.getWarehouseFilter(spId[0].toString()).subscribe(
          resp => {
            this.warehouse = resp.data;
            this.warehouseList = [];
            this.warehouse.forEach(element => {
              element.selected = false;
              element.type = 'ware';
              this.warehouseList.push(element);
            });
          }, err => {
          }
        );
        this.warehousesCountInCategory()
      } else {
        this.shop.getWarehouse().subscribe(
          resp => {
            this.warehouse = resp.data;
            this.warehouseList = [];
            this.warehouse.forEach(element => {
              element.selected = false;
              element.type = 'ware';
              this.warehouseList.push(element);
            });
            this.warehousesCountInCategory()
          }, err => {
          }
        );
      }

    }

    /* this.supplierPartnerFlag = false;
    this.onlyWarehouseFlag = true;
    let selectedWarehouse = JSON.parse(localStorage.getItem('selectedWarehouseList'));
    if (selectedWarehouse) {
      this.warehouseList = selectedWarehouse;
      // localStorage.setItem('warehouseList', JSON.stringify(this.warehouseList));
    } else {
      this.shop.getWarehouse().subscribe(
        resp => {
          this.warehouse = resp.data;
          this.warehouseList = [];
          this.warehouse.forEach(element => {
            element.selected = false;
            element.type = 'ware';
            this.warehouseList.push(element);
          });
          // localStorage.setItem('warehouseList', JSON.stringify(this.warehouseList));
        }, err => {
        }
      );
    } */
  }
  mywher
  async getAllProducts() {
    let min_replace = '';
    let max_replace = '';
    let fnl_min_price = '';
    let fnl_max_price = '';
    let fnl_r = '';
    if (!this.isFilterFlag) {
      this.spinner.show();
    }
    this.parameters = localStorage.getItem('parameters1') ? localStorage.getItem('parameters1') : this.parameters;
    let r = new URL('http://abcd.com?' + this.parameters);
    if (this.parameters != '' && this.parameters != "undefind" && this.parameters != null) {

      if (r.searchParams.get('category') != "null" && r.searchParams.get('category') != "") {

        this.isfilterenable = true;
        this.categorySel = true;
        if (JSON.parse(localStorage.getItem('attributenames1'))) {
          this.attrselected = true;
        
          this.objattr = JSON.parse(localStorage.getItem('attributenames1')) ? JSON.parse(localStorage.getItem('attributenames1')) : {};
          this.namesattr = Object.keys(this.objattr);

          this.attributenames = '';
          for (let i = 0; i < this.namesattr.length; i++) {

            this.attributenames = this.attributenames + ',' + this.namesattr[i] + ':' + this.objattr[this.namesattr[i]];
          }
          this.attributenames = this.attributenames.substring(1);
        }
        // if(JSON.parse(localStorage.getItem('attributeids')))

        if (JSON.parse(localStorage.getItem('attributeids'))) {
          this.selectedattributelist = JSON.parse(localStorage.getItem('attributeids'));
        }


        this.getAttributes1();
      } else {
        this.categorySel = false;
        
      }
    }
    if (this.parameters) {
      if (this.parameters.includes('inhabitr,supplier')) {
        this.parameters = this.parameters.replace('inhabitr,supplier', 'all');

      }
    }
    if (this.parameters) {
      if (this.parameters.includes('price_start')) {
        let t = this.parameters.split('price_start=')[1];  // 100000,32766&price_end=100000

        if (this.parameters.includes('price_end')) {
          let fnl_min_price_arr = t.split('&price_end=')[0].split(',');
          if (fnl_min_price_arr.length == 2) {
            fnl_min_price = this.reset_boolean ? null : localStorage.getItem('price_slider_start1');
          } else {
            fnl_min_price = this.reset_boolean ? null : localStorage.getItem('price_slider_start1');
          }

          let fnl_max_price_arr = t.split('&price_end=')[1].split(',');
          fnl_max_price = this.reset_boolean ? null : localStorage.getItem('price_slider_end1');

          min_replace = t.split('&price_end=')[0];
          max_replace = t.split('&price_end=')[1];
          r.searchParams.set('price_start', fnl_min_price);
          r.searchParams.set('price_end', fnl_max_price);
          fnl_r = r.search.replace('?', '');



        } else {
          let fnl_min_price_arr = t.split('&price_end=')[0].split(',');
          if (fnl_min_price_arr.length == 2) {
            fnl_min_price = this.reset_boolean ? null : localStorage.getItem('price_slider_start1');
          } else {
            fnl_min_price = this.reset_boolean ? null : localStorage.getItem('price_slider_start1');
          }

          // var fnl_min_price = fnl_min_price_arr[fnl_min_price_arr.length-1]
          // var fnl_max_price_arr =  t.split('&price_end=')[1].split(',')
          fnl_max_price = this.reset_boolean ? null : localStorage.getItem('price_slider_end1');
          r.searchParams.set('price_start', fnl_min_price);
          r.searchParams.set('price_end', fnl_max_price);
          min_replace = t.split('&price_end=')[0];
          max_replace = t.split('&price_end=')[1];
          fnl_r = r.search.replace('?', '');
        }
        let str_pl = fnl_r.replace('price_start', 'min_price');
        let str_pl2 = str_pl.replace('price_end', 'max_price');
        let str_pl3 = str_pl2.replace('%2C', ',');
        this.parameters = '&' + str_pl3;
      }

    }

    let qparam = '';
    if (this.selectedCategoryId) {
      qparam += '&category=' + this.selectedCategoryId;
    }
    if (this.selectedWarehouseId) {
      qparam += '&warehouse=' + this.selectedWarehouseId;
    }
    if (this.selectedSupplierId) {
      qparam += '&supplier=' + this.selectedSupplierId;
    }
    if (this.parameters) {
      if (this.parameters != '&mood_inv=1') {
        this.parameters += '&mood_inv=1';
      }
    } else {
      this.parameters = '&mood_inv=1';
    }
    let filters:any = localStorage.getItem('filterSelections1');
     filters =  filters ? JSON.parse(filters) : []
     let isLocationSearch = false;
    let index = filters.findIndex(x=>x.type === 'loc');
    if(index!=-1 && filters[index].selections &&  filters[index].selections.length){
      isLocationSearch = true;
    }
    this.parameters = this.parameters +`&location=${isLocationSearch ? 1 :0}`
    await this.shop.getItems1(this.start, this.count, this.parameters, this.publishVal).toPromise().then((res: any) => {
      if (this.reset_boolean) {
        this.resetPrice();
      }
      if(res){
        this.newLoader=false;
        if(res.result.length >0 || res.result2.length > 0){
          this.onSuccess(res)
          if(res.result?.length){
            this.newLoaderMoreButton = res.result.length >=12 ? true : false;
          }
          if(res.result2?.length){
            this.newLoaderMoreButton = res.result2.length >=12 ? true : false;
          }
        }
        else{
          this.spinner.hide();
          this.newLoaderMoreButton = false;
        }
      }
     
    });
  }

  onSuccess(res) {
    // this.data = [];
    if (res !== undefined) {
      this.isMoreProducts = res.result && res.result.length ? true : false;
      this.disMsg = res?.dis_msg;
      this.spinner.hide();
      if (res.message === undefined) {
        if (this.isLoadMore) {
          if(res.result.length){
            res.result.forEach((item: any) => {
              item.imagee = item.product_sku_vartion.get_display_image[0].image_url.small;
  
              this.data.push(item);
            });
          }if(res.result2.length){
            res.result2.forEach((item: any) => {
              item.imagee = item.product_sku_vartion.get_display_image[0].image_url.small;
  
              this.data.push(item);
            });
           
          }
          
        } else {
          this.data = res.result.length>0 ? res.result : res.result2;
        }
        this.productData = res.result.length>0 ? res.result : res.result2;
      } else {
        this.data = [];
      }
    } 
    else {
      this.data = [];
     
    }
  }

  getImgPolaroid(val) {
  }

  increaseQty() {

    if (this.commonQty < this.totalQtyOfSku) {
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
    if (this.commonQty === 1) {

      this.commonQty = 1;
      this.toastr.error("Cannot decrease quantity value")
      return;
    }

    if (this.commonQty <= this.totalQtyOfSku) {
      --this.commonQty
      
    }
  }

  increaseQuantity(val,months) {
    this.spinner.show();
    let original = val.qty

    if(!months){
      val.qty++;
      if(val.button_type==1){
        val.total = val.buy_price * val.qty
      }
      if(val.button_type==0){
        val.total = val.sale_price * val.qty
      }
    } 
      if(this.moodboardDetails?.moodboard.userid !== this.auth.getProfileInfo('userId')){
        let items  = [{
          "product_id": val.product_id,
          "sku":val.sku,
          "button_type":val.button_type,
          "updated": val.qty,
          "original":original,
        }]
        this.updateMBChangesHistory({updated_qty:items})
      }
      const obj = {
        sgid: val.sgid,
        moodboard_id: val.moodboard_id,
        qty: val.qty,
        months: val.months,
        total: val.total,
        price: val.price,
        sale_price: val.sale_price,
        asset_value: val.asset_value,
        button_type:val.button_type,
        buy_price:val.buy_price
       
      };
      if (obj) {
        this.mbs.moodboardSingleItem(obj).subscribe(resp => {
          this.spinner.hide();
          if(!months)this.toastr.success('MoodBoard Quantity increased');
          this.toastr.success('MoodBoard Months increased');
          this.updatedMbDetails = resp;
          this.searchMoodBoardList()
        });
      }
    
    return
    if (val.qty < 100) {
      val.qty++;
      // tslint:disable-next-line: radix
      if (val.button_type === 1) {
        val.total = parseFloat(val.buy_price) * val.qty;
      } else {
        val.total = parseFloat(val.sale_price) * val.qty;
      }

      // tslint:disable-next-line: radix
      val.total = parseFloat(val.total);
      this.setTotal();
    }
  }
  decreaseQuantity(val,months) {

    let original = val.qty
    if(!months){
      if(val.qty==1){
        return
      }else{
        val.qty--;
      }
      
      
      if(val.button_type==1){
        val.total = val.buy_price * val.qty
      }
      if(val.button_type==0){
        val.total = val.sale_price * val.qty
      }
    } 
      if(this.moodboardDetails?.moodboard.userid !== this.auth.getProfileInfo('userId')){
        let items  = [{
          "product_id": val.product_id,
          "sku":val.sku,
          "button_type":val.button_type,
          "updated": val.qty,
          "original":original,
        }]
        this.updateMBChangesHistory({updated_qty:items})
      }
      const obj = {
        sgid: val.sgid,
        moodboard_id: val.moodboard_id,
        qty: val.qty,
        months: val.months,
        total: val.total,
        price: val.price,
        sale_price: val.sale_price,
        asset_value: val.asset_value,
        button_type:val.button_type,
        buy_price:val.buy_price
       
      };
      if (obj) {
        this.mbs.moodboardSingleItem(obj).subscribe(resp => {
          this.spinner.hide();
          if(!months) this.toastr.success('MoodBoard Quantity decreased');
          this.toastr.success('MoodBoard Months decreased');
          this.updatedMbDetails = resp;
          this.searchMoodBoardList()
        });
      }

      return
      // tslint:disable-next-line: radix
      if (val.button_type === 1) {
        val.total = parseFloat(val.buy_price) * val.qty;
      } else {
        val.total = parseFloat(val.sale_price) * val.qty;
      }
      // tslint:disable-next-line: radix
      val.total = parseFloat(val.total);
      this.setTotal();
  }
  increaseDiscount(val) {
    if (val.b2b_discount < 90) {
      val.b2b_discount++;
      // tslint:disable-next-line: radix
      val.sale_price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
      // tslint:disable-next-line: radix
      val.total = parseFloat(val.sale_price) * val.qty;
      // tslint:disable-next-line: radix
      val.total = parseFloat(val.total);
      this.setTotal();
    }
  }
  decreaseDiscount(val) {
    if (val.b2b_discount > 0) {
      val.b2b_discount--;
      // tslint:disable-next-line: radix
      val.sale_price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
      // tslint:disable-next-line: radix
      val.total = parseFloat(val.sale_price) * val.qty;
      // tslint:disable-next-line: radix
      val.total = parseFloat(val.total);
      this.setTotal();
    }
  }
  increaseTotalDiscount() {
    if (this.moodboardDetails.moodboard.discount < 90) {
      this.moodboardDetails.moodboard.discount++;
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.moodboardDetails.moodboard.moodboard_discount_price = parseFloat(this.moodboardDetails.moodboard.sub_total) - ((parseFloat(this.moodboardDetails.moodboard.sub_total) * parseFloat(this.moodboardDetails.moodboard.discount)) / 100);
      this.setTotal();
    }
  }
  decreaseTotalDiscount() {
    if (this.moodboardDetails.moodboard.discount > 0) {
      this.moodboardDetails.moodboard.discount--;
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.moodboardDetails.moodboard.moodboard_discount_price = parseFloat(this.moodboardDetails.moodboard.sub_total) - ((parseFloat(this.moodboardDetails.moodboard.sub_total) * parseFloat(this.moodboardDetails.moodboard.discount)) / 100);
      this.setTotal();
    }
  }

  increaseMonth(val,months) {
    if (val.months < 36) {
      val.months++;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        val.price = resp.rental;

        // tslint:disable-next-line: radix
        val.sale_price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
        // tslint:disable-next-line: radix
        val.total = parseFloat(val.sale_price) * val.qty;
        // tslint:disable-next-line: radix
        val.total = parseFloat(val.total);
        this.setTotal();
        this.increaseQuantity(val,months)
      });
    }
  }

  decreaseMonth(val,months) {
    if (val.months > 1) {
      val.months--;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        val.price = resp.rental;
        // tslint:disable-next-line: radix
        val.sale_price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
        // tslint:disable-next-line: radix
        val.total = parseFloat(val.sale_price) * val.qty;
        // tslint:disable-next-line: radix
        val.total = parseFloat(val.total);
        this.setTotal();
        this.decreaseQuantity(val,months)
      });
    }
  }

  setTotal() {
    let subtotal: number;
    subtotal = 0;
    let monthlyrent: number;
    monthlyrent = 0;

    this.moodboardDetails.moodboard_items.forEach(element => {
      // tslint:disable-next-line: radix
      subtotal += parseFloat(element.total);
      // tslint:disable-next-line: radix
      monthlyrent += parseFloat(element.sale_price);
    });
    // tslint:disable-next-line: radix
    this.moodboardDetails.moodboard.sub_total = subtotal;

    // tslint:disable-next-line: radix
    this.moodboardDetails.moodboard.monthly_rent = monthlyrent;

    this.moodboardDetails.moodboard.tax_amount = ((parseFloat(this.moodboardDetails.moodboard.delivery_fee) + parseFloat(this.moodboardDetails.moodboard.sub_total)) *  parseFloat(this.moodboardDetails.moodboard.states.sale_tax_rate)/100);
    // tslint:disable-next-line: max-line-length // tslint:disable-next-line: radix
    if (parseFloat(this.moodboardDetails.moodboard.discount) > 0) {
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.moodboardDetails.moodboard.moodboard_discount_price = parseFloat(this.moodboardDetails.moodboard.sub_total) - ((parseFloat(this.moodboardDetails.moodboard.sub_total) * parseFloat(this.moodboardDetails.moodboard.discount)) / 100);
      // tslint:disable-next-line: max-line-length // tslint:disable-next-line: radix
      this.moodboardDetails.moodboard.net_total = parseFloat(this.moodboardDetails.moodboard.delivery_fee) + parseFloat(this.moodboardDetails.moodboard.moodboard_discount_price)+ parseFloat(this.moodboardDetails.moodboard.tax_amount);
    } else {
      // tslint:disable-next-line: max-line-length // tslint:disable-next-line: radix
      this.moodboardDetails.moodboard.net_total = parseFloat(this.moodboardDetails.moodboard.delivery_fee) + parseFloat(this.moodboardDetails.moodboard.sub_total) + parseFloat(this.moodboardDetails.moodboard.tax_amount);
    }
  }
  saveQuote() {
    this.spinner.show();
    const postArr = [];
    this.moodboardDetails.moodboard_items.forEach(elem => {
      const obj = {
        sgid: elem.sgid,
        moodboard_discount: this.moodboardDetails.moodboard.discount,
        moodboard_id: this.moodboardDetails.moodboard.sgid,
        qty: elem.qty,
        discount: elem.discount,
        b2b_discount: elem.b2b_discount,
        months: elem.months,
        total: elem.total,
        price: elem.price,
        sale_price: elem.sale_price,
        sub_total: this.moodboardDetails.moodboard.sub_total,
        moodboard_discount_price: this.moodboardDetails.moodboard.moodboard_discount_price,
        monthly_rent: this.moodboardDetails.moodboard.monthly_rent,
        delivery_fee: this.moodboardDetails.moodboard.delivery_fee,
        tax: this.moodboardDetails.moodboard.tax_amount,
        net_total: this.moodboardDetails.moodboard.net_total,
        asset_value: this.moodboardDetails.moodboard.asset_value
      };
      postArr.push(obj);
    });
    if (postArr.length === this.moodboardDetails.moodboard_items.length) {
      this.mbs.saveQuote(postArr).subscribe(resp => {
        this.spinner.hide();
        this.toastr.success('MoodBoard Quote Saved Successfully');
      });
    }
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

  loadMore() {
    // this.data= []
    this.isFilterFlag = false;
    this.isLoadMore = true;
    this.start += 12;
    this.getAllProducts();
  }





  addmoodbaordinFloorPlan() {
    // floorplan_id,quote_id,moodboard_id,units(array format) ex [1,2,3]
    let unitsarray = [];
    this.fpUnitList.forEach(elem => {
      if (this.isSelectedAll) {
        unitsarray.push(elem.sgid);
      } else {
        if (elem.isActive) {
          unitsarray.push(elem.sgid);
        }
      }

    });

    let obj = { floorplan_id: this.selectedFloorPlanId, quote_id: this.quoteTypeId, moodboard_id: this.moodboardDetails.moodboard.sgid, units: unitsarray };

    this.quoteservice.addmoodbaordtoFloorPlan(obj).subscribe(resp => {
      if (resp.statusCode === 200) {
        this.toastr.success('Moodboard added to floor plan successfully  ');
      }
    }, error => { });
  }

  unitTab() {
    this.isFloorPlan = false;
    this.isUnitTab = true;
    // this.getUnits();

  }


  floorPlanTab() {
    this.isFloorPlan = true;
    this.isUnitTab = false;

  }

  getUnits() {
    this.quoteservice.getUnitWithoutPlan(this.quoteTypeId).subscribe(resp => {
      if (resp.statusCode === 200 && resp.result.length > 0) {
        this.unitWOPlans = resp.result;
        this.nodatafoundUnit = false;
      } else {
        this.unitWOPlans = [];
        this.nodatafoundUnit = true;
      }
    }, error => { this.nodatafoundUnit = true; });
  }

  addwithoutFloorPlanUnits() {

    // floorplan_id,quote_id,moodboard_id,units(array format) ex [1,2,3]
    /* let unitsarray = [];
    this.unitWOPlans.forEach(elem  => {
        unitsarray.push(elem.sgid);
    }) */

    let unitsarray = [];
    this.unitWOPlans.forEach(elem => {
      if (this.isUnitSelectedAll) {
        unitsarray.push(elem.sgid);
      } else {
        if (elem.isActive) {
          unitsarray.push(elem.sgid);
        }
      }

    });

    let obj = { quote_id: this.quoteTypeId, moodboard_id: this.moodboardDetails.moodboard.sgid, units: unitsarray };

    this.quoteservice.addmoodbaordtoFloorPlan(obj).subscribe(resp => {
      if (resp.statusCode === 200) {
        this.toastr.success('Moodboard added to units successfully  ');
      }
    }, error => { });

  }

  getFloorPlan() {
    //
    // this.getUnits();
    // this.modalTitle = this.quoteTypeName;

    // this.floorTypeName = '..';
    // this.quoteservice.getFloorPlanDetails(this.quoteTypeId).subscribe(resp => {
    //   this.floorTypes = [];
    //   if (resp.statusCode === 200) {
    //     if (resp.result.length == 0) {
    //       this.isfp = false;
    //     } else {
    //       this.floorTypes = resp.result;
    //       if (this.floorTypes.length > 0) {
    //         this.isfp = true;
    //       }
    //       this.floorTypeName = resp.result[0].floorname;
    //       this.floorTypeId = resp.result[0].sgid;
    //       this.loadfpUnits(resp.result[0].sgid, this.quoteTypeId);
    //       //getFloorplanUnits(planId, quoteid ){
    //     }


    //   } else {

    //   }

    // }, error => { });

  }

  btnType1:any = '2'

hybrid(){
  if(this.btnType12){
    this.addtoMoodboardProduct();
    this.modalService.dismissAll();
    this.moodboardProduct('myMoodboard')
    // this.searchMoodBoardList();
    // this.getMoodBoardDetails(this.mbId);
  }else if(this.btnType1 != '2'){
    this.addtoMoodboardProduct();
    this.modalService.dismissAll();
    this.moodboardProduct('myMoodboard')
    // this.searchMoodBoardList();
    // this.getMoodBoardDetails(this.mbId);

  }
  else{
    this.toastr.error("Please select Rent or Buy");
  }
}

activeImage1(index) {
  this.varIndex = index;
  this.variationImages.forEach(element => {
    this.displayImage = element.default_images
  });
  this.displayImage = this.defaultImages[this.varIndex]?.image_url.large;
}

  addtoMoodboardProduct() {
    
    let  finalValue= this.btnType12 || this.btnType1;
    var mId = this.moodboardDetails?.moodboard.sgid;
    var mName = this.moodboardDetails?.moodboard.boardname;
    if (mId != 'undefined' && mId != null && mId != "") {
      this.spinner.show();
      let btnType = '0';
      // check which one is selected
      if ((<HTMLInputElement>document?.getElementById("rent"))?.checked) {
        btnType = (<HTMLInputElement>document?.getElementById("rent"))?.value;
      } else {
        btnType = (<HTMLInputElement>document?.getElementById("buy"))?.value;

      }

      var moodboardQty = (<HTMLInputElement>document.getElementById("commonQty")).value;
      var prodId = this.itemInfo.sgid.toString();
      // tslint:disable-next-line: max-line-length
      let userId = this.moodboardDetails?.moodboard?.userid;
      let other_user_id = this.auth.getProfileInfo('userId');
      if(this.moodboardDetails?.moodboard.userid !== this.auth.getProfileInfo('userId')){
        let items  = [{
          "product_ids":[this.itemInfo.sgid.toString()],
          "sku": this.variationsgid,
          "product_id": prodId,
          "button_type":btnType,
          "quantity": moodboardQty,
          "month":this.monthNums,
        }]
        this.updateMBChangesHistory({added_items:items})
      }
      this.mbs.addProdsToCart1(mId, [this.itemInfo.sgid.toString()], userId, this.variationsgid, prodId, moodboardQty, btnType,this.monthNums,other_user_id).subscribe(resp => {

        if (resp) {
          this.spinner.hide();
          this.getMoodBoardDetails(mId);
          this.toastr.success('Product added successfully to ' + mName + '.');
          this.searchMoodBoardList()
        }
      });
    }
    else {
      this.toastr.error("No moodboards avaliable");
    }
  }

  // addtoMoodboardProduct1() {

  //   var mId = this.moodboardDetails?.moodboard.sgid;
  //   var mName = this.moodboardDetails?.moodboard.boardname;
  //   if (mId != 'undefined' && mId != null && mId != "") {
  //     this.spinner.show();
  //     // check which one is selected
  //     if ((<HTMLInputElement>document?.getElementById("hybrid"))?.checked) {
  //       this.btnType = (<HTMLInputElement>document?.getElementById("hybrid"))?.value;
  //     } else if((<HTMLInputElement>document?.getElementById("rent"))){
  //       this.btnType = (<HTMLInputElement>document?.getElementById("rent"))?.value;
  //     }else{
  //       this.btnType = (<HTMLInputElement>document?.getElementById("buy"))?.value;
  //     }

  //     var moodboardQty = (<HTMLInputElement>document.getElementById("commonQty")).value;
  //     var prodId = this.itemInfo.sgid.toString();
  //     // tslint:disable-next-line: max-line-length
  //     this.mbs.addProdsToCart1(mId, [this.itemInfo.sgid.toString()], this.auth.getProfileInfo('userId'), this.variationsgid, prodId, moodboardQty, this.btnType,this.monthNums).subscribe(resp => {

  //       if (resp) {
  //         this.spinner.hide();
  //         this.getMoodBoardDetails(mId);
  //         this.toastr.success('Product added successfully to ' + mName + '.');
  //       }
  //     });
  //   }
  //   else {
  //     this.toastr.error("No moodboards avaliable");
  //   }
  // }


  addtoMoodboard(prod) {
    if (this.showAuth) {
      this.spinner.show();
      var moodboardQty = (<HTMLInputElement>document.getElementById("moodboard_qty")).value;
      var prodId = this.itemInfo.sgid.toString();
      // tslint:disable-next-line: max-line-length
      let userId = this.moodboardDetails?.moodboard?.userid;
      let other_user_id = this.auth.getProfileInfo('userId');
      this.mbs.addProdsToCart1(this.moodboardTypeId, [this.itemInfo.sgid.toString()], userId, this.variationsgid, prodId, moodboardQty,null,this.monthNums,other_user_id).subscribe(resp => {
        if (resp) {
          this.spinner.hide();
          this.moodboardDetails = resp;
          if (this.userInfo.userId === this.moodboardDetails.moodboard.userid) {
            this.showAuth = true;
          }
          if (this.moodboardDetails.moodboard.discount === null) {
            this.moodboardDetails.moodboard.discount = 0;
            this.moodboardDetails.moodboard.moodboard_discount_price = 0;
          }
          if (resp.moodboard_items.length > 0) {
            resp.moodboard_items.forEach(elem => {
              this.selectedProductIds.push(elem.product_id.toString());
              this.mbs.getImageUrl(elem.variation.images[0].image_url.small).subscribe(image => {
                elem.imagee = 'data:image/jpeg;base64,' + image.imageurl;
                this.selectedProducts.push(elem);
              });
            });
          }
          this.getMoodBoardDetails(this.moodboardDetails.moodboard.sgid);
          this.toastr.success('Product added successfully');
        }
      }, error => {
        this.spinner.hide();
        this.toastr.error('Error occured.');
      });
    } else {
      this.toastr.success('Please create a copy of this to modify Moodboard');
    }
  }
  removeProduct(prod) {
    this.spinner.show();
    // tslint:disable-next-line: max-line-length
    let userId = this.moodboardDetails?.moodboard?.userid;
    let other_user_id = this.auth.getProfileInfo('userId');
    if(this.moodboardDetails.moodboard.userid !== this.auth.getProfileInfo('userId')){
      let items  = [{
        "button_type": prod.button_type,
        "product_id": prod.product_id,
        "sku": prod.sku,
      }]
     this.updateMBChangesHistory({deleted_items:items})
    }  
    this.mbs.removeProduct({ moodboard_id: this.moodboardDetails.moodboard.sgid, button_type: prod.button_type, product_id: prod.product_id, user_id: userId, sku: prod.sku,other_user_id:other_user_id }).subscribe(resp => {
      this.getMoodBoardDetails(this.moodboardDetails.moodboard.sgid);
      this.searchMoodBoardList()
    });
  }
  async isCreatedZipCodeValid(){
    if(this.createMoodboardForm.value.zipcode){
      let data = {
        city_name: this.createMoodboardForm.value.city,
        state_id: this.createMoodboardForm.value.state.sgid,
        zipcode: this.createMoodboardForm.value.zipcode
      }
      return this.sharedService.validateZipCode(data).toPromise()
     }
  }
 
  async createMoodboard() {
    if(this.createMoodboardForm.value.zipcode){
      let status = false;
      try {
       status  = await this.isCreatedZipCodeValid();
      } catch (error) {
        
      }
    
     if(!status){
       this.toastr.warning('ZipCode Invalid');
       return;
     }
    }
    this.spinner.show();
    this.createMoodboardForm.value.moodboard_id = this.moodboardDetails.moodboard.sgid;
    this.createMoodboardForm.value.userid = this.auth.getProfileInfo('userId');
    this.createMoodboardForm.value.state = this.moodboardDetails.moodboard.states.sgid;
    this.createMoodboardForm.value.mb_type_detail = this.moodboardDetails.moodboard.mb_type_detail
    this.createMoodboardForm.value.moodboard_type = this.moodboardDetails.moodboard.boardtypeid.toString();
    delete this.createMoodboardForm.value.newCompanyName
    this.createMoodboardForm.value.copy="1";
    this.mbs.createMoodboard(this.createMoodboardForm.value).subscribe(data => {
      this.showCreateForm = false;
      this.showAllData = true;
      if (data) {
        this.route.navigate(['/moodboard-details', data.moodboard_id])
        this.spinner.hide();
      }

    }, error => () => {
      this.errorMsg = error;
      this.spinner.hide();

    });
  }


  invpopupModelShow(id) {
    $('#invpopup').show();
    for (let i = 0; i < this.warehouseLocations.length; i++) {
      if (this.warehouseLocations[i].warehouse_id == id) {
        this.AssignedInv = this.warehouseLocations[i].assigned_inv;
        this.B2bstorage = this.warehouseLocations[i].b2b_non_assigned_inv;
        this.invQuantity = this.warehouseLocations[i].non_assigned_inv;
      }
    }
  }

  invpopupModelHide() {
    $('#invpopup').hide();
  }

  setDetails(index) {
    this.commonQty == 1
    this.productName = this.itemInfo?.name;
    this.productId = this.itemInfo?.sgid;
    this.editProductName = this.itemInfo?.name;
    this.displayImage = this.itemInfo?.variations[index]?.default_images[0]?.image_url?.large;
    this.supplierName = this.itemInfo?.variations[index]?.supplier_name;
    this.activeIndex = index;
    // this.supplierPrice = this.itemInfo?.variations[index]?.orginal_price;
    this.categoryname = this.itemInfo?.category?.category_name;
    this.inhabitrPrice = this.itemInfo?.variations[index]?.asset_value;
    this.buyPrice = this.itemInfo?.variations[index]?.buyPrice;
    this.buyUsedPrice = this.itemInfo?.variations[index]?.buyUsedPrice;
    this.editPrice = this.itemInfo?.variations[index]?.asset_value;
    this.rentForMonth = this.itemInfo?.variations[index]?.default_price[0]?.month;
    this.rentPrice = this.itemInfo?.variations[index]?.default_price[24]?.rental_price;
    this.warehouseLocation = this.itemInfo?.variations[index].warehouse_location?.warehouse_name;
    this.updateOps = this.itemInfo?.updated_in_OPS;
    // this.quantity = this.itemInfo?.variations[index]?.quantity;
    this.sourcetype = this.itemInfo?.source; // source type not there source_type
    this.supplierSKU = this.itemInfo?.variations[index]?.product_number; //this.itemInfo?.supplier_sku; // not htere
    this.isOPsDb = this.itemInfo?.variations[index].is_ops_db;
    this.warehouseLocations = this.itemInfo?.variations[index]?.warehouse_location_new;

    let tots: number;
    let supTots: number;
    tots = 0;
    supTots = 0;
    this.itemInfo?.variations[index]?.warehouse_location_new.forEach(element => {
      if (element.is_inhabitr_warehouse == 'Y' && element.non_assigned_inv !== null) {
        tots += element.non_assigned_inv;
      }
      if (element.is_inhabitr_warehouse == 'N' && element.supplier_quantity !== null) {
        supTots += element.supplier_quantity;
      }
    });

    this.totalQtyOfSku = tots + supTots;

    if ((this.sourcetype.toLowerCase() === 'ops dashboard') || (this.isOPsDb === true && (this.sourcetype.toLowerCase() === 'api' || this.sourcetype.toLowerCase() === 'edi' || this.sourcetype.toLowerCase() === 'bookmarklet'))) {
      this.sku_variation_inhabitr = this.skunumber = this.inhabitrSKU = this.itemInfo?.source === 'Ops Dashboard' ? this.itemInfo?.variations[index]?.sku : this.itemInfo?.variations[index]?.inhabitr_sku;
    } else {
      this.skunumber = this.inhabitrSKU = '-';
      this.sku_variation_inhabitr = null;
    }

    this.commonQty == 1
    if (this.sourcetype.toLowerCase() === 'ops dashboard') {
      this.supplierPrice = null;
      this.inhabitrPrice = this.itemInfo?.variations[index]?.pricing_asset_value;
      if (this.itemInfo?.is_inventoryCount == 1) {
        this.TotalInv = this.itemInfo?.total_inv;
      } else {
        this.TotalInv = this.itemInfo?.variations[index]?.warehouse_location?.sum_inhabitr_quantity;
      }
      if (this.itemInfo?.variations[index]?.warehouse_location?.sum_supplier_quantity != null && this.itemInfo?.variations[index]?.warehouse_location?.sum_supplier_quantity == '') {
        this.SupplierInv = this.itemInfo?.variations[index]?.warehouse_location?.sum_supplier_quantity;
      } else {
        this.SupplierInv = 0;
      }


    } else if (this.sourcetype.toLowerCase() === 'API' || this.sourcetype.toLowerCase() === 'EDI' || this.sourcetype.toLowerCase() === 'bookmarklet') {
      this.supplierPrice = this.itemInfo?.variations[index]?.asset_value;

      this.inhabitrPrice = this.itemInfo?.variations[index]?.pricing_asset_value;
      this.SupplierInv = this.itemInfo?.variations[index]?.warehouse_location?.sum_supplier_quantity;
      if (this.itemInfo?.variations[index]?.warehouse_location?.sum_inhabitr_quantity != null && this.itemInfo?.variations[index]?.warehouse_location?.sum_inhabitr_quantity == '') {
        this.TotalInv = this.itemInfo?.variations[index]?.warehouse_location?.sum_inhabitr_quantity;
      } else {
        this.TotalInv = 0;
      }
      if (this.isOPsDb) {
        this.inhabitrPrice = this.itemInfo?.variations[index]?.pricing_asset_value;

      }


    }

    // this.skunumber = this.inhabitrSKU = this.itemInfo?.variations[index]?.sku;
    this.variationsgid = this.itemInfo?.variations[index]?.sgid;
    // this.isPublish = this.itemInfo?.status;
    this.invQuantity = this.itemInfo?.inventoryCount;
    this.is_inventoryCount = this.itemInfo?.is_inventoryCount;
    this.moodboard_count = this.itemInfo?.moodboard_count;
    this.prodmd_id = this.itemInfo?.product_id;
    this.Priduct_id = this.itemInfo?.variations[index]?.product_id;
    this.attribute = this.itemInfo?.variations[index]?.attribute_info;

    this.AssignedInv = this.itemInfo?.assigned_inv;
    this.B2bstorage = this.itemInfo?.b2b_storage_inv;

  }
  getItem(id, content) {
    this.searchMoodBoardList()
    this.prod_id = id;
    this.spinner.show();
    this.commonQty = 1
    this.shop.getItem(id).subscribe(
      resp => {
        this.spinner.hide();
        this.itemInfo = resp.result;
        this.variationImages = this.itemInfo.variations;
        this.variationImages.forEach(element => {
          this.defaultImages = element.default_images
        });
        let index = this.variationImages.findIndex(x=> x.sgid== content);        
        if(index<0){
          index = 0;
        }
        // tslint:disable-next-line: max-line-length
        // this.inhabitrPrice = parseFloat(this.itemInfo.salePrice) + this.getPercentageValue(this.itemInfo.salePrice, this.inhabitrPercentage);
        // this.setDetails(0);
        this.setDetails(index);
        if (this.itemInfo.features) {
          this.features = this.itemInfo.features.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '');

        }
        if (this.itemInfo.description) {
          this.description = this.itemInfo.description.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '');
        }
        this.btnType12='';
        this.modalService.open(content, this.modalOptions).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

      }, err => {
        this.spinner.hide();
      });
  }
  getInventeryqty() {
    this.item.getInventoryqty(this.prod_id, this.sku_variation_inhabitr).subscribe(resp => {

      this.TotalInv = resp.result.total;
      this.is_inventoryCount = 1;
      this.AssignedInv = resp.result.assigned;
      this.invQuantity = resp.result.nonassigned;
      this.B2bstorage = resp.result.b2bnonassigned;

      // sessionStorage.setItem('isinventry', this.prod_id);
      // sessionStorage.setItem('isinventryqty', this.invquantity);
      this.toastr.success(resp.message);

    });

  }

  activeImage(index) {
    let variation = this.variationImages[index];
    this.getItem(this.prod_id,variation.sgid);
    this.skunumberarray = index;
    // this.shouldshow = false;

    //  this.el.nativeElement.querySelector('.img-thumbnail').classList.remove("selected");
    //    this.render.addClass($event.target, 'selected');
    this.setDetails(index);

  }

  updateSkuvalue(event) {
    this.skunumber = event.target.value;
  }

  captureScreen() {
    this.pdfservice.pdfGeneration();
  }
  generateMBPDF() {
    this.pdfservice.generateMBPDF();
  }


  getSupplierPartner() {

    let scId = [];
    let whId = [];
    let spId = [];
    let fs = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : '';
    if (fs) {
      scId = fs.filter(x => x.type === 'category').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
      whId = fs.filter(x => x.type === 'ware').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
      spId = fs.filter(x => x.type === 'supplier').map(x => x.selections).filter((ele) => { return ele.length !== 0; });
    }

    this.supplierPartnerFlag = true;
    this.onlyWarehouseFlag = false;

    let selectedSupplyPartnerList = JSON.parse(localStorage.getItem('selectedSupplierPartnerList1'));
    if (selectedSupplyPartnerList) {
      this.supplierPartnerList = selectedSupplyPartnerList;
    } else {
      if (spId.length > 0 || scId.length > 0) {
        if (spId.length == 0) {
          spId[0] = null;
        }
        if (whId.length == 0) {
          whId[0] = null;
        }
        if (scId.length == 0) {
          scId[0] = null;
        }
        this.shop.getSupplierWarehouseFilter(spId[0], whId[0], scId[0]).subscribe(
          resp => {
            this.warehouse = resp.data;
            this.supplierPartnerList = [];
            this.warehouse.forEach(element => {
              let supParObj = {};
              supParObj['sgid'] = element.warehouse;
              supParObj['wsgid'] = element.sgid;
              supParObj['warehouse_name'] = element.warehouse_name;
              supParObj['count'] = element.count;
              supParObj['selected'] = false;
              supParObj['spid'] = element.supplier;
              supParObj['type'] = 'ware';
              this.supplierPartnerList.push(supParObj);
            });
          }, err => {
          }
        );
      } else {
        this.shop.getSupplierPartner().subscribe(
          resp => {
            this.warehouse = resp.data;
            this.supplierPartnerList = [];
            this.warehouse.forEach(element => {
              let supParObj = {};
              supParObj['sgid'] = element.warehouse;
              supParObj['wsgid'] = element.sgid;
              supParObj['warehouse_name'] = element.warehouse_name;
              supParObj['count'] = element.count;
              supParObj['selected'] = false;
              supParObj['spid'] = element.supplier;
              supParObj['type'] = 'ware';
              this.supplierPartnerList.push(supParObj);
            });
          }, err => {
          }
        );
      }
    }
    this.supplierPartnerFlag = true;
    this.onlyWarehouseFlag = false;
  }

  async resetFilter() {
    localStorage.getItem("selectedProductFilters1")
    // this.attributenames = '';
    // this.attrselected = false;
    // this.attributesLists = [];
    // this.objattr = {};
    // this.categorySel = false;
    // this.wareCategory = false;
    // this.isLoadMore = false;
    // this.isFilterFlag = false;
    // this.catSel = false;
    // this.catSelWareHouse = false;
    // this.catSelSupplier = false;
    // this.start = 0;
    // this.count = 20;
    // this.isfilterenable = false;
    // this.selectedProductFilters.length = 0;
    // this.publishStatus = '';
    // this.selectedPriceRangeList = [];
    // this.isPublish = null;
    // this.isUnpublish = null;
    // this.isPublishOps = null;
    // this.isUnpublishOps = null;
    // this.selectedCategoryIds = [];
    // this.selectedSupplierIds = [];
    // this.spIds = [];
    // this.selectedWarehouseIds = [];
    // this.selectedPriceRangeStart = [];
    // this.selectedPriceRangeEnd = [];
    // this.parameters = '';
    // this.types = [];
    // this.supplierFileterID = [];
    // this.supplierFileterName = [];
    // this.selectedminval='Select Min Value';
    // this.selectedmaxval='Select Max Value';
    // this.isSupplier = false;
    // this.isWare = false;
    // this.selectedSupplierPartnerList = [];


    // this.invMinVal = 0;
    // this.invMaxVal = 0;
    // this.invValType = '';
    localStorage.removeItem('inv_slider_type');
    localStorage.removeItem('invTypeArray');
    localStorage.removeItem('inv_slider_start');
    localStorage.removeItem('inv_slider_end');
    // this.invTypeArr = [];
    // this.selectedminvalInv = '';
    // this.selectedmaxvalInv = '';
    // this.isInv = false;
    // this.isinvType = false;
    // this.assetInvStatus = true;
    // this.inventoryAttr = [
    //   { name: 'inhabitr', selected: false, DisplayName: 'Inhabitr Inv', disable: false },
    //   { name: 'supplier', selected: false, DisplayName: 'Supplier Inv', disable: false },
    //   { name: 'all', selected: false, DisplayName: 'Either Inhabitr Inv OR Supplier Inv', disable: false },
    //   { name: 'both', selected: false, DisplayName: 'Both Inhabitr Inv AND Supplier Inv', disable: false }
    // ];

    // this.parameters = '&category=null&supplier=null&warehouse=null'
    // localStorage.setItem('parameters', this.parameters);
    localStorage.removeItem('categoryList');
    localStorage.removeItem('supplierList');
    localStorage.removeItem('selectedProductFilters');
    localStorage.removeItem('selectedSupplierPartnerList');
    localStorage.removeItem('selectedWarehouseList');
    localStorage.removeItem('priceRangesList');
    localStorage.removeItem('selectedPriceRangeList');
    localStorage.removeItem('publishStatus');
    localStorage.removeItem('selectedPriceRangeStart');
    localStorage.removeItem('selectedPriceRangeEnd');
    localStorage.removeItem('filterSelections');
    localStorage.removeItem('warehouseList');
    localStorage.removeItem('types');
    localStorage.removeItem('price_slider_start');
    localStorage.removeItem('price_slider_end');
    localStorage.removeItem('attributenames');
    
    // await this.getAllProducts();
    // this.filterSelections = [];
    // this.filterSelections.length = 0;
    // this.supplierPartnerList = [];
    // this.categoryList = [];
    // this.supplierList = [];
    // this.priceRangesList = [];
    // this.warehouseList = [];
    // this.getCategories();
    // this.getSuppliers();
    // this.getWarehouse();
    // this.getPriceRange();
    // this.resetPrice();
    // this.location = this.location.map(x=>{
    //   x.selected = false;
    //   return x;
    //   })

  }
  async resetFilter1() {
    this.attributenames = '';
    this.attrselected = false;
    this.attributesLists = [];
    this.objattr = {};
    this.categorySel = false;
    this.wareCategory = false;
    this.isLoadMore = false;
    this.isFilterFlag = false;
    this.catSel = false;
    this.catSelWareHouse = false;
    this.catSelSupplier = false;
    this.start = 0;
    this.count = 12;
    this.isfilterenable = false;
    // this.selectedProductFilters.length = 0;
    this.selectedProductFilters1 = [];
    this.publishStatus = '';
    this.selectedPriceRangeList = [];
    this.isPublish = null;
    this.isUnpublish = null;
    this.isPublishOps = null;
    this.isUnpublishOps = null;
    this.selectedCategoryIds = [];
    this.selectedSupplierIds = [];
    this.spIds = [];
    this.selectedWarehouseIds = [];
    this.selectedPriceRangeStart = [];
    this.selectedPriceRangeEnd = [];
    this.parameters = '';
    this.types = [];
    this.supplierFileterID = [];
    this.supplierFileterName = [];
    // this.selectedminval='Select Min Value';
    // this.selectedmaxval='Select Max Value';
    this.isSupplier = false;
    this.isWare = false;
    // this.selectedSupplierPartnerList = [];


    this.invMinVal = 0;
    this.invMaxVal = 0;
    this.invValType = '';
    localStorage.removeItem('inv_slider_type');
    localStorage.removeItem('invTypeArray');
    localStorage.removeItem('inv_slider_start');
    localStorage.removeItem('inv_slider_end');
    this.invTypeArr = [];
    this.selectedminvalInv = '';
    this.selectedmaxvalInv = '';
    this.isInv = false;
    this.isinvType = false;
    this.assetInvStatus = true;
    this.inventoryAttr = [
      { name: 'inhabitr', selected: false, DisplayName: 'Inhabitr Inv', disable: false },
      { name: 'supplier', selected: false, DisplayName: 'Supplier Inv', disable: false },
      { name: 'all', selected: false, DisplayName: 'Either Inhabitr Inv OR Supplier Inv', disable: false },
      { name: 'both', selected: false, DisplayName: 'Both Inhabitr Inv AND Supplier Inv', disable: false }
    ];

    this.parameters = '&category=null&supplier=null&warehouse=null'
    localStorage.setItem('parameters1', this.parameters);
    localStorage.removeItem('categoryList1');
    localStorage.removeItem('supplierList1');
    localStorage.removeItem('selectedProductFilters1');
    localStorage.removeItem('selectedSupplierPartnerList1');
    localStorage.removeItem('selectedWarehouseList1');
    localStorage.removeItem('priceRangesList1');
    localStorage.removeItem('selectedPriceRangeList1');
    localStorage.removeItem('publishStatus1');
    localStorage.removeItem('selectedPriceRangeStart1');
    localStorage.removeItem('selectedPriceRangeEnd1');
    localStorage.removeItem('filterSelections1');
    localStorage.removeItem('warehouseList1');
    localStorage.removeItem('types1');
    localStorage.removeItem('price_slider_start1');
    localStorage.removeItem('price_slider_end1');
    localStorage.removeItem('attributenames1');
    
    await this.getAllProducts();
    this.filterSelections = [];
    this.filterSelections.length = 0;
    this.supplierPartnerList = [];
    // this.categoryList = [];
    // this.supplierList = [];
    // this.priceRangesList = [];
    // this.warehouseList = [];
    this.getCategories();
    this.getSuppliers();
    this.getWarehouse();
    this.getPriceRange();
    this.resetPrice();
    this.location = this.location.map(x=>{
      x.selected = false;
      return x;
      })
      this.supplierList = this.supplierList.map(x=>{
        x.selected = false;
        return x;
        })  
        this.shop.productsCountInCategorys('').subscribe(data => {
    
          this.countOfCategorys = data.result
         
        })
        // this.shop.productsCountInCategorysWarehouse('',null).subscribe(data =>{
        //   this.countOfCategorys = data.result
        // })

  }
  async removeattributefilter() {
    this.selctedattributename = [];
    this.attributenames = '';
    this.selectedattributelist = [];
    this.attributenames = [];
    this.attributeList = [];
    this.attrselected = false;
    this.categorySel = false;

    this.attributesLists = [];
    this.objattr = {};
    localStorage.removeItem('attributeList1');
    localStorage.removeItem('attributenames');
    localStorage.removeItem('attributeids');
    this.getAttributes();
    this.getParameter();
    this.getAllProducts();
  }

  // ngOnDestroy() {
  //   this.attributenames = '';
  //   this.categorySel = false;
  //   this.wareCategory = false;
  //   this.isLoadMore = false;
  //   this.isFilterFlag = false;
  //   this.catSel = false;
  //   this.catSelWareHouse = false;
  //   this.catSelSupplier = false;
  //   this.start = 0;
  //   this.count = 20;
  //   this.isfilterenable = false;
  //   this.selectedProductFilters = [];
  //   this.publishStatus = '';
  //   this.selectedPriceRangeList = [];
  //   this.isPublish = null;
  //   this.isUnpublish = null;
  //   this.isPublishOps = null;
  //   this.isUnpublishOps = null;
  //   this.selectedCategoryIds = [];
  //   this.selectedSupplierIds = [];
  //   this.supplierFileterID = [];
  //   this.supplierFileterName = [];
  //   this.spIds = [];
  //   this.selectedWarehouseIds = [];
  //   this.selectedPriceRangeStart = [];
  //   this.selectedPriceRangeEnd = [];
  //   this.parameters = '';
  //   this.types = [];
  //   this.isSupplier = false;
  //   this.isWare = false;
  //   localStorage.removeItem('parameters');
  //   localStorage.removeItem('categoryList');
  //   localStorage.removeItem('supplierList');
  //   localStorage.removeItem('selectedProductFilters');
  //   localStorage.removeItem('selectedSupplierPartnerList');
  //   localStorage.removeItem('selectedWarehouseList');
  //   localStorage.removeItem('priceRangesList');
  //   localStorage.removeItem('selectedPriceRangeList');
  //   localStorage.removeItem('publishStatus');
  //   localStorage.removeItem('selectedPriceRangeStart');
  //   localStorage.removeItem('selectedPriceRangeEnd');
  //   localStorage.removeItem('filterSelections');
  //   localStorage.removeItem('warehouseList');
  //   localStorage.removeItem('types');
  //   localStorage.removeItem('price_slider_start');
  //   localStorage.removeItem('price_slider_end');
  //   localStorage.removeItem('attributenames');
  // }
  updateRent(event) {
    this.monthNums = event.target.value;
    let temp = 36 - (this.monthNums);
    this.rentPrice = this.itemInfo?.variations[this.activeIndex]?.default_price[temp]?.rental_price;

    // this.rentPrice = this.itemInfo?.variations[0]?.default_price[event.target.value - 1]?.rental_price;
    // if (this.monthNums == 1) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[11]?.rental_price;
    // } else if (this.monthNums == 2) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[10]?.rental_price;
    // } else if (this.monthNums == 3) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[9]?.rental_price;
    // } else if (this.monthNums == 4) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[8]?.rental_price;
    // } else if (this.monthNums == 5) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[7]?.rental_price;
    // } else if (this.monthNums == 6) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[6]?.rental_price;
    // } else if (this.monthNums == 7) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[5]?.rental_price;
    // } else if (this.monthNums == 8) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[4]?.rental_price;
    // } else if (this.monthNums == 9) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[3]?.rental_price;
    // } else if (this.monthNums == 10) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[2]?.rental_price;
    // } else if (this.monthNums == 11) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[1]?.rental_price;
    // } else if (this.monthNums == 12) {
    //   this.rentPrice = this.itemInfo?.variations[0]?.default_price[0]?.rental_price;
    // }
  }

  getQuoteInventeryqty() {
    this.item.getquoteInventoryqty(this.prod_id, this.sku_variation_inhabitr).subscribe(resp => {
      this.AssignedtoquoteInv = resp.productQuoteCount;
      this.toastr.success(resp.message);

    });

  }
  AddVariationProduct() {
    const obj = {
      moodboard_id: this.moodboard_id,
      product_id: this.prod_id,
      userid: this.userInfo.userId,
      sku: this.variationsgid
    };
    this.item.AddVariationProduct(obj).subscribe(resp => {
      this.isadd = true;

      // $('#detailsmodal').modal('hide');
      if (resp.statusCode == 200) {
        this.getMoodBoardDetails(resp.moodboard.sgid);

        this.toastr.success('Item added to the Moodboard');

      } else if (resp.statusCode == 502) {
        this.toastr.error(resp.result);
      }

    });


  }
  getSearchItems() {
    this.item.searchItems(this.InventorySelected,this.startvalue, this.searchproduct).subscribe(resp => {
      this.onSuccess(resp);
    });
  }
  getAttributes() {
    let r = new URL('http://abcd.com?' + this.parameters);
    if(r.searchParams.get('category') !='null') {
      this.shop.getAttributes(r.searchParams.get('category')).subscribe(resp => {
        this.attributesLists = resp.result;
  
  
        // this.attributeList = [];
        // this.attributeList.push(element);
        this.attributesLists.forEach(element => {
          // element.selected = false;
          element.attribute_list.forEach(e => {
            e.selected = false;
          });
  
        });
        localStorage.setItem('attributeList1', JSON.stringify(this.attributesLists));
  
      }, err => {
      }
  
      );
    }
    
  }
  getAttributes1() {
    let r = new URL('http://abcd.com?' + this.parameters);
    if(r.searchParams.get('category') !='null') 
    this.shop.getAttributes(r.searchParams.get('category')).subscribe(resp => {

      this.attributesLists = JSON.parse(localStorage.getItem('attributeList1'));

    }, err => {
    }

    );
  }
  getSelectedattributes(event, val, type, index) {

    let arr = event.target.value.split('@');
    this.attrselected = true;

    let attrlist = JSON.parse(localStorage.getItem('attributeList1'));
    attrlist[index].attribute_list.forEach(element => {
      if (element.sgid == arr[0]) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });





    this.selectedattributelist.push(arr[0]);
    this.selectedattributelist = this.selectedattributelist.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    let subattributename = '';
    let obj = {
      name: '',
      value: ''
    };

    for (let i = 0; i < attrlist[index].attribute_list.length; i++) {
      if (attrlist[index].attribute_list[i].selected == true) {
        subattributename = attrlist[index].attribute_list[i].attribute_value;
      }
    }
    this.attributesLists = attrlist;
    this.objattr = JSON.parse(localStorage.getItem('attributenames')) ? JSON.parse(localStorage.getItem('attributenames')) : {};
    localStorage.setItem('attributeList1', JSON.stringify(this.attributesLists));
    if (this.objattr[attrlist[index].name]) {
      this.objattr[attrlist[index].name] = subattributename;
      localStorage.setItem('attributenames', JSON.stringify(this.objattr));
    } else {
      this.objattr[attrlist[index].name] = subattributename;
      localStorage.setItem('attributenames', JSON.stringify(this.objattr));
    }

    this.selctedattributename = JSON.parse(localStorage.getItem('attributenames'));

    this.namesattr = Object.keys(this.objattr);

    this.attributenames = '';
    for (let i = 0; i < this.namesattr.length; i++) {

      this.attributenames = this.attributenames + ',' + this.namesattr[i] + ':' + this.objattr[this.namesattr[i]];
    }
    this.attributenames = this.attributenames.substring(1);
    //  if (this.selctedattributename.length > 0) {
    //   this.attributenames = this.selctedattributename.join(',');
    // }

    // for(var i=0;i< values.length)

    // obj.name=attrlist[index].name;
    // obj.value=subattributename;
    // this.selctedattributename.push(attrlist[index].name+':'+subattributename]);
    //   if(this.selctedattributename.length>0)
    //   {
    //     for(var i=0;i<this.selctedattributename.length;i++)
    //     {
    //   // if(this.selctedattributename[i].name.includes(obj.name))
    //   // {
    //     this.selctedattributename[i].
    //     this.selctedattributename.forEach(element => {
    //       if(element.name==obj.name)
    //       {
    //         element.value=obj.value;
    //       }
    //       else{
    //         this.selctedattributename.push(obj);

    //       }
    //     });
    //  // }
    //   // else
    //   // {
    //   //   this.selctedattributename.push(obj);
    //   //   break;
    //   // }
    // }
    // }
    // else{
    //   this.selctedattributename.push(obj);
    // }

    // if (this.selctedattributename.length > 0) {
    //   this.attributenames = this.selctedattributename.join(',');
    // }

    this.selectedattributelist.push(arr[0]);
    this.selectedattributelist = this.selectedattributelist.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    localStorage.setItem('attributeids', JSON.stringify(this.selectedattributelist));
    this.getParameter();
    this.getAllProducts();

  }
  alertforcategory() {
    this.toastr.error('Please select category');
  }

  selectOrcreate(addToQuote) {
    this.modalService.open(addToQuote, this.modalOptions2).result.then((result) => {
    }, (reason) => {
    });
  }
  createQuotesPopUp(createQuotes) {
    this.modalService.open(createQuotes, this.modalOptions2).result.then((result) => {
    }, (reason) => {
    });
  }

  sumTotal(totData) {
    let invTotal: number;
    invTotal = 0;
    totData.forEach(tot => {
      if (tot.is_inhabitr_warehouse == 'Y' && tot.non_assigned_inv !== null) {
        invTotal += parseFloat(tot.non_assigned_inv)
      }
    });

    return invTotal;
  }

  sumSUpplierTotal(sData) {
    let supTotal: number;
    supTotal = 0;
    sData.forEach(stot => {
      if (stot.is_inhabitr_warehouse == 'N' && stot.supplier_quantity !== null) {
        supTotal += parseFloat(stot.supplier_quantity)
      }
    });

    return supTotal;
  }

  onChange(event:any){
    this.btnType1 =event
    this.searchMoodBoardList()
    // location.reload()

   }

  updateRent1(event) {
    this.monthNums1 = event.target.value;
    let temp = 36 - (this.monthNums1 || this.moodboardDetails?.moodboard_items[0].months);
    this.rentPrice = this.itemInfo?.variations[this.activeIndex]?.default_price[temp]?.rental_price;
    this.searchMoodBoardList()
  }
  updatedMbDetails:any;
  val:string
  searchMoodBoardList(){
    let obj ={
      "mood_board_id":this.mbId,
      "button_type":this.btnType1,
      "month":this.monthNums1
    }
    this.cMbService.moodBoardList(obj).subscribe((response:any)=>{
      
      this.updatedMbDetails = response;
      
      if(response && response?.moodboard_items){
        response?.moodboard_items?.forEach(elem => {
          this.mbs.getImageUrl(elem.variation?.images[0].image_url.small).subscribe(image => {
            elem.imagee = 'data:image/jpeg;base64,' + image.imageurl;
          });
        this.moodboardDetails.moodboard_items = response?.moodboard_items;
      })
     }

     if(this.moodboardDetails?.moodboard.userid !== this.auth.getProfileInfo('userId')){
      if(this.btnType1 == 1){
        this.val = 'buy'
      }else if(this.btnType1 == 0){
        this.val = 'ret'
      }else{
        this.val = 'hybrid'
      }
      let items  = [{
        "mood_board_id":this.mbId,
        "updated":this.val,
        "original": 'hybrid'
      }]
      this.updateMBChangesHistory({changed_mb_type:items})
    }
      // this.getMoodBoardDetails(this.mbId)
    })
  }

  share(share){
    this.modalService.open(share, this.modalOptions3).result.then((result) => {
    }, (reason) => {
    });
  }
  emailAdd:any;
  shareMd(){
    let obj ={
      email:this.emailAdd,
      url:location.href,
      user_id:this.auth.getProfileInfo('userId')
    }
    this.cMbService.shareMoodboard(obj).subscribe((resp: any) => {
        this.toastr.success(resp.message);
        if (resp.statusCode == 200) {
          // this._dialogRef.close(true);
        } else {
          // this._dialogRef.close(false);
        }
      });
  }
  changeStatus(){
    let status
    if(this.MoodboardPublic){
      status = 1;
      this.showAuth = true;
    }
    else {
      if (this.userInfo.userId === this.moodboardDetails.moodboard.userid) {
        this.showAuth = true;
        status = 0;
      }
      else{
        status = 0;
        this.showAuth = false;
      }
      
    }
    this.item.updateMoodboardPublic(this.mbId,status).subscribe((res)=>{
    },error=>{
    });
  }
  moodboardProduct(data){
    this.showMoodBoard=data
  }
  filters:any
  countOfCategorys:any;
  filterCityId:any;
  warehouseId
  fs
  cityId:any
  productsCountInCategory() {
    this.fs = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : this.fs;
    this.fs?.forEach((ele) => {
      if (ele.type === "loc") {this.cityId = ele.selections;}    
    })
    this.shop.productsCountInCategorys(this.cityId).subscribe(data => {
      if (data) {
        this.countOfCategorys = data.result;
        // this.getCategories();
        let filter = [];
        filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "supplier");
        this.countOfCategorys?.forEach((element) => {
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
          element.type = "supplier";
        });
      }
    })
  }

  warehousesCountInCategory() {
    this.fs = JSON.parse(localStorage.getItem('filterSelections1')) ? JSON.parse(localStorage.getItem('filterSelections1')) : this.fs;
    this.fs?.forEach((ele) => {
      if (ele.type === "ware") {this.warehouseId = ele.selections;}    
    })
    this.shop.productsCountInCategorysWarehouse(this.warehouseId,null).subscribe(data => {
      if (data) {
        this.countOfCategorys = data.result;
        this.getCategories();
        let filter = [];
        filter = JSON.parse(localStorage.getItem("filter")) ? JSON.parse(localStorage.getItem("filter")) : filter;
        let selectedFiler = filter.find((x) => x.type === "supplier");
        this.countOfCategorys?.forEach((element) => {
          element.selected = selectedFiler && selectedFiler.selected.includes(element.sgid) ? true : false;
          element.type = "supplier";
        });
      }
    })
  }
  nagivateToProject(event){
    if(event.target.value){
      this.route.navigate(['/admin/projects/create'],{ queryParams: { id:event.target.value,step:'4' }});
    }
  }
}
