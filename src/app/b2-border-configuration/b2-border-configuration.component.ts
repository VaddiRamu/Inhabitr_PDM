import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteService } from '../services/quote.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-b2-border-configuration',
  templateUrl: './b2-border-configuration.component.html',
  styleUrls: ['./b2-border-configuration.component.css']
})
export class B2BOrderConfigurationComponent implements OnInit {

  b2borderconfigurationForm;
  b2bconfigdata: any;
  isSubmitted = false;
  noInventorySelected: string;

  noInventoryAttr = [
    {name: 'Inhabitr Inv is 0', value: 'inhabitr'},
    {name: 'Supplier Inv is 0', value: 'supplier'},
    {name: 'Either Inhabitr Inv or Supplier Inv is 0', value: 'all'},
    {name: 'Both Inhabitr Inv or Supplier Inv are 0', value: 'both'}
  ];

  constructor(private formBuilder: UntypedFormBuilder, private quoteService: QuoteService, private toastr: ToastrService, private spinner: NgxSpinnerService, ) { }

  ngOnInit(): void {
    if (localStorage.getItem('noInventoryFilter')) {
      this.noInventorySelected = localStorage.getItem('noInventoryFilter');
    }
    this.getB2BorderDetails();
    this.b2borderconfigurationForm = this.formBuilder.group({
      B2B_PRODUCT_QTY1: ['', Validators.required],
      B2B_PRODUCT_DISCOUNT1: ['', Validators.required],
      B2B_PACKAGE_QTY1: ['', Validators.required],
      B2B_PACKAGE_DISCOUNT1: ['', Validators.required],
      B2B_PRODUCT_QTY2: ['', Validators.required],
      B2B_PRODUCT_DISCOUNT2: ['', Validators.required],
      B2B_PACKAGE_QTY2: ['', Validators.required],
      B2B_PACKAGE_DISCOUNT2: ['', Validators.required],
      B2B_PRODUCT_QTY3: ['', Validators.required],
      B2B_PRODUCT_DISCOUNT3: ['', Validators.required],
      B2B_PACKAGE_QTY3: ['', Validators.required],
      B2B_PACKAGE_DISCOUNT3: ['', Validators.required],
      B2B_PRODUCT_QTY4: ['', Validators.required],
      B2B_PRODUCT_DISCOUNT4: ['', Validators.required],
      B2B_PACKAGE_QTY4: ['', Validators.required],
      B2B_PACKAGE_DISCOUNT4: ['', Validators.required],
      B2B_MAX_UNIT: ['', Validators.required],
      // saleasset: ['', Validators.required],
      // fmultipler: ['', Validators.required],
      // invoicegenerate: ['', Validators.required]
    });
  }
  getB2BorderDetails() {
    this.quoteService.getb2borderDetails().subscribe(resp => {
      this.b2bconfigdata = resp.result;
      this.b2borderconfigurationForm.patchValue({
        B2B_PRODUCT_QTY1: this.b2bconfigdata.B2B_PRODUCT_QTY1,
        B2B_PRODUCT_DISCOUNT1: this.b2bconfigdata.B2B_PRODUCT_DISCOUNT1,
        B2B_PACKAGE_QTY1: this.b2bconfigdata.B2B_PACKAGE_QTY1,
        B2B_PACKAGE_DISCOUNT1: this.b2bconfigdata.B2B_PACKAGE_DISCOUNT1,
        B2B_PRODUCT_QTY2: this.b2bconfigdata.B2B_PRODUCT_QTY2,
        B2B_PRODUCT_DISCOUNT2: this.b2bconfigdata.B2B_PRODUCT_DISCOUNT2,
        B2B_PACKAGE_QTY2: this.b2bconfigdata.B2B_PACKAGE_QTY2,
        B2B_PACKAGE_DISCOUNT2: this.b2bconfigdata.B2B_PACKAGE_DISCOUNT2,
        B2B_PRODUCT_QTY3: this.b2bconfigdata.B2B_PRODUCT_QTY3,
        B2B_PRODUCT_DISCOUNT3: this.b2bconfigdata.B2B_PRODUCT_DISCOUNT3,
        B2B_PACKAGE_QTY3: this.b2bconfigdata.B2B_PACKAGE_QTY3,
        B2B_PACKAGE_DISCOUNT3: this.b2bconfigdata.B2B_PACKAGE_DISCOUNT3,
        B2B_PRODUCT_QTY4: this.b2bconfigdata.B2B_PRODUCT_QTY4,
        B2B_PRODUCT_DISCOUNT4: this.b2bconfigdata.B2B_PRODUCT_DISCOUNT4,
        B2B_PACKAGE_QTY4: this.b2bconfigdata.B2B_PACKAGE_QTY4,
        B2B_PACKAGE_DISCOUNT4: this.b2bconfigdata.B2B_PACKAGE_DISCOUNT4,
        B2B_MAX_UNIT: this.b2bconfigdata.B2B_MAX_UNIT,
      // Qty5: this.b2bconfigdata.B2B_PRODUCT_QTY1,
      // Discount5: this.b2bconfigdata.B2B_PRODUCT_QTY1,
      // Qtypack5: this.b2bconfigdata.B2B_PRODUCT_QTY1,
      // Discountpack5: this.b2bconfigdata.B2B_PRODUCT_QTY1
      });
    });

  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.b2borderconfigurationForm.invalid  ) {
      return false;
    }

    this.quoteService.updateB2Borderconfig(this.b2borderconfigurationForm.value).subscribe(resp => {
      if (resp.statusCode === 200) {

        this.spinner.hide();

        this.toastr.success(resp.message);
       } else {
        this.spinner.hide();
        this.toastr.success('Try again Later.');
       }
     }, error => {});


  }

  switchProductMode() {
    localStorage.setItem('noInventoryFilter', this.noInventorySelected);
    this.toastr.success('Mode applied sucessfully.');
  }

  clearProductMode() {
    this.noInventorySelected = null;
    localStorage.removeItem('noInventoryFilter');
    this.toastr.success('Mode removed sucessfully.');
  }

}
