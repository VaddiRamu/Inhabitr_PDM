import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuoteService } from '../../services/quote.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateMoodboardService } from '../../services/create-moodboard.service';
import { throwIfEmpty } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from '../../services/items.service';
import { PdfGenerationService } from './pdf-generation.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { SharedService } from '../../services/shared.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

declare var $: any;

@Component({
  selector: 'app-edit-quote',
  templateUrl: './edit-quote.component.html',
  styleUrls: ['./edit-quote.component.css'],

})
export class EditQuoteComponent implements OnInit {
  quoteTotal: any={
    quote_type:'',
    result:'',
    more_less:''
  }
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('content1', { static: false }) content1: ElementRef;
  @ViewChild('content2', { static: false }) content2: ElementRef;

  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  attribute: any;
  isFloorPlan = true;
  floorPlanClass = 'active';
  unitClass = '';
  viewFloorPlan = false;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  zipcodePattern = '';
  phoneNoPattern = '^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$';
  customerInfoForm;
  selectedState = 'Fetching States...';
  selectedStateId: number;
  selectedCity = 'Fetching City...';
  selectedCityId: number;
  cities = [];
  service_array = []
  service_array_in = []
  states = [];
  ps_data_price = {}
  fnl_mnths = 12
  ps_data_price_in = {}
  fnl_mnths_in = 12;
  productId: any;

  isSubmitted = false;
  quoteId: number;
  editCustomer = false;
  updateinfo: boolean;
  quotePublic: any;
  quoteB2B: any = false;

  invQuantity = 0;
  TotalInv = 0;
  SupplierInv = 0;
  AssignedInv = 0;
  UnassignedInv = 0;
  AssignedtoquoteInv = 0;
  B2bstorage = 0;
  prod_id: any;
  is_inventoryCount = 0;
  warehouseLocations: any = [];
  TotalAssetValue = 0;
  isSelectedAll = true;
  monthNums = 12;
  DeleveryFeeedit: any;
  PickupFeeedit: any;
  UserId: any;
  unit: any;
  unitname: any;
  fp_unitname: any;
  floorTypes: any;
  floorTypename: string;
  floorTypeId: number;
  sgid: number;
  b2bDiscountdefault: any = 0;
  floorPlanName: string;
  floorPlanUnit: string;
  quoteIdedit: number;
  floorTypenameedit: string;
  floorTypeIdedit: number;
  floorPlanNameedit: string;
  floorPlanUnitedit: string;
  floorPlans = [];
  floorPlanNames = [];
  isOPsDb: any;
  updateOps: any;

  FloorPlanDetails = [];

  unitWOPlans = [];
  nodatafound: boolean;
  nodatafoundUnit: boolean;
  Unitcount: any;
  unitdeliveryfee: any = 0;
  unitpickupfee: any = 0;
  isRemoveUnit = false;
  isRemoveFloor = false;
  quotationData: any;

  quotation: any;
  copyofquotationData: any;
  ngselectedCity: any;
  ngselectedState: any;
  cInfo: any;
  unitInFloorPlan: any;
  modalOptions: NgbModalOptions;
  itemInfo: any;
  cusName: any;
  cusAddress: any;
  cus_zipcode: any;
  cus_email: any;
  cus_contact: any;
  company_name: any;
  project_name: any;
  preferred_delivery_start_date:any;
  preferred_delivery_end_date:any;
  project_id: any;
  company_id: any;
  order_number_ref: any;
  is_order: any;
  // floorplan
  fpName: string;
  fpFloorTypename: string;
  fpmoodboard: any;
  fpUnit: any;
  fpFloorPlanId: any;
  fpMoodboardList: any;
  fpUnitList: any;
  fpMymblist: any;
  ismb = false;
  fpselectedmbType: string;
  fpselectedmbTypeId: any;
  fpsgid: any;
  // floorplan
  // details
  productName: string;
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
  rentForMonth = 0;
  rentPrice = 0;
  warehouseLocation: string;
  warehouseLocationid: any;
  warehouse_name: any = 'Chicago Warehouse';
  quantity = 0;
  sourcetype: string;
  supplierSKU: string;
  inhabitrSKU: string;
  sku_variation_inhabitr: string;
  description: string;
  features: string;
  closeResult: string;
  isFloorplanview = false;
  floorplan_id: any;
  // details modal end
  // single unit asdd variable
  isSgUnitAdd = false;
  isSgUnitRemove = false;
  sgUnitname = '';
  sgSelectedUnit = '5';
  sgSelectedUnitId: number;
  sgSelectedFloorPlanId: number;
  sgSelectedFloorPlan = 'No floor plan found';
  sgSelectedMbId: number;
  sgSelectedMb = 'No Moodboard found';
  sgUnitMbList: any;
  sgslectedmbimage: any;
  directProdList: any;
  // single unit add variable end
  addCompany = false;
  companyList = [];
  selectedCompany: any = {};
  addProject = false;
  projectList: any = [];

  // unit summary
  unitsummary: any;
  moodboardsummary: any;
  floorPlanProductsummary: any;
  unitLevelProducts: any;
  u_unitid: any;
  copyofunitLevelProducts: any;
  unitSubTotal: any;
  unitDiscount: any;
  Deleveryfee: any;
  pickupfee: any;
  unitDiscountPrice: any;
  unitMonthlyRent: any;
  isRemoveFloorPlanItem = false;
  isRemoveUnitItem = false;
  model: any;
  searching = false;
  searchFailed = false;
  checkNumberOnly: any = 0;
  currentPage: any;
  // unit summary
  // copy quote
  isCopyQuote = false;
  isorderCreated = 'Create';
  // copy quote
  // unit summary item level
  mbsummaryTable: any;
  floorplanSummaries: any;
  floorplandetails: any;
  copyoffloorplanSummariescopy: any;

  f_unitId: any;
  f_discount: any;
  f_subtotal: any;
  f_discountPrice: any;
  f_monthly_rent: any;
  f_delivery_fee: any;
  f_tax_amount: any;
  f_net_total: any;
  f_Tot_discount: any;
  f_Tot_discountPrice: any;
  f_Tot_net_total: any;
  f_Tot_monthly_rent: any;
  f_Tot_delevery_fee: any;
  f_Tot_pickup_fee: any;
  fpdeliveryfee: any;
  fppickupfee: any;
  imagePDFData = [];
  selectedProductIds = [];
  selectedProducts = [];
  // test:any = this.quotationData.quote.rent_discount

  /**
   * Quotation Summary table variables
   */
  quoteProductList = [];
  quoteInfo: any = {};
  quoteDeliveryFee : number;
  quoteOrderDeliveryFee;
  quotePickupFee;
  quotePublicToBus = false;

  /**
  * Floor Plan summary Variables
  */
  floorPlanData = [];
  floorPlanInfo: any = {};
  unitInfo: any = {};
  taxRate: string = "0";
  isBuyCard = true;

  /**
   * Unit Summary Variables
   */
  selectedUnit;
  quoteItemStatus: '0' | '1' | '2' = '2';

  monthNums1 = 12;
  rentAdjustmentType: any;
  rentAdjstType: any;
  afterAdjtotal: number;
  userAddedDiscount: any;
  rentManualAdjust: boolean = false;
  adjustedRentDiscount: any = 0;
  initialLoad: boolean = true
  remsg: any;
  saveQRes: any;
  resignitem: any;
  resignOriginalItem = [];
  originalQuantity: any[];
  resignQuantity: any;
  resignSignalQuantity: any;
  deliveryFeeShow: any;
  unitLevel_buy_dis: any;
  fileElement: any;
  createOrderForm:FormGroup;
  email: any;
  quote_ID: any;
  //activeModal: any;

  constructor(private formBuilder: UntypedFormBuilder,
    private spinner: NgxSpinnerService,
    private quoteService: QuoteService,
    private ls: LocalStorageService,
    private toastr: ToastrService,
    private aroute: ActivatedRoute,
    private modalService: NgbModal,
    private shop: ItemsService,
    private mbs: CreateMoodboardService,
    private route: Router,
    private pdfservice: PdfGenerationService,
    private http: HttpClient, private item: ItemsService,
    private el: ElementRef,
    private confirmationDialogService: ConfirmationDialogService,
    private sharedservice: SharedService,
    private cMbService: CreateMoodboardService,
    private toasterService: ToastrService,
    private fb:FormBuilder,
   // public activeModal: NgbActiveModal

  ) {


    this.modalOptions = {
      size: 'lg',
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      centered: true,
      windowClass: 'rangepopup'
    };

    this.customerInfoForm = this.formBuilder.group({
      name: [this.cusName, Validators.required],
      address: [this.cusAddress, Validators.required],
      email: [this.cus_email, [Validators.required, Validators.email]],
      contact_no: [this.cus_contact, Validators.required],
      zipcode: [this.cus_zipcode, Validators.required],
      companyName: [this.company_name, Validators.required],
      project_id: ['', Validators.required],
      company_id: ['', Validators.required],
      project_name: [this.project_name, Validators.required],
      preferred_delivery_start_date : [this.preferred_delivery_start_date],
      preferred_delivery_end_date : [this.preferred_delivery_end_date],
    });

  }

  ngOnInit(): void {
    let Userdetails = this.ls.getFromLocal();
    this.UserId = Userdetails.userId;
    this.updateinfo = false;
    //  this.quoteId = 1;
    this.quoteId = this.aroute.snapshot.params.id;
    this.getquoteDetails(this.quoteId);
    this.currentPage = this.route.url
    // this.getStates();
    // this.getFloorTypes();
    this.getFloorPlans();
    // this.getUnits();
    this.getMymoodboards();
    this.getFloorPlansByUser();
    this.getquotation(this.quoteId);
    //this.email = this.quotationData.quote.email;
    // this.getB2Bconfigdata(this.quoteId,'Y');
    // this.getCompanyList();\

    this.createOrderForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.createOrderForm.controls;
  }
emailCreateOrder(){
  console.log(this.createOrderForm.value);
  //console.log(this.email);
  // if(this.createOrderForm.value == this.email){
  //   console.log("Email matched")
  // } else {
  //   console.log("Email not match")
  // }
  this.createOrder();
}
open(content1) {
  //console.log(content1)
   this.modalService.open(content1, { 
     ariaLabelledBy: 'modal-basic-title',
      size: "md",
      backdrop:true, 
      centered: true,
      windowClass:"huge"
   }).result.then(
    (result) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    },
  );
   //modalRef.componentInstance.activeModal.close();
  
}

openSucessDialog(content2) {
  //console.log(content1)
   this.modalService.open(content2, { 
     ariaLabelledBy: 'modal-basic-title',
      size: "md",
      backdrop:true, 
      centered: true,
   }).result.then(
    (result) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    },
  );
}
// getDismissReason(reason: any): string {
//   if (reason === ModalDismissReasons.ESC) {
//     return 'by pressing ESC';
//   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
//     return 'by clicking on a backdrop';
//   } else {
//     return `with: ${reason}`;
//   }
// }

  toggleAddButton() {
    this.addCompany = !this.addCompany;
    if (this.addCompany) {
      this.customerInfoForm.patchValue({ company_name: '', company_id: '0' });

    } else {
      this.customerInfoForm.patchValue({ company_id: '', company_name: 'test' })
    }
  }


  getCompanyList() {
    let cmp = this.ls.getFromLocal()?.company_name ?? '';;

    this.sharedservice.getCompanyList('?company_type=quote').subscribe(list => {
      this.companyList = list;
      let companyId = list.find(x => x.company == cmp)?.sgid;
      this.selectedCompany = list.find(x => x.company == cmp);
      if (companyId) {
        this.customerInfoForm.patchValue({ company_name: this.selectedCompany.company });
        this.getProjectListMD(companyId)
      }

    })
  }
  selectCompany(item) {
    this.selectedCompany = item.target.value;
    if (!this.addCompany) {
      //   this.moodboardForm.patchValue({company_id:item.sgid});
      this.customerInfoForm.patchValue({ company_name: item.target.value });
      this.getProjectListMD(item.target.value);
    } else {
      // this.moodboardForm.patchValue({company_name:''})
    }
  }
  getProjectListMD(compid: any) {
    this.cMbService.getProjectListMD(compid).subscribe(list => {
      if (typeof list == 'string') this.projectList = [];
      else this.projectList = list;
    });
  }
  selectProject(item) {
    if (!this.addProject) {
      let project = this.projectList.find(x => x.sgid == item.target.value);
      this.customerInfoForm.patchValue({ project_name: project?.project || '' });
    } else {
      /// this.customerInfoForm.patchValue({project_name:''})
    }
  }
  toggleAddButtonProject() {
    this.addProject = !this.addProject;
    if (this.addProject) {
      this.customerInfoForm.patchValue({ project_name: '', project_id: 0 });
    } else {
      this.customerInfoForm.patchValue({ project_id: 0, project_name: '' })
    }
  }


  unit_increaseDiscount(val) {
    if (val.b2b_discount < 90) {
      val.b2b_discount++;

      val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
      val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);
      // tslint:disable-next-line: radix
      // val.price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
      // // tslint:disable-next-line: radix
      // val.is_total = parseFloat(val.is_sale_price) * val.is_qty;
      // // tslint:disable-next-line: radix
      // val.is_total = parseFloat(val.is_total);
      this.unitSetTotal();
    }
  }


  increaseDiscountFp(val) {

    if (val.b2b_discount < 90) {
      val.b2b_discount++;

      val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
      val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);


      this.setTotalFp();
    }
  }

  unit_decreaseDiscount(val) {
    if (val.b2b_discount > 0) {
      val.b2b_discount--;
      val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
      val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);
      // val.is_sale_price = val.is_total;
      // // tslint:disable-next-line: radix
      // val.price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
      // // tslint:disable-next-line: radix
      // val.is_total = parseFloat(val.is_sale_price) * val.is_qty;
      // // tslint:disable-next-line: radix
      // val.is_total = parseFloat(val.is_total);
      this.unitSetTotal();
    }
  }

  decreaseDiscountFp(val) {
    if (val.b2b_discount > 0) {
      val.b2b_discount--;
      val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
      val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);

      this.setTotalFp();
    }
  }
  increaseTotalDiscountFp() {
    if (this.f_discount < 90) {
      this.f_discount++;
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.f_discountPrice = parseFloat(this.f_subtotal) - ((parseFloat(this.f_subtotal) * parseFloat(this.f_discount)) / 100);
      this.setTotalFp();
    }
  }
  decreaseTotalDiscountFp() {
    if (this.f_discount > 0) {
      this.f_discount--;
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.f_discountPrice = parseFloat(this.f_subtotal) - ((parseFloat(this.f_subtotal) * parseFloat(this.f_discount)) / 100);
      this.setTotalFp();
    }
  }

  increaseMonthFp(val) {
    if (val.months < 12) {
      val.months++;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        console.log(resp);
        val.price = resp.rental;
        val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
        val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);
        this.setTotalFp();
      });
    }
  }

  decreaseNOM() {
    if (this.unitInfo.months > 1) {
      this.unitInfo.months--;
      this.loadMonthlyPriceData()
    }
  }

  increaseNOM() {
    if (this.unitInfo.months < 12) {
      this.unitInfo.months++;
      this.loadMonthlyPriceData()
    }
  }

  loadMonthlyPriceData() {
    let unitId = this.f_unitId;
    let quoteId = this.quoteId;
    let floorId = this.fpFloorPlanId
    this.http.get(environment.endPoint + 'load/rent/price?quote_id=' + quoteId + '&unit_id=' + unitId + '&floorplan_id=' + floorId + '&month=' + this.unitInfo.months).subscribe((data: any) => {
      // this.floorPlanData = data.result;
      // this.floorPlanInfo = data.floorplan;
      // this.unitInfo = data.unit;
      // this.taxRate = data.sales_tax_rate;
      this.getFloorplanSummary(this.fpFloorPlanId, this.f_unitId, this.quoteId);
    })
  }
  increaseMonthCi() {
    if (this.fnl_mnths_in < 12) {

      this.service_array_in = []
      let arr = Object.keys(this.ps_data_price_in)
      this.fnl_mnths_in++
      arr.forEach((elem, i) => {
        // console.log(elem)
        this.service_array_in.push(this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + elem + '&month=' + this.fnl_mnths_in))
        // this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + productId + '&month=' + month)
      })
      setTimeout(() => {
        forkJoin(this.service_array_in).subscribe(async results => {
          await arr.map((r, i) => {
            this.ps_data_price_in[r].price = results[i]['rental']
            this.ps_data_price_in[r].months = this.fnl_mnths_in
            this.ps_data_price_in[r].is_total = parseFloat(this.ps_data_price_in[r].is_qty) * (parseFloat(this.ps_data_price_in[r].price) - ((parseFloat(this.ps_data_price_in[r].b2b_discount) / 100) * parseFloat(this.ps_data_price_in[r].price)));
            this.ps_data_price_in[r].is_sale_price = parseFloat(this.ps_data_price_in[r].price) * parseFloat(this.ps_data_price_in[r].is_qty);
            // val.months++;
          })
          this.service_array_in = []
          await this.setTotalFp();
          console.log(results)
        });
      }, 2000);
    }
  }

  decreaseMonthCi() {
    if (this.fnl_mnths_in > 1) {

      this.service_array_in = []

      let arr = Object.keys(this.ps_data_price_in)
      this.fnl_mnths_in--
      arr.forEach((elem, i) => {
        // console.log(elem)
        this.service_array_in.push(this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + elem + '&month=' + this.fnl_mnths_in))
        // this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + productId + '&month=' + month)
      })

      setTimeout(() => {
        //this.modalRef.hide();
        // this.sendRequestForm.reset();
        forkJoin(this.service_array_in).subscribe(async results => {
          await arr.map((r, i) => {
            console.log(r)
            console.log(i)
            this.ps_data_price_in[r].price = results[i]['rental']
            this.ps_data_price_in[r].months = this.fnl_mnths
            this.ps_data_price_in[r].is_total = parseFloat(this.ps_data_price_in[r].is_qty) * (parseFloat(this.ps_data_price_in[r].price) - ((parseFloat(this.ps_data_price_in[r].b2b_discount) / 100) * parseFloat(this.ps_data_price_in[r].price)));;
            this.ps_data_price_in[r].is_sale_price = parseFloat(this.ps_data_price_in[r].price) * parseFloat(this.ps_data_price_in[r].is_qty);
            // val.months++;
          })
          this.service_array_in = []
          await this.setTotalFp();
          console.log(results)
        });

      }, 2000);

      /* val.months--;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        val.price = resp.rental;
        val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
        val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);

        this.setTotalFp();
      }); */
    }
  }


  decreaseMonthFp(val) {
    if (val.months > 1) {
      val.months--;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        val.price = resp.rental;
        val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
        val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);

        this.setTotalFp();
      });
    }
  }
  deliveryfeeChangeFp($event) {
    console.log($event);
    if ($event) {
      this.f_delivery_fee = $event;
      this.setTotalFp();
      this.Total();
    } else {
      this.f_delivery_fee = 0;
    }

  }
  taxChangeFp($event) {
    console.log($event);
    if ($event) {
      this.f_tax_amount = $event;
      this.setTotalFp();
      this.Total();
    } else {
      this.f_tax_amount = 0;
    }

  }

  setTotalFp() {
    let subtotal: number;
    subtotal = 0;
    let monthlyrent: number;
    monthlyrent = 0;
    this.floorplanSummaries.forEach(element => {
      // tslint:disable-next-line: radix
      subtotal += parseFloat(element.is_total);
      console.log(subtotal);
      // tslint:disable-next-line: radix
      monthlyrent += parseFloat(element.price);
    });
    // tslint:disable-next-line: radix
    this.f_subtotal = subtotal;

    // tslint:disable-next-line: radix
    this.f_monthly_rent = monthlyrent;
    // tslint:disable-next-line: max-line-length // tslint:disable-next-line: radix
    if (parseFloat(this.f_discount) > 0) {
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.f_discountPrice = parseFloat(this.f_subtotal) - ((parseFloat(this.f_subtotal) * parseFloat(this.f_discount)) / 100);
      // tslint:disable-next-line: max-line-length // tslint:disable-next-line: radix
      this.f_net_total = parseFloat(this.f_delivery_fee) + parseFloat(this.f_discountPrice) + parseFloat(this.f_tax_amount);
    } else {
      this.f_discountPrice = 0;
      // tslint:disable-next-line: max-line-length // tslint:disable-next-line: radix
      this.f_net_total = parseFloat(this.f_delivery_fee) + parseFloat(this.f_subtotal) + parseFloat(this.f_tax_amount);

    }
  }

  rentAdjustmentAPI() {
    // months,qty,price,sale_price,total_price,discount,b2b_discount,sgid
    this.spinner.show();

    const postArr = [];
    const items = [];
    const unit = [];

    this.floorPlanData.forEach(elem => {
      const obj = {
        months: elem.months,
        qty: elem.is_qty,
        price: elem.price,
        buy_price: elem.buy_price,
        sale_price: elem.price,
        total_price: elem.is_total,
        discount: elem.discount,
        b2b_discount: 0,// elem.b2b_discount,
        sgid: elem.sgid,

      };
      items.push(obj);


    });
    const obj1 = {
      sgid: this.f_unitId,
      name: this.fp_unitname || '',
      pickup_fee: this.unitInfo.pickup_fee,
      delivery_fee: this.unitInfo.delivery_fee,
      rent_adjustment_value: this.userAddedDiscount ?? 0,
      rent_adjustment_type: this.rentAdjustmentType,
      buy_discount: this.quotationData.quote.buy_discount ?? 0

    };
    unit.push(obj1);
    postArr.push({ 'items': items });
    postArr.push({ 'unit': unit });
    postArr.push({ quote_id: this.quoteId });
    console.log('floor plan update', postArr);

    this.quoteService.updateFloorplanSummary(postArr).subscribe(resp => {
      console.log(resp);
      this.spinner.hide();
      this.toastr.success('Floor plan summary updated');
      this.test = '0'
      console.log(this.test);
      this.getFloorplanSummary(this.fpFloorPlanId, this.f_unitId, this.quoteId);
      // this.loadfpUnits(this.fpFloorPlanId);
      // this.getUnitSummaries(this.fpFloorPlanId)

    });
  }

  updateFloorplansummaryofUnit() {
    // months,qty,price,sale_price,total_price,discount,b2b_discount,sgid
    this.spinner.show();

    const postArr = [];
    const items = [];
    const unit = [];

    this.floorPlanData.forEach(elem => {
      const obj = {
        months: elem.months,
        qty: elem.is_qty,
        price: elem.price,
        buy_price: elem.buy_price,
        sale_price: elem.price,
        total_price: elem.is_total,
        discount: elem.discount,
        b2b_discount: 0,// elem.b2b_discount,
        sgid: elem.sgid,

      };
      items.push(obj);


    });
    const obj1 = {
      sgid: this.f_unitId,
      name: this.fp_unitname || '',
      pickup_fee: this.unitInfo.pickup_fee,
      delivery_fee: this.unitInfo.delivery_fee,
      rent_adjustment_value:  0,
      rent_adjustment_type: this.rentAdjustmentType,
      buy_discount: this.unitInfo.buy_discount

    };
    console.log(obj1);
    
    unit.push(obj1);
    postArr.push({ 'items': items });
    postArr.push({ 'unit': unit });
    postArr.push({ quote_id: this.quoteId });
    console.log('floor plan update', postArr);

    this.quoteService.updateFloorplanSummary(postArr).subscribe(resp => {
      console.log(resp);
      this.spinner.hide();
      this.toastr.success('Floor plan summary updated');
      this.test = '0'
      console.log(this.test);
      this.getFloorplanSummary(this.fpFloorPlanId, this.f_unitId, this.quoteId);
      // this.loadfpUnits(this.fpFloorPlanId);
      // this.getUnitSummaries(this.fpFloorPlanId)

    });
  }
  // fpsummary calculation

  stateFilter(val) {
    console.log(val);
    this.states.filter((state) => {
      if (state.name.includes(val)) {
        return state;
      }

    });
  }

  msg:any;
  createOrder() {
    this.spinner.show();
    const postArr = [];
    console.log('savequote', this.quotationData.quote_items)
    this.quotationData.quote_items.forEach(elem => {
      console.log(this.isorderCreated);  
      const obj = {
        sgid: elem.sgid,
        quote_id: this.quoteId,
        order_type:this.isorderCreated,
        id: this.quotationData.quote.sgid,
        sub_total: this.quotationData.sub_total,
        old_month: elem.old_month,
        monthly_rent: this.quotationData.quote.monthly_rent,
        delivery_fee: this.quotationData.quote.delivery_fee,
        pickup_fee: this.quotationData.quote.pickup_fee,
        tax: this.quotationData.quote.tax_amount,
        net_total: this.quotationData.quote.net_total,
        qty: elem.is_qty,
        discount: elem.discount,
        quote_discount: this.quotationData.quote.discount,
        quote_discount_price: this.quotationData.quote.discount_price,
        percentage_discount: elem.percentage_discount,
        months: elem.months,
        total: elem.is_total,
        price: elem.price,
        buy_price: elem.buy_price,
        sale_price: elem.price,
        apply_b2b_discount: elem.b2b_discount,
        buy_discount: this.quotationData.quote.buy_discount ?? 0,
        buy_net_total: this.quotationData.quote.buy_net_total ?? 0,
        buy_sub_total: this.quotationData.quote.buy_sub_total ?? 0,
        rent_net_total: this.quotationData.quote.rent_net_total ?? 0,
        rent_sub_total: this.quotationData.quote.rent_sub_total ?? 0,
        rent_discount: this.quotationData.quote.rent_discount,
        
      };
      postArr.push(obj);

    });
    console.log('postarr', postArr);
    this.quoteService.saveQuotes(postArr).subscribe(resp => {
      console.log(resp);
      this.email= this.createOrderForm.value.email;
      //this.quoteId= resp?.quote.sgid;
      console.log(this.email);
      console.log(this.quoteId);
      if (resp.statusCode != 200) {
        return;
      }
      this.quoteService.orderCreate(this.quoteId).subscribe(resp => {
        if (resp.statusCode === 200) {                  
          this.spinner.hide();
          console.log(resp);
          this.quoteTotal={
            quote_type:resp.quote_type,
            result:resp.result,
            more_less:resp.more_or_less
          }
          let obj={
            user_id:this.UserId,
            quote_id:this.quoteId,
            action:'no',
            order_reference:'',
            type:'quote' 
          }
          this.quoteService.getUserleaseAgreement(obj).subscribe((res:any)=>{ 
            console.log(res);
          })
            this.modalService.dismissAll(this.content1);
            this.quoteService.sendEmailQuote(this.quoteId, this.email).subscribe(resp =>{
              this.msg = resp;  
              console.log(resp, "Email sent");
              if(this.msg.statusCode === 200){
                this.openSucessDialog(this.content2);
                this.toastr.success('Email Sent succesfully.');
              }
  
            })  
        
          // if(resp.result =='Order created'){
          //   this.modalService.dismissAll(this.content1);
          //   this.quoteService.sendEmailQuote(this.quoteId, this.email).subscribe(resp =>{
          //     this.msg = resp;  
          //     console.log(resp, "Email sent");
          //     if(this.msg.statusCode === 200){
          //       this.openSucessDialog(this.content2);
          //       this.toastr.success('Email Sent succesfully.');
          //     }
  
          //   })  
          // }
          // if(resp.result !=='Order created'){
          //       this.toastr.warning('Please check Quote details.');
          //     }

          if(!this.currentPage.includes('quote/view')){
          this.toastr.success('Order updated succesfully.');
          //this.toastr.success(`An email has been sent to ${this.email}. Please check your mail.`);
          }
          // if(this.currentPage.includes('quote/view')){
          //   this.toastr.success('Order created succesfully.');
          // this.toastr.success(`An email has been sent to ${this.email}. Please check your mail.`);
          //   }
        }
        if(resp?.token){
          this.route.navigate(['/admin/quote/list', 'my']);       
          this.toastr.success('Order created succesfully.');
        }
        if (resp.statusCode === 502) {
          this.toastr.error(resp.message);
        }
      }, error => {
        this.spinner.hide();
      });
    });


  }
  pdfPopUp(key_type:any) {
    let obj={
      user_id:this.UserId,
      quote_id:this.quoteId,
      action:'no',
      order_reference:'',
      type:'quote' 
    }
    this.spinner.show()
    this.quoteService.getUserleaseAgreement(obj).subscribe((res:any)=>{
    
      if(res.statusCode==200){
        this.spinner.hide()
        const modalRef = this.modalService.open(DialogBoxComponent, {
          size: "xl",
          backdrop: "static",
          centered: true,
        });
        let data = {
          content: "Lease Aggrement",
          dialogType: "lease-aggrement",
          result:res,
          type:key_type
        };
        modalRef.componentInstance.leaseAggrement = data;
        modalRef.componentInstance.leaseAggrementOp.subscribe((res: any) => {
          if(res=='Lease Agreement Updated'){
            modalRef.componentInstance.activeModal.close();
            this.toasterService.success(res);
            this.quoteTotal.quote_type =''
          }
         
        });
      }
    },error=>{
      this.spinner.hide()
    })
    
  }
  clearallunitfields() {
    this.unitLevelProducts = [];
    this.unitSubTotal = 0;
    this.unitDiscount = 0;
    this.Deleveryfee = 0;
    this.pickupfee = 0;
    this.TotalAssetValue = 0;
    this.unitDiscountPrice = 0;
    this.directProdList = [];
  }

  gotoAddUnit(unit) {

    this.clearallunitfields();
    console.log(unit);
    this.isFloorplanview = false;
    this.viewFloorPlan = true;
    this.sgUnitname = 'U' + unit.unit;
    if (unit.name == '' || unit.name == null) {
      this.sgSelectedUnit = unit.unit;
    }
    else {
      this.sgSelectedUnit = unit.name;
      this.unitname = unit.name;
    }

    this.sgSelectedUnitId = unit.sgid;


    // this.floorPlans  // is already data have

    console.log(this.sgSelectedUnitId);
    if (unit.floorplan_id) {
      console.log('true');
      this.isSgUnitRemove = true;
      this.isSgUnitAdd = false;
      this.loadunitProductwithoutMb(null, this.sgSelectedUnitId);
      this.quoteService.getMoodboardListOfUnit({ sgid: this.sgSelectedUnitId }).subscribe(resp => {
        console.log(resp);
        if (resp.statusCode === 200) {
          this.sgUnitMbList = resp.result;
          // this.sgSelectedMb =this.fpMymblist[0].boardname;
          // this.sgSelectedMbId = this.fpMymblist[0].sgid;

          this.sgslectedmbimage = resp?.result[0]?.unitmoodboards?.is_moodboard_images?.large;
          this.sgSelectedFloorPlan = resp?.floorplan[0]?.floorplan?.floorname;
          this.sgSelectedFloorPlanId = resp?.floorplan[0]?.floorplan?.sgid;
          console.log(this.sgSelectedFloorPlan);

        } else {
          this.sgSelectedMb = 'No moodboard found';
        }
      }, error => {
        this.sgSelectedMb = 'Error in call';
      });



      this.quoteService.getUnitProducts({ sgid: this.sgSelectedUnitId }, unit.floorplan_id, this.quoteId).subscribe(resp => {
        console.log(resp);
        this.TotalAssetValue = 0;
        this.unitLevelProducts = [];
        if (resp.statusCode === 200) {
          this.unitLevelProducts = resp.result;
          this.unitSubTotal = resp.subtotal;
          this.unitDiscount = resp.discount;
          this.Deleveryfee = resp.unit.delivery_fee;
          this.pickupfee = resp.unit.pickup_fee;
          this.TotalAssetValue = resp.asset_value;
          this.unitDiscountPrice = parseFloat(this.unitSubTotal) - ((parseFloat(this.unitSubTotal) * parseFloat(this.unitDiscount)) / 100);
          this.unitSetTotal();
        }

      }, error => {
        console.log('error');
      });



    } else {
      this.sgUnitMbList = [];
      console.log('false');
      this.isSgUnitRemove = false;
      this.isSgUnitAdd = true;

      console.log(this.sgSelectedFloorPlan);
      this.quoteService.getMoodboardListOfUnit({ sgid: this.sgSelectedUnitId }).subscribe(resp => {
        console.log(resp);
        if (resp.statusCode === 200) {
          this.sgUnitMbList = resp.result;
          // this.sgSelectedMb =this.fpMymblist[0].boardname;
          // this.sgSelectedMbId = this.fpMymblist[0].sgid;

          this.sgslectedmbimage = resp?.result[0]?.unitmoodboards?.is_moodboard_images?.large;
          // this.sgSelectedFloorPlan = resp?.floorplan[0]?.floorplan?.floorname;
          // this.sgSelectedFloorPlanId = resp?.floorplan[0]?.floorplan?.sgid;
          console.log(this.sgSelectedFloorPlan);

        } else {
          this.sgSelectedMb = 'No moodboard found';
        }
      }, error => {
        this.sgSelectedMb = 'Error in call';
      });
      this.quoteService.getUnitProducts({ sgid: this.sgSelectedUnitId }).subscribe(resp => {
        console.log(resp);
        this.TotalAssetValue = 0;
        this.unitLevelProducts = [];
        if (resp.statusCode === 200) {
          this.unitLevelProducts = resp.result;

          this.unitSubTotal = resp.subtotal;
          this.unitDiscount = resp.discount;
          this.Deleveryfee = resp.deliveryFee;
          this.pickupfee = resp.pickup_fee;
          this.TotalAssetValue = resp.asset_value;
          this.unitDiscountPrice = parseFloat(this.unitSubTotal) - ((parseFloat(this.unitSubTotal) * parseFloat(this.unitDiscount)) / 100);
          this.unitSetTotal();
        }

      }, error => {
        console.log('error');
      });
      if (this.floorPlans) {
        this.sgSelectedFloorPlanId = this.floorPlans[0].sgid;
        this.sgSelectedFloorPlan = this.floorPlans[0].floorname;

      }
      else {
        this.sgSelectedFloorPlan = 'No floor plan found';

      }

      this.getMymoodboards();
      // need to get from api
      // this.sgSelectedFloorPlanId = 0 ;
      // this.sgSelectedFloorPlan = 'No Floor name';
      // this.fpMymblist = [];
      // this.sgSelectedMb =this.fpMymblist[0].boardname;
      // this.sgSelectedMbId = this.fpMymblist[0].sgid;

    }




  }


  loadunitProductwithoutMb(fpid, unitId) {

    const obj = {
      unit_id: unitId,
      floorplan_id: fpid
    };
    this.quoteService.loadunitProductwithoutMb(obj).subscribe(resp => {
      if (resp.statusCode === 200) {
        this.directProdList = resp.result;
      }
    }, error => {

    });

  }
  sgSelectMoodboard(mb) {
    this.sgSelectedMbId = mb.sgid;
    this.sgSelectedMb = mb.boardname;

    this.sgslectedmbimage = mb.unitmoodboards.is_moodboard_images.large;
    console.log(this.sgslectedmbimage);
  }
  sgSelectFloorplan(fp) {
    this.sgSelectedFloorPlanId = fp.sgid;
    this.sgSelectedFloorPlan = fp.floorname;

  }
  addSingleUnitToMoodboard() {
    this.spinner.show();
    console.log(this.sgSelectedMbId);
    console.log(this.sgSelectedMb);
    console.log(this.sgSelectedFloorPlanId);
    console.log(this.sgSelectedFloorPlan);
    console.log(this.sgSelectedUnit);
    console.log(this.sgSelectedUnitId);
    this.sgUnitMbList = [];
    const obj = { quote_id: this.quoteId, floorplan_id: this.sgSelectedFloorPlanId, unit: this.sgSelectedUnit, moodboard_id: this.sgSelectedMbId, sgid: this.sgSelectedUnitId };
    this.quoteService.addSingleUnitforMb(obj).subscribe(resp => {
      if (resp.statusCode === 200) {
        console.log(resp);
        this.getUnitlevelproducts(this.sgSelectedUnitId);
        this.getMoodboardlistofunit(this.sgSelectedUnitId);
        const insertobj = {
          unitmoodboards: {
            boardname: this.sgSelectedMb,
            is_moodboard_images: { large: this.sgslectedmbimage }
          }
        };

        this.sgUnitMbList.push(insertobj);
        this.spinner.hide();
        this.toastr.success('Moodboard added successfully to Unit.');


      }
    }, error => { });
  }
  removeSingleUnitToMoodboard(board) {
    this.spinner.show();


    const obj = { quote_id: this.quoteId, floorplan_id: this.sgSelectedFloorPlanId, unit: this.sgSelectedUnit, moodboard_id: board.unitmoodboards.sgid, sgid: this.sgSelectedUnitId };
    this.quoteService.removeSingleUnitforMb(obj).subscribe(resp => {
      if (resp.statusCode === 200) {
        this.spinner.hide();
        this.toastr.success('Unit U' + this.sgSelectedUnit + ' remove from the moodboard succesfully.');
        this.getUnitlevelproducts(this.sgSelectedUnitId);
        this.getMoodboardlistofunit(this.sgSelectedUnitId);
        for (const mblists of this.sgUnitMbList) {
          if (board.unitmoodboards.sgid === mblists.unitmoodboards.sgid) {
            this.sgUnitMbList.splice(this.sgUnitMbList.indexOf(board.unitmoodboards.sgid), 1);

            // if(this.floorPlans.length === 0){
            //   this.nodatafound = true;
            //   this.isRemoveFloor = false;
            // }
            break;
          }

        }
      }
    }, error => { });
  }
  changeStatus() {
    let status;
    if (this.quotePublic) {
      status = 1;
    } else {
      status = 0;
    }
    this.quoteService.updateQuoteStatus(this.quoteId, status).subscribe(resp => {
      if (resp.statusCode === 200) {
        console.log(resp);

      }
    }, error => {

    });


  }

  publicToBus() {
    this.http.post(environment.endPoint + 'publishToBusinees', { quote_id: this.quoteId }).subscribe((data: any) => {
      this.toastr.success(data.message)
      this.quotePublicToBus = true;
    }, (error) => {
      this.toastr.warning(error.message)
    })
  }
  changequoteB2B() {
    console.log('quoteB2B', this.quoteB2B);
    if (this.quoteB2B) {
      this.getB2Bconfigdata(this.quoteId, 'Y');
    }
    else {
      this.getB2Bconfigdata(this.quoteId, 'N');
    }

    // if(this.quoteB2B==true)
    // {
    // this.TotalchangeonB2B();
    // }

  }


  // TotalchangeonB2B()
  // {
  //   for(var i=0;i<this.quotationData.quote_items.length;i++)
  //   {
  //     this.ps_data_price[this.quotationData.quote_items[i].product_id].is_total=Number(this.ps_data_price[this.quotationData.quote_items[i].product_id].is_sale_price)- Number(this.quotationData.quote_items[i].b2bDiscount);
  //   console.log( this.ps_data_price[this.quotationData.quote_items[i].product_id].is_total);
  //   }
  // }

  OnChange(event, type) {
    if(type=='file'){
      //this.isLoading = false;
      this.fileElement = event.target.files[0];
      return
    }
  }
  
  // uploadImage(event) {
  //   this.fileElement = $("#img").val();
  //   console.log(this.fileElement);
  // var upld = this.fileElement.split('.').pop();
  // var file = event.target.files;
  //           if(file.size>=2*1024*1024) {
  //               alert("PDF is maximum 2MB");
  //              //return;
  //   }  
  // if(upld=='pdf'){
  //   this.toasterService.success("File uploaded is pdf")
  // }else{
  //   this.toasterService.error("Please upload PDF file")
  // }
  // }

  onChange(event, type) {
    console.log('change detection');

    this.selectedStateId = event.sgid;
    this.selectedState = event.name;


    this.getCities();
  }
  oncityChange(event) {
    this.selectedCityId = event.sgid;
    this.selectedCity = event.city_name;
  }

  getQuoteItemStatus(list: Array<any>): '0' | '1' | '2' {
    if (list.length <= 0) {
      return '2';
    }
    let buyItems = 0;
    let rentItems = 0;
    list.forEach(x => {
      if (x.button_type) buyItems++
      else rentItems++;
    })
    if (list.length == buyItems) {
      return '1';
    } else if (list.length == rentItems) {
      return '0'
    }
    return '2'
  }
  test: any = 0;
  getquotation(quoteId) {
    this.rentManualAdjust = false
    this.spinner.show();
    this.quoteService.getQuotationDetails(quoteId).subscribe(async resp => {
      console.log(resp)
      if (resp.statusCode === 200) {
        var itemsProcessed = 0;
        this.quotationData = resp;
        if (this.initialLoad) {
          this.adjustedRentDiscount = this.quotationData.quote.rent_discount
          console.log(this.adjustedRentDiscount)
        }
        this.initialLoad = false;
        this.quotationData['initial_rent_discount'] = this.quotationData.quote.rent_discount;
        this.quoteInfo = resp.quote;
        this.quoteProductList = resp.quote_items;
        this.spinner.hide();
        if(resp.quote_items.filter(x=> x.button_type).length == resp.quote_items.length){

        }
        this.quoteItemStatus = this.getQuoteItemStatus(resp.quote_items.length > 0 ? resp.quote_items : []);
        this.quotePublicToBus = resp?.quote?.publish_to_business == 0 ? false : true;
        this.quoteProductList.forEach(product => {
          this.mbs.getImageUrl(product.product_images.small).subscribe(img => {
            product.b64img = 'data:image/jpeg;base64,' + img.imageurl;
            itemsProcessed++
            if (itemsProcessed === this.quoteProductList.length) {
              this.generateImagePDFData(this.quoteProductList);
            }
          })
        })
        this.TotalAssetValue = this.quotationData.quote.asset_value;
        if (this.quoteInfo?.is_order === 'YES') {
          this.isorderCreated = 'Update';
        } else {
          this.isorderCreated = 'Create';
        }
        this.updateSubTotal();

        // if (this.rentAdjstType == 1) {
        //   this.quoteInfo.rent_net_total =  this.cInfo.rent_net_total
        //   console.log( this.afterAdjtotal);
        // }else if (this.rentAdjstType == 0){
        //   this.quotationData.quote.rent_net_total = parseInt(this.quotationData?.quote?.rent_sub_total) - parseInt(this.quotationData?.quote?.rent_discount)
        //   console.log( this.afterAdjtotal)  ;
        // }

        // console.log(resp);
        // this.quotationData = resp;
        // this.quotation = resp.quote;
        // for(var i=0;i<this.quotationData.quote_items.length;i++)
        // {
        //   this.quotationData.quote_items[i].b2b_discount=Math.ceil( this.quotationData.quote_items[i].b2b_discount);
        // }


        // await this.quotationData.quote_items.map(r => {
        //   this.ps_data_price[r.product_id] = r
        // })

        // let convertion = this.quotationData.quote_items.forEach((elem, i) => {
        //   // this.toDataURL(elem.product_images.small, (resp) => {
        //   //   elem.b64img = resp;
        //   // });

        //   setTimeout(() => {
        //     this.mbs.getImageUrl(elem.product_images.small).subscribe(image => {
        //       elem.b64img = 'data:image/jpeg;base64,' + image.imageurl;
        //     });
        //   }, 2000);
        // });
        // if (this.quotationData?.quote.is_order === 'YES') {
        //   this.isorderCreated = 'Update';
        // } else {
        //   this.isorderCreated = 'Create';
        // }
        // this.quotationData.quote.discount_price = this.quotationData.quote.sub_total;
        // this.copyofquotationData=this.quotationData;

        // if (resp.quote_items.length > 0) {
        //   var itemsProcessed = 0;
        //   resp.quote_items.forEach(elem => {
        //     this.selectedProductIds.push(elem.product_id.toString());
        //     this.mbs.getImageUrl(elem.product_images?.small).subscribe(image => {
        //       elem.imagee = 'data:image/jpeg;base64,' + image.imageurl;
        //       this.selectedProducts.push(elem);
        //       itemsProcessed++;
        //       if(itemsProcessed === resp.quote_items.length) {
        //         this.generateImagePDFData(resp.quote_items ? resp.quote_items: []);
        //       }
        //     });
        //   });
        // }

      }
    }, error => {

    });
  }
  getB2Bconfigdata(quoteId, flag) {
    this.quoteService.getB2BconfigDetails(quoteId, flag).subscribe(async resp => {
      if (resp.statusCode === 200) {
        this.TotalAssetValue = 0;
        console.log(resp);
        this.quotationData = resp;
        this.quotation = resp.quote;
        // for(var i=0;i<this.quotationData.quote_items.length;i++)
        // {
        //   this.quotationData.quote_items[i].b2b_discount=Math.ceil( this.quotationData.quote_items[i].b2b_discount);
        // }
        this.TotalAssetValue = this.quotationData.quote.asset_value;

        await this.quotationData.quote_items.map(r => {
          this.ps_data_price[r.product_id] = r
        })

        let convertion = this.quotationData.quote_items.forEach((elem, i) => {
          // this.toDataURL(elem.product_images.small, (resp) => {
          //   elem.b64img = resp;
          // });
          setTimeout(() => {
            this.mbs.getImageUrl(elem.product_images.small).subscribe(image => {
              elem.b64img = 'data:image/jpeg;base64,' + image.imageurl;
            });
          }, 2000);
        });
        if (this.quotationData?.quote.is_order === 'YES') {
          this.isorderCreated = 'Update';
        } else {
          this.isorderCreated = 'Create';
        }
        // this.quotationData.quote.discount_price = this.quotationData.quote.sub_total;
        this.copyofquotationData = this.quotationData;

      }
    }, error => {

    });
  }

  testing: any;
  getquoteDetails(quoteid) {
    console.log('resp');
    this.quoteService.getQuoteDetail(quoteid).subscribe(resp => {
      console.log(resp);
      this.testing = resp;
      console.log(this.testing)
      if (resp.statusCode === 200) {
        this.cInfo = resp.quote;
        this.cusName = this.cInfo.name;
        this.cusAddress = this.cInfo.address;
        this.selectedState = this.cInfo.is_state_name;
        this.selectedStateId = this.cInfo.state;
        this.selectedCityId = this.cInfo.city;
        this.selectedCity = this.cInfo.city_name;
        this.ngselectedState = { sgid: this.cInfo.state, name: this.selectedState };
        console.log(this.ngselectedState);
        this.ngselectedCity = { sgid: this.cInfo.city, city_name: this.selectedCity };
        this.cus_zipcode = this.cInfo.is_zip_code;
        this.cus_email = this.cInfo.email;
        this.cus_contact = this.cInfo.contactno;
        this.company_name = this.cInfo.company_name;
        this.project_name = this.cInfo.project_name;
        this.project_id = this.cInfo.project_id;
        this.company_id = this.cInfo.company_id;
        this.order_number_ref = this.cInfo.order_reference;
        this.is_order = this.cInfo.is_order;
        this.preferred_delivery_start_date =this.cInfo.preferred_delivery_start_date,
        this.preferred_delivery_end_date =this.cInfo.preferred_delivery_end_date,
        this.rentAdjstType = this.cInfo.rent_adjustment_type
        if (this.cInfo.is_publish == 1) {
          console.log(this.cInfo.is_publish);
          this.quotePublic = true;
        } else {
          this.quotePublic = false;
        }
        if (this.cInfo.apply_b2b_discount == 'Y') {
          console.log(this.cInfo.apply_b2b_discount);
          this.quoteB2B = true;
        } else {
          this.quoteB2B = false;
        }
      }
    }, error => { });
  }
  getFloorPlans() {

    this.quoteService.getFloorPlanDetails(this.quoteId).subscribe(resp => {
      console.log(resp);
      if (resp.statusCode === 200 && resp.result.length > 0) {
        console.log('came here');
        this.floorPlans = resp.result;
        this.viewFloorPlan=false
        this.nodatafound = false;
      } else {
        console.log('iscame');
        this.floorPlans = [];
        this.sgSelectedFloorPlan = 'No floor plan found';
        this.nodatafound = true;
      }
    }, error => {
      this.nodatafound = true;
      this.sgSelectedFloorPlan = 'No floor plan found';
    });
  }
  getFloorPlansByUser() {
    this.quoteService.getFloorPlanDetailsByUserId(this.UserId).subscribe(resp => {
      this.FloorPlanDetails = [];
      this.floorPlanNames = []
      this.FloorPlanDetails = resp.result;

      for (var i = 0; i < this.FloorPlanDetails.length; i++) {
        this.floorPlanNames.push(this.FloorPlanDetails[i].floorname);

      }
      console.log(this.floorPlanNames)
    }
      , error => {
        this.nodatafound = true;
        this.sgSelectedFloorPlan = 'No floor plan found';
      });

  }


  getUnits() {
    this.quoteService.getUnitWithoutPlan(this.quoteId).subscribe(resp => {
      console.log(resp);
      if (resp.statusCode === 200 && resp.result.length > 0) {
        this.unitWOPlans = resp.result;
        this.Unitcount = resp.result.length;
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
        console.log(resp.result);
        this.floorTypes = resp.result;
        this.floorTypename = this.floorTypes[0].name;
        this.floorTypeId = this.floorTypes[0].sgid;
        console.log(this.floorTypeId);
      }
    }, error => { });
  }
  getStates() {
    this.quoteService.getStates().subscribe(resp => {

      if (resp.statusCode === 200) {
        console.log(resp);
        this.states = resp.states;
        // this.selectedState = this.states[0].name;
        // this.selectedStateId = this.states[0].sgid;

        //  this.ngselectedState = this.selectedStateId;
        this.getCities();
      }
    }, error => {

    });
  }

  getCities() {
    this.quoteService.getCities(this.selectedStateId).subscribe(resp => {
      if (resp.statusCode === 200) {

        this.cities = resp.cities;
        // this.selectedCity = 'Select City'
        // this.selectedCityId = this.cities[0].sgid;
        // this.selectedCity = this.cities[0].city_name;
      }
    }, error => {

    });
  }

  selectState(state) {
    this.selectedState = state.name;
    this.selectedStateId = state.sgid;
    this.selectedCity = 'Select City';
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
  selecteditFloorType(floorType) {
    this.floorTypeIdedit = floorType.sgid;
    this.floorTypenameedit = floorType.name;
  }
  editCustomerInfo(val) {
    this.getCompanyList()
    if (val === 'edit') {
      this.isCopyQuote = false;
      this.updateinfo = true;
    } else {
      this.isCopyQuote = true;
      this.updateinfo = true;

    }
    this.editCustomer = true;


    this.customerInfoForm = this.formBuilder.group({
      name: [this.cusName, Validators.required],
      address: [this.cusAddress, Validators.required],
      email: [this.cus_email, [Validators.required, Validators.email]],
      contact_no: [this.cus_contact, Validators.required],
      zipcode: [this.cus_zipcode, Validators.required],
      companyName: [this.company_name, Validators.required],
      project_id: [this.project_id, Validators.required],
      company_id: [this.company_id, Validators.required],
      project_name: [this.project_name, Validators.required],
      preferred_delivery_start_date : [''],
      preferred_delivery_end_date : [''],
      
      
    });
    this.getStates();
    console.log(this.updateinfo);
  }

  onSubmit() {

    const userInfo = this.customerInfoForm.value;
    userInfo.city = this.selectedCityId;
    userInfo.city_name = this.selectedCity;
    userInfo.state = this.selectedStateId;
    userInfo.userid = this.ls.getFromLocal().userId;
    userInfo.user_id = this.ls.getFromLocal().userId;
    userInfo.quote_id = this.quoteId;
    console.log(userInfo);
    this.isSubmitted = true;
    if (this.customerInfoForm.invalid) {
      return false;
    }
    this.spinner.show();
    if (this.isCopyQuote) {
      this.copyQuote(userInfo);
    } else {
      this.quoteService.udpateCustomerInformation(userInfo).subscribe(resp => {
        if (resp.statusCode === 200) {
          this.quoteId = resp.quote.sgid;
          this.spinner.hide();
          this.cusName = resp.quote.name;
          this.cus_contact = resp.quote.contactno;
          this.cusAddress = resp.quote.address;
          this.cus_email = resp.quote.email;
          this.cus_zipcode = resp.quote.is_zip_code;
          this.selectedState = resp.quote.is_state_name;
          this.selectedCity = resp.quote.is_city_name;
          this.toastr.success('Customer information updated successfully.');
          this.getFloorPlans();
          this.getUnits();
          this.editCustomer = false;
          this.updateinfo = false;
          this.getquoteDetails(this.quoteId);
          this.getquotation(this.quoteId)
        } else {

        }
      }, error => { });
    }






  }

  copyQuote(userInfo) {
    this.quoteService.copyQuote(userInfo).subscribe(resp => {
      console.log(resp);

      if (resp.statusCode === 200) {
        this.quoteId = resp.result.sgid;
        this.toastr.success('Quote created successfully');
        this.route.navigate(['/admin/quote/list', 'my']);
      }
    }, error => { });
  }
  unitTab() {
    this.getUnits();
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
    window.scroll(0, 0)
    this.getquotation(this.quoteId);
    this.getFloorPlans();
    this.getUnits();
    // this.viewFloorPlan = false;
    // this.isFloorPlan = false;
    this.isFloorplanview = false
    console.log(this.isFloorplanview);
    
  }
  selectMb(mb) {
    this.fpselectedmbTypeId = mb.sgid;
    this.fpselectedmbType = mb.boardname;
    this.sgSelectedMb = mb.boardname;
    this.sgSelectedMbId = mb.sgid;
    this.sgslectedmbimage = mb.is_moodboard_images.large;

  }
  gotoQuote(plan) {
    this.isFloorplanview = true;
    console.log(plan);
    this.fpsgid = plan.sgid;
    this.fpName = plan.floorname;
    this.fpFloorTypename = plan.floorplan_type_name;
    this.fpFloorPlanId = plan.sgid;
    this.fpmoodboard = plan.moodboard;
    this.fpUnit = plan.total_unit;
    this.viewFloorPlan = true;
    this.isSgUnitRemove = false;
    this.isSgUnitAdd = false;
    this.loadFpMoodboards(plan.sgid);
    this.loadfpUnits(plan.sgid);
    this.getMymoodboards();
    this.getUnitSummaries(this.fpFloorPlanId);
    this.loadunitProductwithoutMb(this.fpFloorPlanId, null);


  }
  cloneFloreplan(plan) {
    this.quoteId = plan.quote_id;
    this.floorPlanName = plan.floorname,
      this.floorTypeId = plan.floorplan_type_id,
      this.floorPlanUnit = plan.total_unit,
      this.floorTypename = plan.floorplan_type_name
    this.UserId = this.UserId
    this.addFloorPlans();
    this.getFloorPlans();


  }
  ClearFloreplan() {
    this.getFloorTypes()
    this.floorPlanName = '',

      this.floorPlanUnit = '',
      this.floorTypename = 'Studio'
  }
  editFloreplan(plan) {
    this.getFloorTypes()
    this.quoteId = plan.quote_id;

    this.floorPlanNameedit = plan.floorname,
      this.floorTypeIdedit = plan.floorplan_type_id,
      console.log(this.floorTypeIdedit);
    this.floorPlanUnitedit = plan.total_unit,
      this.sgid = plan.sgid,
      this.UserId = this.UserId,
      this.floorTypenameedit = plan.floorplan_type_name
  }

  getUnitSummaries(fpid) {
    this.quoteService.getMoodboardsSummary(fpid).subscribe(resp => {
      console.log(resp);
      this.unitsummary = resp.result;
      this.moodboardsummary = resp.moodboard_items;
      this.moodboardsummary.forEach((elem, index) => {
        if (index === 0) {
          elem.isClicked = true;
        } else {
          elem.isClicked = false;
        }

      });
      this.mbsummaryTable = this.moodboardsummary[0]?.items;
      this.floorPlanProductsummary = resp.product_items;
      //  this.unitsummary.forEach(elem=>{
      //    elem.
      //  })

    }, error => { });
  }


  // moodboards item summary end
  getMymoodboards() {
    let start = 0;
       let count = 500;
        this.mbs.getMyMoodboards(null,null,start,count).subscribe(resp => {
      if (resp.statusCode === 200 && (resp.result.length > 0)) {
        console.log(resp);
        this.fpMymblist = resp.result;
        if (this.fpMymblist.length > 0) {
          this.ismb = true;
        }
        this.fpselectedmbType = this.fpMymblist[0].boardname;
        this.fpselectedmbTypeId = this.fpMymblist[0].sgid;
        this.sgSelectedMb = this.fpMymblist[0].boardname;
        this.sgSelectedMbId = this.fpMymblist[0].sgid;
        this.sgslectedmbimage = this.fpMymblist[0].is_moodboard_images.large;
      } else {
        this.fpselectedmbType = 'No Moodboard found.';
      }
    }, error => {
      this.fpselectedmbType = 'No Moodboard found.';
    });
  }

  loadFpMoodboards(fpid) {
    this.fpMoodboardList = [];
    this.quoteService.getFloorplanMoodbaord(fpid, this.quoteId).subscribe(resp => {
      if (resp.statusCode === 200) {
        this.fpMoodboardList = resp.floorplans;

      } else {
        this.sgSelectedMb = 'No moodboard found.';
      }
    }, error => {
      this.sgSelectedMb = 'No moodboard found.';
    });
  }
  selectUnitsForPlans(unit) {
    unit.isActive = !unit.isActive
  }

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
  loadfpUnits(fpid) {
    this.quoteService.getFloorplanUnits(fpid, this.quoteId).subscribe(resp => {
      console.log(resp);
      if (resp.statusCode === 200) {
        this.fpUnitList = resp.result;
        this.fpUnitList.forEach((elem, index) => {
          elem.isActive = true;
          if (index === 0) {
            elem.isfpsummary = true;
          }

        });
        this.fpFloorPlanId = fpid;
        this.f_unitId = this.fpUnitList[0].sgid;
        this.fp_unitname = this.fpUnitList[0].name;
        this.getFloorplanSummary(fpid, this.fpUnitList[0].sgid, this.quoteId);
      }
    }, error => { });
  }
  addmoodbaordinFloorPlan() {
    // floorplan_id,quote_id,moodboard_id,units(array format) ex [1,2,3]
    const unitsarray = [];
    let obj;
    if (this.isFloorplanview) {
      this.fpUnitList.forEach(elem => {
        if (this.isSelectedAll) {
          unitsarray.push(elem.sgid);
        } else {
          if (elem.isActive) {
            unitsarray.push(elem.sgid);
          }
        }

      });

      if (unitsarray.length === 0) {
        this.toastr.warning('Please select at least one unit');
        $('#mbModalFloor').modal('show');
        return;
      } else {

      }
      obj = { floorplan_id: this.fpsgid, quote_id: this.quoteId, moodboard_id: this.fpselectedmbTypeId, units: unitsarray };

    }
    if (this.isSgUnitAdd) {
      unitsarray.push(this.sgSelectedUnitId);
      obj = { floorplan_id: this.sgSelectedFloorPlanId, quote_id: this.quoteId, moodboard_id: this.fpselectedmbTypeId, units: unitsarray };

    }


    this.quoteService.addmoodbaordtoFloorPlan(obj).subscribe(resp => {
      if (resp.statusCode === 200) {
        console.log(resp);
        this.fpMoodboardList = resp.floorplans;
        this.getUnitSummaries(obj.floorplan_id);
        this.selectUnitforSummary(this.fpUnitList[0]);
        $('#mbModalFloor').modal('hide');
      }
    }, error => { });
  }
  addUnitinFloorPlan() {
    console.log(this.unitInFloorPlan);
    this.spinner.show();
    if (this.unitInFloorPlan === '' || this.unitInFloorPlan === undefined || this.unitInFloorPlan === null) {
      this.toastr.error('Please fill the requirements');
      this.spinner.hide();
      $('#unitModalFloor').modal('show');
    }
    else {
      //  this.unit = this.unitWOPlans.length + 1;
      this.quoteService.addUnitsforFloor(this.quoteId, this.fpFloorPlanId, this.unitInFloorPlan).subscribe(resp => {
        if (resp.statusCode === 200) {

          this.spinner.hide();
          this.getUnitSummaries(this.fpFloorPlanId);
          if (resp.result) {
            this.fpUnitList = [];
            this.fpUnitList = resp.result;
          }

          $('#unitModalFloor').modal('hide');

          this.toastr.success(resp.message);
        } else {
          this.spinner.hide();
          this.toastr.success('Try again Later.');
        }
      }, error => { });
    }

  }
  addUnits() {
    console.log(this.unit);
    this.spinner.show();
    if (this.unit === '' || this.unit == null || this.unit == 'undefined') {
      this.spinner.hide();

      this.toastr.error('Please fill the no.of units');
      return false;
      $('#unitModal').modal('show');

    }
    else {
      //  this.unit = this.unitWOPlans.length + 1;
      this.quoteService.addUnits(this.quoteId, this.unit).subscribe(async resp => {
        if (resp.statusCode === 200) {
          await this.getquotation(this.quoteId);
          this.getUnits();
          await this.getFloorPlans();

          this.spinner.hide();
          const insertObj = { unit: this.unit };
          this.nodatafoundUnit = false;
          // this.unitWOPlans.push(insertObj);
          $('#unitModal').modal('hide');
          this.toastr.success(resp.message);
        } else {
          this.spinner.hide();
          this.toastr.success('Try again Later.');
        }
      }, error => { });
    }
  }

  updateunitname() {
    console.log(this.unitname);
    console.log('unitlevelproducts', this.unitLevelProducts);
    this.updateUnit();

  }

  removeFloor(floor) {
    this.confirmationDialogService.confirm('', 'Are you sure, you want to delete?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.spinner.show();
          this.quoteService.removeFloor(floor.quote_id, floor.sgid).subscribe(resp => {
            console.log(resp);
            if (resp.statusCode === 200) {
              this.getquotation(floor.quote_id);
              this.getUnits();
              for (const plan of this.floorPlans) {
                if (plan.sgid === floor.sgid) {
                  this.floorPlans.splice(this.floorPlans.indexOf(plan.sgid), 1);
                  if (this.floorPlans.length === 0) {
                    this.nodatafound = true;
                    this.isRemoveFloor = false;
                  }
                  break;
                }

              }
              this.getFloorPlans();
              this.spinner.hide();
              this.toastr.success(resp.message);
            } else {
              this.nodatafound = true;
              this.spinner.hide();
              this.toastr.success('Try again Later.');
            }

          }, error => { this.nodatafoundUnit = true; });
        }
      })
      .catch(() => console.log('User dismissed the dialog!'));

  }
  removeFloorUnits(unitData) {
    this.confirmationDialogService.confirm('', 'Are you sure, you want to delete ?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.spinner.show();
          this.quoteService.removeUnitsInFloorPlan(unitData.quote_id, unitData.unit, unitData.floorplan_id, unitData.sgid).subscribe(resp => {
            console.log(resp);
            if (resp.statusCode === 200) {
              for (const units of this.fpUnitList) {
                if (unitData.unit === units.unit) {
                  this.fpUnitList.splice(this.fpUnitList.indexOf(units), 1);

                  if (this.fpUnitList.length === 0) {
                    // this.nodatafoundUnit = true;
                    // this.isRemoveUnit = false;
                  }
                  break;
                }

              }
              this.spinner.hide();
              this.toastr.success(resp.message);
            } else {
              // this.nodatafoundUnit = true;
              this.spinner.hide();
              this.toastr.success('Try again Later.');
            }

          }, error => {// this.nodatafoundUnit = true;
          });
        }
      })
      .catch(() => console.log('User dismissed the dialog!'));
  }
  removeUnits(unitData) {


    if (this.unitWOPlans.length === 0) {
      this.nodatafoundUnit = true;

      return;
    }

    this.spinner.show();
    this.quoteService.removeUnits(unitData.quote_id, unitData.unit, unitData.sgid).subscribe(resp => {
      console.log(resp);
      if (resp.statusCode === 200) {
        this.getquotation(unitData.quote_id);
        this.getFloorPlans();
        this.TotalAssetValue = 0;
        this.getUnitlevelproducts(unitData.sgid);
        for (const units of this.unitWOPlans) {
          if (unitData.unit === units.unit) {
            this.unitWOPlans.splice(this.unitWOPlans.indexOf(units), 1);

            if (this.unitWOPlans.length === 0) {
              this.nodatafoundUnit = true;
              this.isRemoveUnit = false;
            }
            break;
          }

        }
        this.spinner.hide();
        this.toastr.success(resp.message);
      } else {
        this.nodatafoundUnit = true;
        this.spinner.hide();
        this.toastr.success('Try again Later.');
      }

    }, error => { this.nodatafoundUnit = true; });
  }
  addFloorPlans() {


    console.log(this.floorPlanName);
    console.log(this.floorPlanUnit);
    console.log(this.floorTypename);
    if (this.floorPlanName === undefined || (this.floorPlanName === '') || this.floorPlanUnit === undefined || (this.floorPlanUnit === '')) {
      this.toastr.error('Please fill the required* fields');
      return;
    } else {
      // floorplan_name, quote_id , floorplan_type (varchar), units
      const obj = {
        quote_id: this.quoteId,
        floorplan_name: this.floorPlanName,
        floorplan_type_id: this.floorTypeId,
        units: this.floorPlanUnit,
        userid: this.UserId

      };

      this.quoteService.addFloorPlan(obj).subscribe(resp => {
        console.log(resp);
        if (resp.statusCode === 200) {

          const insertObj = {
            floorname: this.floorPlanName,
            quote_id: this.quoteId,
            total_unit: this.floorPlanUnit,
            sgid: resp.result.sgid,
            floorplan_type_name: this.floorTypename,
            userid: this.UserId
          };
          this.spinner.hide();
          this.toastr.success(resp.message);
          this.nodatafound = false;
          // this.floorPlans.push(insertObj);
          console.log(this.floorPlans);
          this.fpFloorPlanId = resp.result.sgid;
          this.floorPlanName = '';
          this.floorPlanUnit = '';
          this.getFloorPlans();
          this.getUnits();
        } else {
          this.spinner.hide();
          this.toastr.success('Try again Later.');
        }

      }, error => { });
    }

  }
  UpdateFloorPlans() {



    if (this.floorPlanNameedit === undefined || (this.floorPlanNameedit === '')) {
      this.toastr.error('Please fill the required* fields');
      return;
    } else {
      // floorplan_name, quote_id , floorplan_type (varchar), units
      const obj = {
        floorplan_name: this.floorPlanNameedit,
        quote_id: this.quoteId,
        sgid: this.sgid,
        floorplan_type_id: this.floorTypeIdedit,
        userid: this.UserId

      };

      this.quoteService.updateFloorplan(obj).subscribe(resp => {
        console.log(resp);
        if (resp.statusCode === 200) {


          this.spinner.hide();
          this.toastr.success(resp.message);
          this.nodatafound = false;
          // this.fpFloorPlanId = resp.result.sgid;
          this.floorPlanNameedit = '';
          this.floorPlanUnitedit = '';
          this.floorTypenameedit = 'Studio'


          this.getFloorPlans();
          this.getUnits();
        } else {
          this.spinner.hide();
          this.toastr.success('Try again Later.');
        }

      }, error => { });
    }
  }
  removeFloorPlanMb(board) {
    this.confirmationDialogService.confirm('', 'Are you sure, you want to delete?')
      .then((confirmed) => {
        if (confirmed === true) {

          this.fpMoodboardList = [];
          this.spinner.show();
          console.log(board);
          this.quoteService.removeFPMoodbard(board.quote_id, board.moodboard_id, this.fpFloorPlanId).subscribe(resp => {
            console.log(resp);
            if (resp.statusCode === 200) {
              this.fpMoodboardList = resp.floorplans;
              this.getUnitSummaries(this.fpFloorPlanId);
              this.selectUnitforSummary(this.fpUnitList[0]);
              this.spinner.hide();
              this.toastr.success('Removed successfully');
            } else {
              // this.nodatafoundUnit = true;
              this.spinner.hide();
              this.toastr.success('Try again Later.');
            }

          }, error => { });
        }
      })
      .catch(() => console.log('User dismissed the dialog!'));
  }

  // copy function
  increaseQuantity(val) {
    console.log(val.is_total);
    if (parseFloat(val.is_qty) < 100) {
      val.is_qty++;
      // tslint:disable-next-line: radix
      val.is_total = parseFloat(val.is_sale_price) * val.is_qty;
      // tslint:disable-next-line: radix
      val.is_total = parseFloat(val.is_total);
      console.log(val.is_total);
      this.setTotal();
    }
  }
  unit_increaseQuantity(val) {
    console.log(val.is_total);
    if (parseFloat(val.is_qty) < 100) {
      val.is_qty++;
      // tslint:disable-next-line: radix
      val.is_total = parseFloat(val.is_sale_price) * val.is_qty;
      // tslint:disable-next-line: radix
      val.is_total = parseFloat(val.is_total);
      console.log(val.is_total);
      this.unitSetTotal();
    }
  }
  decreaseQuantity(val) {
    if (val.is_qty > 1) {
      val.is_qty--;
      // tslint:disable-next-line: radix
      val.is_total = parseFloat(val.is_sale_price) * val.is_qty;
      // tslint:disable-next-line: radix
      val.is_total = parseFloat(val.is_total);
      this.setTotal();
    }
  }
  unit_decreaseQuantity(val) {
    if (val.is_qty > 1) {
      val.is_qty--;
      // tslint:disable-next-line: radix
      val.is_total = parseFloat(val.is_sale_price) * val.is_qty;
      // tslint:disable-next-line: radix
      val.is_total = parseFloat(val.is_total);
      this.unitSetTotal();
    }
  }
  increaseDiscount(val) {
    if (val.b2b_discount < 90) {
      val.b2b_discount++;

      val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
      val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);

      this.setTotal();
    }
  }
  decreaseDiscount(val) {
    if (val.b2b_discount > 0) {
      val.b2b_discount--;
      val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
      val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);

      this.setTotal();
    }
  }
  increaseTotalDiscount() {
    if (this.quotationData.quote.discount < 90) {
      this.quotationData.quote.discount++;
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.quotationData.quote.discount_price = parseFloat(this.quotationData.sub_total) - ((parseFloat(this.quotationData.sub_total) * parseFloat(this.quotationData.quote.discount)) / 100);
      this.setTotal();
    }
  }
  unit_increaseTotalDiscount() {
    if (this.unitDiscount < 90) {
      this.unitDiscount++;
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.unitDiscountPrice = parseFloat(this.unitSubTotal) - ((parseFloat(this.unitSubTotal) * parseFloat(this.unitDiscount)) / 100);
      this.unitSetTotal();
    }
  }
  unit_decreaseTotalDiscount() {
    if (this.unitDiscount > 0) {
      this.unitDiscount--;
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.unitDiscountPrice = parseFloat(this.unitSubTotal) - ((parseFloat(this.unitSubTotal) * parseFloat(this.unitDiscount)) / 100);
      this.unitSetTotal();
    }
  }
  decreaseTotalDiscount() {
    if (this.quotationData.quote.discount > 0) {
      this.quotationData.quote.discount--;
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.quotationData.quote.discount_price = parseFloat(this.quotationData.sub_total) - ((parseFloat(this.quotationData.sub_total) * parseFloat(this.quotationData.quote.discount)) / 100);
      this.setTotal();
    }
  }

  increaseMonth(val) {
    if (val.months < 12) {
      val.months++;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        console.log(resp);
        val.price = resp.rental;
        val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
        val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);
        //   // tslint:disable-next-line: radix
        //   val.is_sale_price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
        //   // tslint:disable-next-line: radix
        //   val.is_total = parseFloat(val.price) * val.is_qty;
        // // tslint:disable-next-line: radix
        //   val.is_total = parseFloat(val.is_total);
        this.setTotal();
      });
    }
  }



  /* this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + productId + '&month=' + month)
  this.service_array */


  unit_increaseMonth(val) {
    if (val.months < 12) {
      console.log(val.months);
      val.months++;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        console.log(resp);
        val.price = resp.rental;
        val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
        val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);
        //   // tslint:disable-next-line: radix
        //   val.is_sale_price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
        //   // tslint:disable-next-line: radix
        //   val.is_total = parseFloat(val.price) * val.is_qty;
        // // tslint:disable-next-line: radix
        //   val.is_total = parseFloat(val.is_total);
        this.unitSetTotal();
      });
    }
  }

  unit_decreaseMonth(val) {
    if (val.months > 1) {
      val.months--;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        val.price = resp.rental;
        val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
        val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);
        // // tslint:disable-next-line: radix
        // val.sale_price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
        // // tslint:disable-next-line: radix
        // val.is_total = parseFloat(val.price) * val.is_qty;
        // // tslint:disable-next-line: radix
        // val.is_total = parseFloat(val.is_total);
        this.unitSetTotal();
      });
    }
  }

  decreaseMonth(val) {
    if (val.months > 1) {
      val.months--;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        val.price = resp.rental;
        val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
        val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);
        // // tslint:disable-next-line: radix
        // val.sale_price = parseFloat(val.price) - ((parseFloat(val.price) * parseFloat(val.b2b_discount)) / 100);
        // // tslint:disable-next-line: radix
        // val.is_total = parseFloat(val.price) * val.is_qty;
        // // tslint:disable-next-line: radix
        // val.is_total = parseFloat(val.is_total);
        this.setTotal();
      });
    }
  }
  deliveryfeeChange($event) {
    console.log($event);
    if ($event) {
      this.quotationData.quote.delivery_fee = $event;
      this.setTotal();
      this.Total();
    } else {
      this.quotationData.quote.delivery_fee = 0;
    }

  }

  pickupfeeChange($event) {
    console.log($event);
    if ($event) {
      this.quotationData.quote.pickup_fee = $event;
      this.setTotal();
      this.Total();
    } else {
      this.quotationData.quote.pickup_fee = 0;
    }

  }

  taxChange($event) {
    console.log($event);
    if ($event) {
      this.quotationData.quote.tax_amount = $event;
      this.setTotal();
      this.Total();
    } else {
      this.quotationData.quote.tax_amount = 0;
    }

  }

  unitSetTotal() {

    let subtotal: number;
    subtotal = 0;
    let monthlyrent: number;
    monthlyrent = 0;
    this.unitLevelProducts.forEach(element => {
      // tslint:disable-next-line: radix
      subtotal += parseFloat(element.is_total);
      console.log(subtotal);
      // tslint:disable-next-line: radix
      monthlyrent += parseFloat(element.is_sale_price);
    });
    this.unitMonthlyRent = monthlyrent;
    this.unitSubTotal = subtotal;
    this.unitDiscountPrice = parseFloat(this.unitSubTotal) - ((parseFloat(this.unitSubTotal) * parseFloat(this.unitDiscount)) / 100);

  }


  setTotal() {
    let subtotal: number;
    subtotal = 0;
    let monthlyrent: number;
    monthlyrent = 0;
    this.quotationData.quote_items.forEach(element => {
      // tslint:disable-next-line: radix
      subtotal += parseFloat(element.is_total);
      console.log(subtotal);
      // tslint:disable-next-line: radix
      monthlyrent += parseFloat(element.is_sale_price);
    });
    // tslint:disable-next-line: radix
    this.quotationData.sub_total = subtotal;

    // tslint:disable-next-line: radix
    this.quotationData.quote.monthly_rent = monthlyrent;
    // tslint:disable-next-line: max-line-length // tslint:disable-next-line: radix
    if (parseFloat(this.quotationData.quote.discount) > 0) {
      // tslint:disable-next-line: radix tslint:disable-next-line: max-line-length
      this.quotationData.quote.discount_price = parseFloat(this.quotationData.sub_total) - ((parseFloat(this.quotationData.sub_total) * parseFloat(this.quotationData.quote.discount)) / 100);
      // tslint:disable-next-line: max-line-length // tslint:disable-next-line: radix
      // this.quotationData.quote.net_total = parseFloat(this.quotationData.quote.delivery_fee) + parseFloat(this.quotationData.quote.discount_price) + parseFloat(this.quotationData.quote.tax_amount);
      this.quotationData.quote.net_total = parseFloat(this.quotationData.quote.delivery_fee) + parseFloat(this.quotationData.quote.pickup_fee) + parseFloat(this.quotationData.quote.discount_price) + parseFloat(this.quotationData.quote.tax_amount);
    } else {
      // tslint:disable-next-line: max-line-length // tslint:disable-next-line: radix
      //this.quotationData.quote.net_total = parseFloat(this.quotationData.quote.delivery_fee) + parseFloat(this.quotationData.quote.sub_total) + parseFloat(this.quotationData.quote.tax_amount);;
      this.quotationData.quote.net_total = parseFloat(this.quotationData.quote.delivery_fee) + parseFloat(this.quotationData.quote.pickup_fee) + parseFloat(this.quotationData.quote.sub_total) + parseFloat(this.quotationData.quote.tax_amount);;

    }
  }
  // copy end
  // sgid,qty,total,discount,b2b_discount,months,price,sale_price,quote_id,quote_discount,sub_total,net_total,delivery_fee,tax,monthly_rent,quote_discount_price

  saveQuote() {
    this.spinner.show();
    console.log('get');
    const postArr = [];
    this.quotationData.quote_items.forEach(elem => {

      const obj = {
        sgid: elem.sgid,
        quote_id: this.quoteId,
        id: this.quotationData.quote.sgid,
        old_month: elem.old_month,
        qty: elem.is_qty,
        percentage_discount: elem.percentage_discount,
        months: elem.months,
        price: elem.price,
        buy_price: elem.buy_price,
        sale_price: elem.price,
        apply_b2b_discount: elem.b2b_discount,
        total: elem.is_total,
        discount: elem.discount,
        delivery_fee: this.quotationData.quote.delivery_fee,
        pickup_fee: this.quotationData.quote.pickup_fee,
        tax: this.quotationData.quote.tax_amount,
        net_total: this.quotationData.quote.net_total,
        quote_discount: this.quotationData.quote.discount,
        quote_discount_price: this.quotationData.quote.discount_price,
        sub_total: this.quotationData.sub_total,
        monthly_rent: this.quotationData.quote.monthly_rent,
        buy_discount: this.quotationData.quote.buy_discount ?? 0,
        buy_net_total: this.quotationData.quote.buy_net_total ?? 0,
        buy_sub_total: this.quotationData.quote.buy_sub_total ?? 0,
        rent_net_total: this.quotationData.quote.rent_net_total ?? 0,
        rent_sub_total: this.quotationData.quote.rent_sub_total ?? 0,
        rent_discount: this.quotationData.quote.rent_discount
      };
      postArr.push(obj);

    });
    console.log('postarr', postArr);
    this.quoteService.saveQuotes(postArr).subscribe(resp => {
      console.log(resp);
      this.saveQRes = resp
      this.remsg = resp.message
      console.log(this.remsg);
      this.spinner.hide();
      if (this.saveQRes.statusCode == 201) {
      this.toastr.error('Adjustment amount can not be less than Monthly Rent ');
      }else{
        if(this.order_number_ref){
          this.toastr.success('Order saved successfully');
        }else{
          this.toastr.success('Quote saved successfully');
        }
        
      } 
      this.getquotation(this.quoteId)
    });


  }

  saveRentAdjustmentAmount() {
    this.spinner.show();
    console.log('get');
    const postArr = [];
    this.quotationData.quote_items.forEach(elem => {

      const obj = {
        sgid: elem.sgid,
        quote_id: this.quoteId,
        id: this.quotationData.quote.sgid,
        old_month: elem.old_month,
        qty: elem.is_qty,
        percentage_discount: elem.percentage_discount,
        months: elem.months,
        price: elem.price,
        buy_price: elem.buy_price,
        sale_price: elem.price,
        apply_b2b_discount: elem.b2b_discount,
        total: elem.is_total,
        discount: elem.discount,
        delivery_fee: this.quotationData.quote.delivery_fee,
        pickup_fee: this.quotationData.quote.pickup_fee,
        tax: this.quotationData.quote.tax_amount,
        net_total: this.quotationData.quote.net_total,
        quote_discount: this.quotationData.quote.discount,
        quote_discount_price: this.quotationData.quote.discount_price,
        sub_total: this.quotationData.sub_total,
        monthly_rent: this.quotationData.quote.monthly_rent,
        rent_adjustment_value: this.userAddedDiscount,
        rent_adjustment_type: this.rentAdjustmentType,
        buy_discount: this.quotationData.quote.buy_discount ?? 0,
        buy_net_total: this.quotationData.quote.buy_net_total ?? 0,
        buy_sub_total: this.quotationData.quote.buy_sub_total ?? 0,
        rent_net_total: this.quotationData.quote.rent_net_total ?? 0,
        rent_sub_total: this.quotationData.quote.rent_sub_total ?? 0,
        rent_discount: this.quotationData.quote.rent_discount
      };
      postArr.push(obj);

    });
    console.log('postarr', postArr);
    this.quoteService.saveQuotes(postArr).subscribe(resp => {
      console.log(resp);
      this.saveQRes = resp
      this.remsg = resp.message
      console.log(this.remsg);
      this.spinner.hide();
      if (this.saveQRes.statusCode == 201) {
       
      this.toastr.error('Adjustment amount can not be less than Monthly Rent ');
      }else{
        this.toastr.success('Quote saved successfully');
        this.test = '0'
      } 
      this.getquotation(this.quoteId)
    });


  }

  invpopupModelShow(id) {
    $("#invpopup").show();
    for (let i = 0; i < this.warehouseLocations.length; i++) {
      if (this.warehouseLocations[i].warehouse_id == id) {
        this.AssignedInv = this.warehouseLocations[i].assigned_inv;
        this.B2bstorage = this.warehouseLocations[i].b2b_non_assigned_inv;
        this.invQuantity = this.warehouseLocations[i].non_assigned_inv;
      }
    }
  }

  invpopupModelHide() {
    $("#invpopup").hide();
  }
  setDetails(index) {
    this.productName = this.itemInfo?.name;
    this.productId = this.itemInfo?.sgid;
    this.editProductName = this.itemInfo?.name;
    this.displayImage = this.itemInfo?.variations[index]?.default_images[0]?.image_url.large;
    this.supplierName = this.itemInfo?.variations[index]?.supplier_name;
    // this.supplierPrice = this.itemInfo?.variations[index]?.orginal_price;
    this.categoryname = this.itemInfo?.category?.category_name;
    // this.inhabitrPrice = this.itemInfo?.variations[index]?.asset_value;
    this.editPrice = this.itemInfo?.variations[index]?.asset_value;
    this.rentForMonth = this.itemInfo?.variations[index]?.default_price[0]?.month;
    this.rentPrice = this.itemInfo?.variations[index]?.default_price[0]?.rental_price;
    this.warehouseLocation = this.itemInfo?.variations[index].warehouse_location.warehouse_name;
    // this.quantity = this.itemInfo?.variations[index]?.quantity;
    this.sourcetype = this.itemInfo?.source; // source type not there source_type
    this.supplierSKU = this.itemInfo?.supplier_sku;
    this.isOPsDb = this.itemInfo?.variations[index].is_ops_db;
    this.updateOps = this.itemInfo?.updated_in_OPS;
    this.warehouseLocations = this.itemInfo?.variations[index]?.warehouse_location_new;
    if ((this.sourcetype.toLowerCase() === 'ops dashboard') || (this.isOPsDb === true && (this.sourcetype.toLowerCase() === 'api' || this.sourcetype.toLowerCase() === 'edi' || this.sourcetype.toLowerCase() === 'bookmarklet'))) {
      this.sku_variation_inhabitr = this.inhabitrSKU = this.itemInfo?.source === 'Ops Dashboard' ? this.itemInfo?.variations[index]?.sku : this.itemInfo?.variations[index]?.inhabitr_sku;
    }
    else {
      this.inhabitrSKU = '-';
      this.sku_variation_inhabitr = null;
    }
    if (this.sourcetype.toLowerCase() === 'ops dashboard') {
      this.supplierPrice = null;
      this.inhabitrPrice = this.itemInfo?.variations[index]?.asset_value;
      if (this.itemInfo?.is_inventoryCount == 1) {
        this.TotalInv = this.itemInfo?.total_inv;
      }
      else {
        this.TotalInv = this.itemInfo?.variations[index]?.warehouse_location.inhabitr_quantity;
      }
      if (this.itemInfo?.variations[index]?.warehouse_location?.supplier_quantity != null && this.itemInfo?.variations[index]?.warehouse_location?.supplier_quantity == '') {
        this.SupplierInv = this.itemInfo?.variations[index]?.warehouse_location.supplier_quantity;
      }
      else {
        this.SupplierInv = 0;
      }


    } else if (this.sourcetype.toLowerCase() === 'api' || this.sourcetype.toLowerCase() === 'edi' || this.sourcetype.toLowerCase() === 'bookmarklet') {
      this.supplierPrice = this.itemInfo?.variations[index]?.asset_value;
      this.inhabitrPrice = null;
      this.SupplierInv = this.itemInfo?.variations[index]?.warehouse_location.supplier_quantity
      if (this.itemInfo?.variations[index]?.warehouse_location?.inhabitr_quantity != null && this.itemInfo?.variations[index]?.warehouse_location?.inhabitr_quantity == '') {
        this.TotalInv = this.itemInfo?.variations[index]?.warehouse_location?.inhabitr_quantity;
      }
      else {
        this.TotalInv = 0;
      }
      if (this.isOPsDb) {
        this.inhabitrPrice = this.itemInfo?.variations[index]?.asset_value;

      }


    }
    // this.inhabitrSKU = this.itemInfo?.variations[index]?.sku;
    this.isPublish = this.itemInfo?.status;
    // this.is_inventoryCount=this.itemInfo?.is_inventoryCount;
    if (this.itemInfo?.inventoryCount != null) {
      this.invQuantity = this.itemInfo?.inventoryCount;
      this.is_inventoryCount = this.itemInfo?.is_inventoryCount;
    }
    // this.invQuantity=this.itemInfo?.inventoryCount;
    this.prod_id = this.itemInfo?.variations[index]?.product_id;
    this.attribute = this.itemInfo?.variations[index]?.attribute_info;
    // this.TotalInv = this.itemInfo?.total_inv;
    this.AssignedInv = this.itemInfo?.assigned_inv;
    this.B2bstorage = this.itemInfo?.b2b_storage_inv;

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
  getItem(id, content) {
    //return;
    this.prod_id = id;
    this.spinner.show();
    this.shop.getItem(id).subscribe(
      resp => {
        this.spinner.hide();
        this.itemInfo = resp.result;
        this.variationImages = this.itemInfo.variations;
        // tslint:disable-next-line: max-line-length
        // this.inhabitrPrice = parseFloat(this.itemInfo.salePrice) + this.getPercentageValue(this.itemInfo.salePrice, this.inhabitrPercentage);
        this.setDetails(0);
        if (this.itemInfo.features) {
          this.features = this.itemInfo.features.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '');

        }
        if (this.itemInfo.description) {
          this.description = this.itemInfo.description.toString().trim().replace(/\\n|\\r/g, '').replace(/&/g, '')
            .replace(/<br>/g, '').replace(/<ul>/g, '').replace(/<li>/g, '').replace(/<\/ul>/g, '').replace(/<\/li>/g, '');
        }
        this.modalService.open(content, this.modalOptions).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

      }, err => {
        this.spinner.hide();
      });
  }





  generatePDF() {

    this.pdfservice.pdfGeneration();
  };

  toDataURL(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }





  updateUnit() {
    this.spinner.show();
    console.log('update Unit');
    console.log('this.u_unitid', this.sgSelectedUnitId);
    const postArr = [];
    const items = [];
    const unit = [];

    this.unitLevelProducts.forEach(elem => {
      const obj = {
        sgid: elem.sgid,
        qty: elem.is_qty,
        discount: elem.discount,
        b2b_discount: elem.b2b_discount,
        months: elem.months,
        total_price: elem.is_total,
        price: elem.price,
        sale_price: elem.is_sale_price,
      };
      console.log('unitlevelproducts', this.unitLevelProducts);
      items.push(obj);
    });
    const obj1 = {
      sgid: this.sgSelectedUnitId,
      name: this.unitname,
      pickup_fee: this.pickupfee,
      delivery_fee: this.Deleveryfee,
    };
    unit.push(obj1);
    postArr.push({ 'items': items });
    postArr.push({ 'unit': unit });
    postArr.push({ 'quote_id': this.quoteId });
    console.log('unit update', postArr);
    this.quoteService.updateUnit(postArr).subscribe(resp => {
      console.log(resp);
      this.spinner.hide();
      this.getUnitlevelproducts(this.sgSelectedUnitId);

      this.toastr.success('Unit updated successfully');
    });


  }

  removeUnitLevelProduct(prod) {
    this.unitLevelProducts = []
    this.TotalAssetValue = 0;
    this.spinner.show();
    // tslint:disable-next-line: max-line-length
    this.quoteService.removeProduct({ quote_id: this.quoteId, item_id: prod.sgid }).subscribe(resp => {
      // this.getMoodBoardDetails(this.moodboardDetails.moodboard.sgid);

      this.quoteService.getUnitProducts({ sgid: this.sgSelectedUnitId }).subscribe(resp => {
        console.log(resp);
        if (resp.statusCode === 200) {
          this.unitLevelProducts = resp.result;
          this.unitSubTotal = resp.subtotal;
          this.unitDiscount = resp.discount;
          this.Deleveryfee = resp.deliveryFee;
          this.pickupfee = resp.pickup_fee;
          this.TotalAssetValue = resp.asset_value;
          this.unitDiscountPrice = parseFloat(this.unitSubTotal) - ((parseFloat(this.unitSubTotal) * parseFloat(this.unitDiscount)) / 100);
          this.unitSetTotal();
        }
        this.spinner.hide();
      }, error => {
        console.log('error');
      });



    });
  }

  removeFloorPlanLevelProduct(prod) {
    this.confirmationDialogService.confirm('', 'Are you sure,you want to delete').then(isConfirm => {
      if (isConfirm) {
        this.spinner.show();
        // tslint:disable-next-line: max-line-length
        this.quoteService.removeProduct({ quote_id: this.quoteId, item_id: prod.sgid }).subscribe(resp => {
          // this.getMoodBoardDetails(this.moodboardDetails.moodboard.sgid);

          console.log(resp);
          this.getFloorplanSummary(this.fpFloorPlanId, this.f_unitId, this.quoteId);
          this.spinner.hide();
        });
      }
    })


  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        //  term.length < 2 ? []
        // :
        this.floorPlanNames
        //.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      ))


  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to ... ?')
      .then((confirmed) => console.log('User confirmed:', confirmed))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  getInventeryqty() {
    console.log(this.prod_id);

    this.shop.getInventoryqty(this.prod_id, this.sku_variation_inhabitr).subscribe(resp => {
      this.TotalInv = resp.result.total;
      this.is_inventoryCount = 1;
      this.AssignedInv = resp.result.assigned;
      this.invQuantity = resp.result.nonassigned;
      this.B2bstorage = resp.result.b2bnonassigned;
      this.toastr.success(resp.message);

    })

  }
  updateRent(event) {
    this.monthNums = event.target.value;
    // this.rentPrice = this.itemInfo?.variations[0]?.default_price[event.target.value - 1]?.rental_price;
    if (this.monthNums == 1) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[11]?.rental_price;
    }
    else if (this.monthNums == 2) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[10]?.rental_price;
    }
    else if (this.monthNums == 3) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[9]?.rental_price;
    }
    else if (this.monthNums == 4) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[8]?.rental_price;
    }
    else if (this.monthNums == 5) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[7]?.rental_price;
    }
    else if (this.monthNums == 6) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[6]?.rental_price;
    }
    else if (this.monthNums == 7) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[5]?.rental_price;
    }
    else if (this.monthNums == 8) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[4]?.rental_price;
    }
    else if (this.monthNums == 9) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[3]?.rental_price;
    }
    else if (this.monthNums == 10) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[2]?.rental_price;
    }
    else if (this.monthNums == 11) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[1]?.rental_price;
    }
    else if (this.monthNums == 12) {
      this.rentPrice = this.itemInfo?.variations[0]?.default_price[0]?.rental_price;
    }
  }
  getUnitlevelproducts(id) {

    this.unitLevelProducts = [];
    this.quoteService.getUnitProducts({ sgid: id }, this.unit.floorplan_id, this.quoteId).subscribe(resp => {
      console.log(resp);
      this.TotalAssetValue = 0;
      if (resp.statusCode === 200) {
        this.unitLevelProducts = resp.result;
        this.copyofunitLevelProducts = this.unitLevelProducts;
        this.sgSelectedUnit = resp.unit_name;
        this.unitSubTotal = resp.subtotal;
        this.unitDiscount = resp.discount;
        this.Deleveryfee = resp.deliveryFee;
        this.pickupfee = resp.pickup_fee;
        this.TotalAssetValue = resp.asset_value;
        console.log(this.TotalAssetValue);
        this.unitDiscountPrice = parseFloat(this.unitSubTotal) - ((parseFloat(this.unitSubTotal) * parseFloat(this.unitDiscount)) / 100);
        this.unitSetTotal();
      }

    }, error => {
      console.log('error');
    });
  }
  getMoodboardlistofunit(id) {
    this.quoteService.getMoodboardListOfUnit({ sgid: id }).subscribe(resp => {
      console.log(resp);
      if (resp.statusCode === 200) {
        this.sgUnitMbList = resp.result;
        // this.sgSelectedMb =this.fpMymblist[0].boardname;
        // this.sgSelectedMbId = this.fpMymblist[0].sgid;

        this.sgslectedmbimage = resp?.result[0]?.unitmoodboards?.is_moodboard_images?.large;
        this.sgSelectedFloorPlan = resp?.floorplan[0]?.floorplan?.floorname;
        this.sgSelectedFloorPlanId = resp?.floorplan[0]?.floorplan?.sgid;


      } else {
        this.sgSelectedMb = 'No moodboard found';
      }
    }, error => {
      this.sgSelectedMb = 'Error in call';
    });
  }
  getDeleveryFee(event) {
    this.Deleveryfee = event.target.value;
    console.log('de', this.Deleveryfee)
  }
  getpickupFee(event) {
    this.pickupfee = event.target.value;
    console.log('pe', this.pickupfee)
  }
  AddFloorplanunitlevel() {
    const obj = {
      unit: this.sgSelectedUnit,
      floorplan_id: this.sgSelectedFloorPlanId,
      quote_id: this.quoteId,
      sgid: this.sgSelectedUnitId


    };
    console.log('unit level floor plan', obj);
    this.quoteService.addFloorPlanatunitlevel(obj).subscribe(resp => {
      console.log(resp);
      if (resp.statusCode === 200) {


        this.spinner.hide();
        this.toastr.success(resp.message);
        this.getFloorPlans();
        this.getUnits();
      } else {
        this.spinner.hide();
        this.toastr.success('Try again Later.');
      }

    }, error => { });
  }
  getUnitwiseDeliveryfee() {
    console.log(this.quotation);
    console.log(this.Unitcount);
  }
  UpdateDeliveryFee() {
    console.log(this.quoteDeliveryFee, this.quoteOrderDeliveryFee);
    
    // if (!this.quoteDeliveryFee && !this.quoteOrderDeliveryFee) {
    //   this.toastr.warning("Invalid Delivery fee")
    //   $('#editdeliveryfeeModal').modal('show');
    //   return;
    // }
    this.http.post(environment.endPoint + "updateFee", {
      "fee_type": "delivery",
      "fee": this.quoteDeliveryFee,
      "order_delivery_fee": this.quoteOrderDeliveryFee,
      "quote_id": this.quoteId,
      "update_on":this.deliveryFeeShow
    }
    ).subscribe(data => {
      $('#editdeliveryfeeModal').modal('hide');
      this.getquotation(this.quoteId)
    }, () => {

      $('#editdeliveryfeeModal').modal('show');
      this.toastr.warning("Delivery fee Not Updated")
    })
    // this.quotationData.quote.delivery_fee = Number(this.unitdeliveryfee) * Number(this.Unitcount);
    // this.calculateQuoteTotal()
  }
  getUnitDelivryfee(event) {
    this.unitdeliveryfee = event.target.value;

  }
  UpdatePickupFee() {
    if (!this.quotePickupFee) {
      this.toastr.warning('Invalid Pickup Fee');
      return;
    }
    this.http.post(environment.endPoint + "updateFee", {
      "fee_type": "pickup",
      "fee": this.quotePickupFee || '',
      "quote_id": this.quoteId
    }).subscribe(data => {
      this.getquotation(this.quoteId);
    })
    // this.quotationData.quote.pickup_fee = Number(this.unitpickupfee) * Number(this.Unitcount);
    // console.log('this.quotationData.quote.pickup_fee', this.quotationData.quote.pickup_fee);
  }
  getUnitPickupfee(event) {
    this.unitpickupfee = event.target.value;
  }
  /**
   * Define product type i.e Rent Or Buy
   * @param type
   * @returns
   */
  isRent(type) {
    return (type == '0')
  }

  /**
   * Start
   * Unit Summary
   */
  updateUS(product) {
    this.updateUSItemTotal(product)
    this.updateUnitInfo();
  }


  /**
   * Update
   */
  updateUnitInfo() {
    this.updateUSSubTotal();
    this.updateUSMonthlyRent();
    this.updateUSTaxes();
    this.updateUSTotal()
  }

  /**
   * update unit summary item total
   * @param item
   */
  updateUSItemTotal(item) {
    let price = this.isRent(item.button_type) ? item.price : item.buy_price;
    item.is_total = this.calculateItemTotalPrice(price, item.discount, item.is_qty)
  }

  /**
   * Update unit summary subtotal
   */
  updateUSSubTotal() {
    this.unitInfo.sub_total = this.calculateSubTotal(this.floorPlanData)
  }

  /**
  * update unit summary monthly rent
  */
  updateUSMonthlyRent() {
    this.unitInfo.monthly_rent = this.calculateSubTotal(this.floorPlanData.filter(item => this.isRent(item.button_type)))
  }

  /**
* update unit summary total
*/
  updateUSDeliveryFee(event) {
    if (event.target.value === '') {
      event.target.value = 0;
    }
    this.unitInfo.delivery_fee = parseFloat(event.target.value)
    // this.updateUnitInfo()
    this.updateFloorplansummaryofUnit()
    console.log(this.unitInfo.delivery_fee);
  }

  /**
  * update unit summary tax amount
  */
  updateUSTaxes() {
    let { sub_total = 0, delivery_fee = 0 } = this.unitInfo;
    this.unitInfo.tax_amount = this.calculateTax(sub_total, delivery_fee, this.taxRate);
  }

  /**
* Update Unit Summary Total
*/
  updateUSTotal() {
    let { sub_total = 0, delivery_fee = 0, tax_amount = 0 } = this.unitInfo;
    this.unitInfo.net_total = this.calculateTotal(sub_total, delivery_fee, tax_amount);
  }

  updateUSPickupFee(event) {
    if (event.target.value === '') {
      event.target.value = 0;
    }
    this.unitInfo.pickp_fee = parseFloat(event.target.value)
    // this.updateUnitInfo()
  }

  /**
   * Increase unit summary item quantity
   * @param val
   */
  increaseUSItemQuantity(val) {
    if (parseFloat(val.is_qty) < 100) {
      val.is_qty++;
      this.updateUS(val)
    }
  }

  /**
   * Decrese unit summary item quantity
   * @param val
   */
  decreaseUSItemQuantity(val) {
    if (val.is_qty > 1) {
      val.is_qty--;
      this.updateUS(val)
    }
  }

  /**
   * On Unit Change
   * @param val
   */
  selectUnitforSummary(val) {
    this.selectedUnit = val;
    this.fp_unitname = val.name;
    this.fpFloorPlanId = val.floorplan_id;
    this.f_unitId = val.sgid;
    this.fpUnitList.forEach((elem, index) => {
      if (elem.unit === val.unit) {
        elem.isfpsummary = true;
      } else {
        elem.isfpsummary = false;
      }

    });
    this.spinner.show();
    this.getFloorplanSummary(val.floorplan_id, val.sgid, this.quoteId);
  }


  //common
  calculateTax(subTotal, deliveryFee, taxRate) {
    return (parseFloat(subTotal) + parseFloat(deliveryFee)) * parseFloat(taxRate) / 100
  }
  calculateTotal(subTotal, deliveryFee, taxAmount) {
    return parseFloat(subTotal) + parseFloat(deliveryFee) + parseFloat(taxAmount)
  }



  /**
  * End
  * Unit Summary
  */

  /**
   * Start
   * Floor Plan Summary
   */
  getFloorplanSummary(fpId, unitId, quoteId) {
    // this.TotalAssetValue = 0;
    this.quoteService.getFloorplanSummary(fpId, unitId, quoteId).subscribe(resp => {
      if (resp.statusCode) {
        this.spinner.hide()
        this.floorPlanData = resp.result;
        this.floorPlanInfo = resp.floorplan;
        this.unitInfo = resp.unit;
        this.taxRate = resp.sales_tax_rate;
        console.log(this.unitInfo);
        
      }
    }, error => {
      this.spinner.hide()
      this.floorPlanData = []
      this.floorPlanInfo = {};
      this.unitInfo = {};
    });
  }



  updateFloorPlan(product) {
    console.log("updateFloorPlan",product)
    let price = product.button_type === 0 ? parseFloat(product.price) : parseFloat(product.buy_price);
    let discount = parseFloat(product.discount);
    let quantity = parseFloat(product.is_qty);
    product.is_total = this.calculateItemTotalPrice(price, discount, quantity);
    this.updateFloorPlanInfo()
  }

  updateFloorPlanInfo() {
    this.floorPlanInfo.subtotal = this.calculateSubTotal(this.floorPlanData);
    this.floorPlanInfo.monthlyrent = this.floorPlanInfo.subtotal;
    this.floorPlanInfo.net_total = parseFloat(this.floorPlanInfo.monthlyrent) + parseFloat(this.floorPlanInfo.deliveryFee);
  }

  updateDeliveryFee(event) {
    if (event.target.value === '') {
      event.target.value = 0;
    }
    this.floorPlanInfo.deliveryFee = parseFloat(event.target.value);
    this.updateFloorPlanInfo()
  }

  /**
   * Start
   * Quote summary
   */
  eventRentDisc: any
  discountChange(evt) {
    this.quotationData.quote.rent_discount = evt;
    this.updateSubTotal()
  }

  buyDiscountChange(evt) {
    this.quotationData.quote.buy_discount = evt;
    this.updateSubTotal()
    console.log(this.quotationData.quote.buy_discount);
    
  }
  unitDiscountChange(evt){
    this.unitInfo.buy_discount= evt;
    this.unitLevel_buy_dis = evt
    console.log(this.unitInfo.buy_discount);
    this.fSubTotal()
    
  }
  /**
   * Upate item total price
   * @param prod
   */
  updateRentPrice:any;
  updateTotal(prod) {
    console.log("updateTotal",prod)
    this.updateRentPrice = prod
    let price = prod.button_type === 0 ? parseFloat(prod.price) : parseFloat(prod.buy_price);
    let discount = parseFloat(prod.discount);
    let quantity = parseFloat(prod.is_qty);
    prod.is_total = (price - discount) * quantity;
    this.updateSubTotal()
    // this.updateSaleSubTotal();
    // this.calculateQuoteTax();
    // this.calculateQuoteTotal();
  }

  increaseQuoteNOM() {
    if (this.fnl_mnths < 12) {
      this.service_array = []
      console.log(this.ps_data_price)
      console.log(Object.keys(this.ps_data_price))
      let arr = Object.keys(this.ps_data_price)
      this.fnl_mnths++
      arr.forEach((elem, i) => {
        // console.log(elem)
        this.service_array.push(this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + elem + '&month=' + this.fnl_mnths))
        // this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + productId + '&month=' + month)
      })
      setTimeout(() => {
        forkJoin(this.service_array).subscribe(async results => {
          await arr.map((r, i) => {

            this.ps_data_price[r].price = results[i]['rental']
            this.ps_data_price[r].months = this.fnl_mnths
            this.ps_data_price[r].is_total = parseFloat(this.ps_data_price[r].is_qty) * (parseFloat(this.ps_data_price[r].price) - ((parseFloat(this.ps_data_price[r].b2b_discount) / 100) * parseFloat(this.ps_data_price[r].price)));
            this.ps_data_price[r].is_sale_price = parseFloat(this.ps_data_price[r].price) * parseFloat(this.ps_data_price[r].is_qty);
            // val.months++;
          })
          this.service_array = []
          await this.setTotal();
          console.log(results)
        });
      }, 2000);


    }
  }
  decreaseQuoteNOM() {
    if (this.fnl_mnths > 1) {
      this.service_array = []

      let arr = Object.keys(this.ps_data_price)
      this.fnl_mnths--
      arr.forEach((elem, i) => {
        // console.log(elem)
        this.service_array.push(this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + elem + '&month=' + this.fnl_mnths))
        // this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + productId + '&month=' + month)
      })

      setTimeout(() => {
        //this.modalRef.hide();
        // this.sendRequestForm.reset();
        forkJoin(this.service_array).subscribe(async results => {
          await arr.map((r, i) => {
            console.log(r)
            console.log(i)
            this.ps_data_price[r].price = results[i]['rental']
            this.ps_data_price[r].months = this.fnl_mnths
            this.ps_data_price[r].is_total = parseFloat(this.ps_data_price[r].is_qty) * (parseFloat(this.ps_data_price[r].price) - ((parseFloat(this.ps_data_price[r].b2b_discount) / 100) * parseFloat(this.ps_data_price[r].price)));
            this.ps_data_price[r].is_sale_price = parseFloat(this.ps_data_price[r].price) * parseFloat(this.ps_data_price[r].is_qty);
            // val.months++;
          })
          this.service_array = []
          await this.setTotal();
          console.log(results)
        });

      }, 2000);




      /* val.months--;
      this.mbs.getMonthPrice(val.product_id, val.months).subscribe(resp => {
        val.price = resp.rental;
        val.is_total = parseFloat(val.is_qty) * (parseFloat(val.price) - ((parseFloat(val.b2b_discount) / 100) * parseFloat(val.price)));
        val.is_sale_price = parseFloat(val.price) * parseFloat(val.is_qty);

        this.setTotal();
      }); */
    }
  }

  calculateItemTotalPrice(price, discount, quantity): number {
    return (parseFloat(price) - parseFloat(discount)) * parseFloat(quantity);
  }

  /**
   * Update Rental price
   * @param evt
   * @param index
   * @param prod
   */
  updatePrice(event, index, prod) {
    if (event.target.value === "") {
      event.target.value = 0;
    }
    prod.price = parseFloat(event.target.value);
    this.updateTotal(prod);
    this.updateFloorPlan(prod);
  }



  /**
   * Total Price
   */
  calculateQuoteTotal() {
    this.quotationData.total = this.getSubTotalbyQuoteStatue() + parseFloat(this.quotationData.quote.delivery_fee) + parseFloat(this.quotationData.quote.tax_amount)
  }
  unitCalculateQuoteTotal() {
    this.unitInfo.net_total = parseFloat((this.unitInfo.rent_net_total) + parseFloat(this.unitInfo.buy_net_total)) + parseFloat(this.unitInfo.delivery_fee) + parseFloat(this.unitInfo.tax_amount)
  }


  getSubTotalbyQuoteStatue(): number {
    if (this.quoteItemStatus == '0') {
      return parseFloat(this.quoteInfo.rent_net_total);
    } else if (this.quoteItemStatus == '1') {
      return parseFloat(this.quoteInfo.buy_net_total)
    }
    return (parseFloat(this.quoteInfo.rent_net_total) + parseFloat(this.quoteInfo.buy_net_total));
  }
  calculateQuoteTax() {
    let totalAmount = this.getSubTotalbyQuoteStatue() + parseFloat(this.quotationData.quote.delivery_fee);
    let percentage = parseFloat(this.quotationData.quote.tax_percentage);
    this.quotationData.quote.tax_amount = totalAmount * percentage / 100;
    this.calculateQuoteTotal()
  }

  unitCaluateQuoteTax(){
    // debugger
    let totalAmount = parseFloat((this.unitInfo.rent_net_total) + parseFloat(this.unitInfo.buy_net_total)) + parseFloat(this.unitInfo.delivery_fee);
    let percentage = parseFloat(this.quotationData.quote.tax_percentage);
    this.unitInfo.tax_amount = totalAmount * percentage / 100;
    this.unitCalculateQuoteTotal()
  }

  /**
   * Update buy price
   * @param evt
   * @param index
   * @param prod
   */
  updateBuyPrice(event, index, prod) {
    if (event.target.value === "") {
      event.target.value = 0;
    }
    prod.buy_price = parseFloat(event.target.value);
    this.updateTotal(prod);
    this.updateFloorPlan(prod);
    // this.setTotalFp()
  }

  calculateSubTotal(list: any[], key = "is_total"): number {
    return list.reduce((int, obj) => { return int + parseFloat(obj[key]) }, 0)
  }
  updateSubTotal() {
    this.quotationData.sub_total = this.quoteProductList.reduce((int, item) => { return int + item.is_total }, 0)
    this.updateSaleSubTotal();

  }
  fSubTotal() {
    // this.unitInfo.sub_total = this.unitInfo.reduce((int, item) => { return int + item.buy_net_total }, 0)
    // console.log(this.unitInfo.sub_total); 
    this.pdateSaleSubTotal();

  }
  pdateSaleSubTotal() {
  this.unitInfo.buy_net_total = parseFloat(this.unitInfo.buy_sub_total) - parseFloat(this.unitInfo.buy_discount ?? 0)
  console.log(this.unitInfo.buy_net_total);
    this.unitCaluateQuoteTax();
  }

  updateSaleSubTotal() {
    // debugger
    this.quoteInfo.rent_sub_total = this.quoteProductList.reduce((int, item) => {
      return int + (item.button_type === 0 ? item.is_total : 0)
    }, 0)
    this.quoteInfo.buy_sub_total = this.quoteProductList.reduce((int, item) => {
      return int + (item.button_type === 1 ? item.is_total : 0)
    }, 0)
    // this.quoteInfo.rent_net_total = parseFloat(this.quoteInfo.rent_sub_total) - parseFloat( this.quotationData.quote.rent_discount ?? 0);
    this.quoteInfo.buy_net_total = parseFloat(this.quoteInfo.buy_sub_total) - parseFloat(this.quotationData.quote.buy_discount ?? 0);
    this.calculateQuoteTax();
  }

  /**
   * End
   * Quote summary
   */
  changeb2bdiscount(event, index, prod) {
    if (event.target.value == 0) {
      this.quotationData.quote_items[index].percentage_discount = this.copyofquotationData.quote_items[index].percentage_discount;
      this.quotationData.quote_items[index].price = this.copyofquotationData.quote_items[index].price;
      this.quotationData.quote_items[index].discount = this.copyofquotationData.quote_items[index].discount;
    }
    else {

      this.quotationData.quote_items[index].b2b_discount = event.target.value;
      this.calculateDiscountpermonth(index);
      this.calculatePricepermonth(index);
      this.calculateB2Bdiscountpermonth(index);
      this.itemtotal(index, prod);
      this.salespermonthcalculation(index, prod);
      this.salesSubtotal();
      this.SubTotal();
      this.Total();
      this.MonthlyRent();
    }
  }
  updateDiscount(event, index, prod) {
    if (event.target.value === "") {
      event.target.value = 0;
    }
    prod.discount = parseFloat(event.target.value);
    this.updateTotal(prod);
    this.updateFloorPlan(prod);
    this.updateUS(prod)
  }
  getQuoteInventeryqty() {
    console.log(this.prod_id);
    this.item.getquoteInventoryqty(this.prod_id, this.sku_variation_inhabitr).subscribe(resp => {
      this.AssignedtoquoteInv = resp.productQuoteCount;
      this.toastr.success(resp.message);

    })

  }
  discount(event) {
    this.quotationData.quote.discount_price = event.target.value;
  }
  calculateDiscountpermonth(index) {
    if (this.quotationData.quote_items[index].price != 0 && this.quotationData.quote_items[index].percentage_discount != 0) {
      this.quotationData.quote_items[index].discount = ((this.quotationData.quote_items[index].price) * (this.quotationData.quote_items[index].percentage_discount)) / 100;
    }
  }
  calculatePricepermonth(index) {
    if (this.quotationData.quote_items[index].discount != 0 && this.quotationData.quote_items[index].percentage_discount != 0) {
      this.quotationData.quote_items[index].price = ((this.quotationData.quote_items[index].discount) * 100) / (this.quotationData.quote_items[index].percentage_discount);
    }
  }
  calculateB2Bdiscountpermonth(index) {

    if (this.quotationData.quote_items[index].discount != 0 && this.quotationData.quote_items[index].price != 0) {
      this.quotationData.quote_items[index].percentage_discount = ((this.quotationData.quote_items[index].discount) * 100) / (this.quotationData.quote_items[index].price);
    }
  }
  itemtotal(index, prod) {
    this.quotationData.quote_items[index].is_total = ((this.quotationData.quote_items[index].price) - (this.quotationData.quote_items[index].discount)) * (this.quotationData.quote_items[index].is_qty);
    this.ps_data_price[prod.product_id].is_total = this.quotationData.quote_items[index].is_total;
  }
  salespermonthcalculation(index, prod) {
    this.quotationData.quote_items[index].is_sale_price = ((this.quotationData.quote_items[index].price) * (this.quotationData.quote_items[index].is_qty));
    this.ps_data_price[prod.product_id].is_sale_price = this.quotationData.quote_items[index].is_sale_price;
  }
  salesSubtotal() {
    this.quotationData.sale_sub_total = 0;
    for (var i = 0; i < this.quotationData.quote_items.length; i++) {
      this.quotationData.sale_sub_total = Number(this.quotationData.quote_items[i].is_sale_price) + Number(this.quotationData.sale_sub_total);
    }
  }
  SubTotal() {
    this.quotationData.sub_total = 0;
    for (var i = 0; i < this.quotationData.quote_items.length; i++) {
      this.quotationData.sub_total = Number(this.quotationData.quote_items[i].is_total) + Number(this.quotationData.sub_total);
    }
  }
  Total() {
    this.quotationData.total = Number(this.quotationData.sub_total) + Number(this.quotationData.quote.delivery_fee) + Number(this.quotationData.quote.pickup_fee) + Number(this.quotationData.quote.tax_amount)
  }
  MonthlyRent() {
    this.quotationData.quote.monthly_rent = Number(this.quotationData.sub_total)
  }
  fppriceChange(event, index, prod) {
    if (event == 0) {
      this.floorplanSummaries[index].price = this.copyoffloorplanSummariescopy[index].price;
      this.floorplanSummaries[index].b2b_discount = this.copyoffloorplanSummariescopy[index].b2b_discount;
      this.floorplanSummaries[index].discount = this.copyoffloorplanSummariescopy[index].discount;
    }
    else {
      this.floorplanSummaries[index].price = event;
      this.ps_data_price_in[prod.product_id].price = this.floorplanSummaries[index].price;
      this.CalculatefpDiscount(index, prod);
      this.CalculatefpB2BDiscount(index, prod);
      this.Calculatefpprice(index, prod);
      this.calculatefpitemTotal(index, prod);
      this.salesFpPrice(index, prod);
      this.FpSubtotal();
      this.fpTotal();
      // this.fpMonthlyrentCalculation();
    }

  }
  fpDiscountChange(event, index, prod) {
    if (event == 0) {
      this.floorplanSummaries[index].price = this.copyoffloorplanSummariescopy[index].price;
      this.floorplanSummaries[index].b2b_discount = this.copyoffloorplanSummariescopy[index].b2b_discount;
      this.floorplanSummaries[index].discount = this.copyoffloorplanSummariescopy[index].discount;
    }
    else {
      this.floorplanSummaries[index].discount = event;
      this.CalculatefpDiscount(index, prod);
      this.CalculatefpB2BDiscount(index, prod);
      this.Calculatefpprice(index, prod);
      this.calculatefpitemTotal(index, prod);
      this.salesFpPrice(index, prod);
      this.FpSubtotal();
      this.fpTotal();
      // this.fpMonthlyrentCalculation();
    }
  }
  fpB2BDiscountchange(event, index, prod) {
    if (event == 0) {
      this.floorplanSummaries[index].price = this.copyoffloorplanSummariescopy[index].price;
      this.floorplanSummaries[index].b2b_discount = this.copyoffloorplanSummariescopy[index].b2b_discount;
      this.floorplanSummaries[index].discount = this.copyoffloorplanSummariescopy[index].discount;
    }
    else {
      this.floorplanSummaries[index].b2b_discount = event;
      this.CalculatefpDiscount(index, prod);
      this.CalculatefpB2BDiscount(index, prod);
      this.Calculatefpprice(index, prod);
      this.calculatefpitemTotal(index, prod);
      this.salesFpPrice(index, prod);
      this.FpSubtotal();
      this.fpTotal();
      // this.fpMonthlyrentCalculation();
    }
  }

  Calculatefpprice(index, prod) {
    if (this.floorplanSummaries[index].discount != 0 && this.floorplanSummaries[index].b2b_discount != 0) {
      this.floorplanSummaries[index].price = ((this.floorplanSummaries[index].discount) * 100) / (this.floorplanSummaries[index].b2b_discount)
      this.ps_data_price_in[prod.product_id].price = this.floorplanSummaries[index].price;
    }
  }
  CalculatefpDiscount(index, prod) {
    if (this.floorplanSummaries[index].price != 0 && this.floorplanSummaries[index].b2b_discount != 0) {
      this.floorplanSummaries[index].discount = (this.floorplanSummaries[index].price * this.floorplanSummaries[index].b2b_discount) / 100;
    }
  }
  CalculatefpB2BDiscount(index, prod) {
    if (this.floorplanSummaries[index].discount != 0 && this.floorplanSummaries[index].price != 0) {
      this.floorplanSummaries[index].b2b_discount = (this.floorplanSummaries[index].discount * 100) / this.floorplanSummaries[index].price;
    }
  }
  calculatefpitemTotal(index, prod) {
    this.floorplanSummaries[index].is_total = (this.floorplanSummaries[index].price - this.floorplanSummaries[index].discount) * this.floorplanSummaries[index].is_qty;
    this.ps_data_price_in[prod.product_id].is_total = this.floorplanSummaries[index].is_total;
  }
  salesFpPrice(index, prod) {
    this.floorplanSummaries[index].is_sale_price = this.floorplanSummaries[index].price * this.floorplanSummaries[index].is_qty;
    this.ps_data_price_in[prod.product_id].is_sale_price = this.floorplanSummaries[index].is_sale_price;
  }
  FpSubtotal() {
    this.f_subtotal = 0;
    for (var i = 0; i < this.floorplanSummaries.length; i++) {
      this.f_subtotal = Number(this.floorplanSummaries[i].is_total) + Number(this.f_subtotal);
    }
  }
  fpTotal() {
    this.f_Tot_net_total = parseFloat(this.f_Tot_monthly_rent) + parseFloat(this.f_Tot_delevery_fee) + parseFloat(this.f_Tot_pickup_fee);
  }
  // fpMonthlyrentCalculation(){
  // console.log('fpUnitList',this.fpUnitList);
  // this.f_monthly_rent=0;
  //   for(var i=0;i<this.fpUnitList.length;i++)
  //   {
  //     this.quoteService.getFloorplanSummary(this.fpUnitList[i].floorplan_id,this.fpUnitList[i].sgid).subscribe(async resp => {
  //       if (resp.statusCode) {

  // this.f_monthly_rent=parseFloat(resp.subtotal)+Number(this.f_monthly_rent);
  //       }
  //   });

  // this.getFloorplanSummary(val.floorplan_id, val.sgid);

  //}
  // console.log(this.floorplanSummaries);
  // }



  UnitpriceChange(event, index, prod) {
    if (event.target.value == 0) {
      this.unitLevelProducts[index].price = this.copyofunitLevelProducts[index].price;
      this.unitLevelProducts[index].b2b_discount = this.copyofunitLevelProducts[index].b2b_discount;
      this.unitLevelProducts[index].discount = this.copyofunitLevelProducts[index].discount;
    }
    else {
      this.unitLevelProducts[index].price = event.target.value;

      this.CalculateUnitDiscount(index, prod);
      this.CalculateUnitB2BDiscount(index, prod);
      this.CalculateUnitprice(index, prod);
      this.calculateUnititemTotal(index, prod);
      this.salesUnitPrice(index, prod);
      this.UnitSubTotal();
    }

  }
  UnitDiscountChange(event, index, prod) {
    if (event.target.value == 0) {
      this.unitLevelProducts[index].price = this.copyofunitLevelProducts[index].price;
      this.unitLevelProducts[index].b2b_discount = this.copyofunitLevelProducts[index].b2b_discount;
      this.unitLevelProducts[index].discount = this.copyofunitLevelProducts[index].discount;
    }
    else {
      this.unitLevelProducts[index].discount = event.target.value;

      this.CalculateUnitB2BDiscount(index, prod);
      this.CalculateUnitprice(index, prod);
      this.calculateUnititemTotal(index, prod);
      this.salesUnitPrice(index, prod);
      this.UnitSubTotal();
      this.CalculateUnitDiscount(index, prod);
    }
  }
  UnitB2BDiscountchange(event, index, prod) {
    if (event.target.value == 0) {
      this.unitLevelProducts[index].price = this.copyofunitLevelProducts[index].price;
      this.unitLevelProducts[index].b2b_discount = this.copyofunitLevelProducts[index].b2b_discount;
      this.unitLevelProducts[index].discount = this.copyofunitLevelProducts[index].discount;
    }
    else {
      this.unitLevelProducts[index].b2b_discount = event.target.value;
      this.CalculateUnitDiscount(index, prod);
      this.CalculateUnitB2BDiscount(index, prod);
      this.CalculateUnitprice(index, prod);
      this.calculateUnititemTotal(index, prod);
      this.salesUnitPrice(index, prod);
      this.UnitSubTotal();
    }
  }
  CalculateUnitprice(index, prod) {
    if (this.unitLevelProducts[index].discount != 0 && this.unitLevelProducts[index].b2b_discount != 0) {
      this.unitLevelProducts[index].price = ((this.unitLevelProducts[index].discount) * 100) / (this.unitLevelProducts[index].b2b_discount);

    }
  }
  CalculateUnitDiscount(index, prod) {
    if (this.unitLevelProducts[index].price != 0 && this.unitLevelProducts[index].b2b_discount != 0) {
      this.unitLevelProducts[index].discount = (this.unitLevelProducts[index].price * this.unitLevelProducts[index].b2b_discount) / 100;
    }
  }
  CalculateUnitB2BDiscount(index, prod) {
    if (this.unitLevelProducts[index].discount != 0 && this.unitLevelProducts[index].price != 0) {
      this.unitLevelProducts[index].b2b_discount = (this.unitLevelProducts[index].discount * 100) / this.unitLevelProducts[index].price;
    }
  }
  calculateUnititemTotal(index, prod) {
    this.unitLevelProducts[index].is_total = (this.unitLevelProducts[index].price - this.unitLevelProducts[index].discount) * this.unitLevelProducts[index].is_qty;
  }
  salesUnitPrice(index, prod) {
    this.unitLevelProducts[index].is_sale_price = this.unitLevelProducts[index].price * this.unitLevelProducts[index].is_qty;
  }
  UnitSubTotal() {
    this.unitSubTotal = 0
    for (var i = 0; i < this.unitLevelProducts.length; i++) {
      this.unitSubTotal = Number(this.unitLevelProducts[i].is_total) + Number(this.unitSubTotal);
    }
  }
  keyPress(event) {
    this.checkNumberOnly = event.target.value;
    if (this.checkNumberOnly != null) {
      var numeric = (event.target.value).toString();
      if (numeric.includes('.')) {
        var checkNumeric = numeric.split('.');
        if (checkNumeric[1].length > 1) {
          return false;
        }
      }
      var value = event.target.value;
      if (value.length >= 1 && value[0] == '0') {
        return false;
      }
    }


  }

  getpickupFeeFp(event) {
    this.f_Tot_pickup_fee = event.target.value;
    this.fpTotal();
  }

  generateImagePDFData(quote_items) {
    let unique = {};
    this.imagePDFData = [];
    // for( let i=1; i<quote_items.length; i++) {
    //     if( unique[quote_items[i].product_images.small]) continue;
    //     unique[quote_items[i].product_images.small] = true;
    //     this.imagePDFData.push(quote_items[i]);
    // }

    for (let i = 0; i < quote_items.length; i++) {
      if (unique[quote_items[i].product_images.small]) continue;
      unique[quote_items[i].product_images.small] = true;
      if (i % 4 == 0) {
        let rows = [];
        rows.push({ image: quote_items[i].b64img, name: quote_items[i].name });
        this.imagePDFData.push(rows);
      } else {
        this.imagePDFData[this.imagePDFData.length - 1].push({ image: quote_items[i].b64img, name: quote_items[i].name });
      }
    }
  }

  deleteProduct(item: any) {
    this.spinner.show();
    this.quoteService.removeProduct({ quote_id: this.quoteId, item_id: item.sgid }).subscribe(data => {
      this.toastr.success('Product removed')
      this.getquotation(this.quoteId);
      this.spinner.hide();
    }, error => {
      this.toastr.success('Unable to remove');
      this.spinner.hide();
    })
  }
  currentNumber: any


  public increment(value: any, count: string) {
    if (this.test == 0 && this.quotationData?.quote.rent_adjustment_value > 0) {
      confirm('are you sure want to add `0`')
    }
    this.userAddedDiscount = this.test
    console.log(this.test);
    if (count == 'increment') {
      this.rentAdjustmentType = 1
    }
    if (this.isFloorplanview == true) {
      this.rentAdjustmentAPI()
      console.log(this.isFloorplanview);
    }else{
      this.saveRentAdjustmentAmount()
      console.log(this.isFloorplanview);
    }
    
  }



  public decrement(count: string) {

    this.getquotation(this.quoteId)
    if (this.test - 1 < 1) {
      return this.toastr.warning('No Value Is Added');
    } else if (this.quotationData?.quote.rent_adjustment_value == 0 || ((this.test) > (this.quotationData?.quote.rent_adjustment_value)) || this.quotationData?.quote.rent_adjustment_value != 0 ) {
      this.userAddedDiscount = this.test
    if (count == 'decrement') {
      this.rentAdjustmentType = 0;
    }
    console.log(this.test);
    if (this.isFloorplanview === true) {
      console.log(this.isFloorplanview);
      this.rentAdjustmentAPI()
    }else{
      this.saveRentAdjustmentAmount()
    }
    console.log(this.quotationData?.quote.rent_adjustment_value == 0)
  }else if ((((+this.test) + (+this.quotationData?.quote.rent_adjustment_value)) < this.quotationData?.quote?.monthly_rent)) {
    console.log((+this.test) + (+this.quotationData?.quote.rent_adjustment_value))
      this.toastr.error('Adjustment amount can not be less than Monthly Rent'); 
    }
    else {
      this.userAddedDiscount = this.test
      if (count == 'decrement') {
        this.rentAdjustmentType = 0;
      }
      console.log(this.test);
      if (this.isFloorplanview === true) {
        console.log(this.isFloorplanview);
        this.rentAdjustmentAPI()
      }else{
        this.saveRentAdjustmentAmount()
      }
    }
   
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

  updateRent1(event) {
    this.spinner.show()
    this.monthNums1 = event.target.value;
    let temp = 36 - (this.monthNums1);
    // this.rentPrice = this.itemInfo?.variations[this.activeIndex]?.default_price[temp]?.rental_price;
    let obj ={
      "quote_id":this.quoteId,
			"month":this.monthNums1
    }
    this.quoteService.rentUpdates(obj).subscribe((response:any)=>{
      console.log(response)
    this.spinner.hide()
      this.getquotation(this.quoteId)
      this.updateTotal(response)
      this.calculateQuoteTotal()
    })
  }

  searchRentUpdate() {
    let obj = {
      "quote_id": this.quoteId,
      "month": this.monthNums1
    }
    this.quoteService.rentUpdates(obj).subscribe((response: any) => {
      console.log(response)
    this.spinner.hide()
      this.getquotation(this.quoteId)
    })
  }

  resignItemPop(data,content){
    this.resignOriginalItem = [data];
    this.originalQuantity =  [data.is_qty];
    this.resignitem = data?.reassign_items;
    this.resignQuantity =  this.resignitem.reduce((a,b)=>{
      return (a.qty + b.qty)
    })
    this.resignSignalQuantity = this.resignQuantity?.qty
    this.modalService.open(content,this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  onItemChange(data){
    console.log(data.target.value)
    this.deliveryFeeShow = data.target.value;
    // this.quoteDeliveryFee = ''
    this.quoteOrderDeliveryFee = ''
    if(data.target.value){
      Checked:true
    }
  }
}
